const User = require("../models/User");
const AdminRequest = require("../models/AdminRequest");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const otpVerification = require("../templates/otpVerification");
const { logSecurityEvent } = require("../utils/securityLogger");
const SecurityLog = require("../models/SecurityLog");

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
};

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        message:
          "All fields are required",
      });
    }

    const userExists =
      await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    if (role === "admin") {
      const pendingRequest = await AdminRequest.findOne({ email, status: "pending" });
      if (pendingRequest) {
        return res.status(400).json({
          message: "An admin registration request for this email is already pending approval."
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await AdminRequest.create({
        name,
        email,
        password: hashedPassword,
        status: "pending"
      });

      return res.status(202).json({
        message: "Admin registration request submitted successfully. It is pending approval by an existing administrator."
      });
    }

    const salt =
      await bcrypt.genSalt(10);

    const hashedPassword =
      await bcrypt.hash(
        password,
        salt
      );

    const user =
      await User.create({
        name,
        email,
        password: hashedPassword,
      });

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    throw error;
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      // Check if there's a pending or rejected admin request
      const adminReq = await AdminRequest.findOne({ email });
      if (adminReq) {
        if (adminReq.status === "pending") {
          return res.status(403).json({
            message: "Your admin registration request is pending approval by an existing administrator."
          });
        } else if (adminReq.status === "rejected") {
          return res.status(403).json({
            message: "Your admin registration request was rejected by an administrator."
          });
        }
      }

      await logSecurityEvent({
        req,
        email,
        eventType: "LOGIN_FAILURE",
        status: "failure"
      });
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      await logSecurityEvent({
        req,
        userId: user._id,
        email: user.email,
        eventType: "LOGIN_FAILURE",
        status: "failure"
      });
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (user.mfaEnabled) {
      // Generate secure 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Hash and save OTP to user record
      const salt = await bcrypt.genSalt(10);
      user.mfaSecret = await bcrypt.hash(otp, salt);
      user.mfaSecretExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
      await user.save();

      // Generate a temporary verification token
      const tempToken = jwt.sign(
        { id: user._id, type: "mfa_pending" },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
      );

      // Send Email
      try {
        const html = otpVerification(user.name, otp);
        await sendEmail({
          to: user.email,
          subject: "Your VolunteerHub Verification Code",
          html
        });

        await logSecurityEvent({
          req,
          userId: user._id,
          email: user.email,
          eventType: "OTP_SENT",
          status: "success"
        });
      } catch (err) {
        console.error("Failed to send MFA OTP Email:", err);
      }

      return res.json({
        mfaRequired: true,
        mfaToken: tempToken
      });
    }

    await logSecurityEvent({
      req,
      userId: user._id,
      email: user.email,
      eventType: "LOGIN_SUCCESS",
      status: "success"
    });

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    throw error;
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -securityQuestions.answerHash");
    res.json(user);
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isSecuritySensitive = req.body.password || req.body.mfaEnabled !== undefined || req.body.securityQuestions;

    if (isSecuritySensitive) {
      if (!req.body.currentPassword) {
        return res.status(400).json({
          message: "Current password is required to update security settings"
        });
      }
      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({
          message: "Incorrect current password"
        });
      }
    }

    user.name = req.body.name || user.name;
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.city !== undefined) user.city = req.body.city;
    if (req.body.profileImage !== undefined) user.profileImage = req.body.profileImage;
    if (req.body.skills !== undefined) user.skills = req.body.skills;

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
      
      await logSecurityEvent({
        req,
        userId: user._id,
        email: user.email,
        eventType: "PASSWORD_CHANGE",
        status: "success"
      });
    }

    if (req.body.mfaEnabled !== undefined) {
      const oldMfa = user.mfaEnabled;
      user.mfaEnabled = req.body.mfaEnabled;
      if (oldMfa !== user.mfaEnabled) {
        await logSecurityEvent({
          req,
          userId: user._id,
          email: user.email,
          eventType: user.mfaEnabled ? "MFA_ENABLED" : "MFA_DISABLED",
          status: "success"
        });
      }
    }

    if (req.body.securityQuestions) {
      const hashedQuestions = [];
      for (const item of req.body.securityQuestions) {
        const salt = await bcrypt.genSalt(10);
        const answerHash = await bcrypt.hash(item.answer.toLowerCase().trim(), salt);
        hashedQuestions.push({
          question: item.question,
          answerHash
        });
      }
      user.securityQuestions = hashedQuestions;
      
      await logSecurityEvent({
        req,
        userId: user._id,
        email: user.email,
        eventType: "SECURITY_QUESTIONS_UPDATED",
        status: "success"
      });
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      city: updatedUser.city,
      profileImage: updatedUser.profileImage,
      skills: updatedUser.skills,
      mfaEnabled: updatedUser.mfaEnabled,
      securityQuestions: updatedUser.securityQuestions.map(q => ({ question: q.question, _id: q._id }))
    });
  } catch (error) {
    throw error;
  }
};

const verifyMfa = async (req, res) => {
  try {
    const { token, otp } = req.body;
    if (!token || !otp) {
      return res.status(400).json({ message: "Token and OTP code are required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.type !== "mfa_pending") {
      return res.status(400).json({ message: "Invalid verification token" });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.mfaSecret || !user.mfaSecretExpires || Date.now() > user.mfaSecretExpires) {
      await logSecurityEvent({
        req,
        userId: user._id,
        email: user.email,
        eventType: "OTP_FAILED",
        status: "failure"
      });
      return res.status(400).json({ message: "Verification code expired. Please request a new one." });
    }

    const isMatch = await bcrypt.compare(otp, user.mfaSecret);
    if (!isMatch) {
      await logSecurityEvent({
        req,
        userId: user._id,
        email: user.email,
        eventType: "OTP_FAILED",
        status: "failure"
      });
      return res.status(400).json({ message: "Invalid verification code" });
    }

    // Success - Clear OTP fields
    user.mfaSecret = undefined;
    user.mfaSecretExpires = undefined;
    await user.save();

    await logSecurityEvent({
      req,
      userId: user._id,
      email: user.email,
      eventType: "OTP_VERIFIED",
      status: "success"
    });

    await logSecurityEvent({
      req,
      userId: user._id,
      email: user.email,
      eventType: "LOGIN_SUCCESS",
      status: "success"
    });

    const authToken = generateToken(user._id);
    setTokenCookie(res, authToken);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: authToken,
    });
  } catch (error) {
    throw error;
  }
};

const verifySecurityQuestion = async (req, res) => {
  try {
    const { question, answer } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ message: "Question and answer are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const storedQuestion = user.securityQuestions.find(q => q.question === question);
    if (!storedQuestion) {
      return res.status(400).json({ message: "Security question not found for this user" });
    }

    const isMatch = await bcrypt.compare(answer.toLowerCase().trim(), storedQuestion.answerHash);
    if (!isMatch) {
      return res.status(400).json({ verified: false, message: "Incorrect answer" });
    }

    res.json({ verified: true });
  } catch (error) {
    throw error;
  }
};

const getSecurityLogs = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      await logSecurityEvent({
        req,
        userId: req.user.id,
        email: req.user.email,
        eventType: "UNAUTHORIZED_ACCESS_ATTEMPT",
        status: "failure"
      });
      return res.status(403).json({ message: "Access denied" });
    }

    const logs = await SecurityLog.find()
      .populate("userId", "name email role")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    throw error;
  }
};

const logoutUser = async (req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "strict"
  });
  res.json({ message: "Logged out successfully" });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  verifyMfa,
  verifySecurityQuestion,
  getSecurityLogs,
  logoutUser
};