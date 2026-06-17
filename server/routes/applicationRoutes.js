const express = require("express");
const router = express.Router();

const { applyEvent, getMyApplications, getAllApplications, updateApplicationStatus, getApplicationStats } = require("../controllers/applicationController");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

router.get("/my", protect, getMyApplications);
router.get("/stats", protect, getApplicationStats);
router.get("/", protect, adminOnly, getAllApplications);
router.patch("/:id", protect, adminOnly, updateApplicationStatus);
router.post("/", protect, applyEvent);

module.exports = router;
