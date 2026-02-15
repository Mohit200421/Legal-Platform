const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const { extractText, getOCRText } = require("../controllers/ocrController");

// ✅ Run OCR
router.get("/:id", auth, extractText);

// ✅ Get OCR text
router.get("/text/:id", auth, getOCRText);

module.exports = router;
