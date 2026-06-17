const express = require("express");
const router = express.Router();

const { getAdminStats, getAnalytics, getVolunteers } = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

router.get("/stats", protect, adminOnly, getAdminStats);
router.get("/analytics", protect, adminOnly, getAnalytics);
router.get("/volunteers", protect, adminOnly, getVolunteers);


module.exports = router;
