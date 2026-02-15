const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  getPendingLawyers,
  updateLawyerApprovalStatus,
} = require("../controllers/adminLawyerController");

// ✅ Pending lawyers list
router.get("/pending", auth, role("admin"), getPendingLawyers);

// ✅ Approve / Reject
router.put("/:id/approval", auth, role("admin"), updateLawyerApprovalStatus);

module.exports = router;
