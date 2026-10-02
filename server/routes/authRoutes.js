const express =
  require("express");

const router =
  express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  verifyMfa,
  verifySecurityQuestion,
  getSecurityLogs,
  logoutUser,
  deleteSecurityLog,
  clearSecurityLogs
} = require(
  "../controllers/authController"
);

const {
  protect,
} = require(
  "../middleware/authMiddleware"
);

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);

router.post(
  "/logout",
  logoutUser
);

router.post(
  "/verify-mfa",
  verifyMfa
);

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  updateProfile
);

router.post(
  "/verify-question",
  protect,
  verifySecurityQuestion
);

router.get(
  "/security-logs",
  protect,
  getSecurityLogs
);

router.delete(
  "/security-logs",
  protect,
  clearSecurityLogs
);

router.delete(
  "/security-logs/:id",
  protect,
  deleteSecurityLog
);

module.exports = router;