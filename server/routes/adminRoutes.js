const express = require("express");
const router = express.Router();

const { 
  getAdminStats, 
  getAnalytics, 
  getVolunteers,
  getAdminRequests,
  approveAdminRequest,
  rejectAdminRequest
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/analytics", protect, adminOnly, getAnalytics);
router.get("/volunteers", protect, adminOnly, getVolunteers);
router.get("/requests", protect, adminOnly, getAdminRequests);
router.post("/requests/:id/approve", protect, adminOnly, approveAdminRequest);
router.post("/requests/:id/reject", protect, adminOnly, rejectAdminRequest);

module.exports = router;
