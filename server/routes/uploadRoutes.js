const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/roleMiddleware");

// Depending on if you have protect/adminOnly middleware, we apply them here.
// Assuming authMiddleware exports them.
router.post("/", protect, adminOnly, upload.single("image"), (req, res) => {
  res.json({
    imageUrl: req.file.path
  });
});

module.exports = router;
