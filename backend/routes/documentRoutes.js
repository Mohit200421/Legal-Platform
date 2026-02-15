const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const upload = require("../config/multer");

const {
  uploadDocument,
  downloadDocument,
  attachDocumentToCase
} = require("../controllers/documentController");

// UPLOAD DOCUMENT
router.post("/upload", auth, upload.single("file"), uploadDocument);

// DOWNLOAD DOCUMENT
router.get("/:id/download", auth, downloadDocument);

// ATTACH DOCUMENT TO CASE (Lawyer Only)
router.post("/attach", auth, role("lawyer"), attachDocumentToCase);

module.exports = router;
