const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "LOGIN_SUCCESS",
        "LOGIN_FAILURE",
        "OTP_SENT",
        "OTP_VERIFIED",
        "OTP_FAILED",
        "MFA_ENABLED",
        "MFA_DISABLED",
        "PASSWORD_CHANGE",
        "SECURITY_QUESTIONS_UPDATED",
        "UNAUTHORIZED_ACCESS_ATTEMPT"
      ]
    },
    ipAddress: {
      type: String,
      required: true
    },
    userAgent: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ["success", "failure"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("SecurityLog", securityLogSchema);
