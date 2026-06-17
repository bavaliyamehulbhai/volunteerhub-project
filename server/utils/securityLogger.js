const SecurityLog = require("../models/SecurityLog");

/**
 * Utility to log security events.
 * 
 * @param {Object} params
 * @param {Object} params.req - Express request object
 * @param {string} [params.userId] - Optional User ObjectId
 * @param {string} params.email - User email address
 * @param {string} params.eventType - Type of security event (enum)
 * @param {string} params.status - 'success' or 'failure'
 */
const logSecurityEvent = async ({ req, userId, email, eventType, status }) => {
  try {
    const ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "Unknown IP";
    const userAgent = req.headers["user-agent"] || "Unknown User Agent";

    await SecurityLog.create({
      userId: userId || null,
      email: email.toLowerCase(),
      eventType,
      ipAddress,
      userAgent,
      status
    });
  } catch (error) {
    console.error("Error logging security event:", error);
  }
};

module.exports = {
  logSecurityEvent
};
