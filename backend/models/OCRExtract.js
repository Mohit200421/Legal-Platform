const mongoose = require("mongoose");

const OCRExtractSchema = new mongoose.Schema({
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
  extractedText: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("OCRExtract", OCRExtractSchema);
