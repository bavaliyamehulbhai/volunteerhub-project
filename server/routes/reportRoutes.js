const express = require("express");
const router = express.Router();

const {
  getSummaryReport,
  exportApplicationsCSV,
  exportPDFReport
} = require("../controllers/reportController");

const {
  protect
} = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/roleMiddleware");

router.get(
  "/summary",
  protect,
  adminOnly,
  getSummaryReport
);

router.get(
  "/export-csv",
  protect,
  adminOnly,
  exportApplicationsCSV
);

router.get(
  "/export-pdf",
  protect,
  adminOnly,
  exportPDFReport
);

module.exports = router;
