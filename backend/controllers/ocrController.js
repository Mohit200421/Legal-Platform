const Tesseract = require("tesseract.js");
const Document = require("../models/Document");
const OCRExtract = require("../models/OCRExtract");

exports.extractText = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    // ✅ If OCR already done, return old OCR
    if (doc.ocrTextId) {
      const oldOCR = await OCRExtract.findById(doc.ocrTextId);
      return res.json({ msg: "OCR already completed", ocr: oldOCR });
    }

    const result = await Tesseract.recognize(doc.path, "eng");

    const ocrData = await OCRExtract.create({
      documentId: doc._id,
      extractedText: result.data.text,
    });

    doc.ocrTextId = ocrData._id;
    await doc.save();

    res.json({ msg: "OCR Completed", ocr: ocrData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET OCR TEXT
exports.getOCRText = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    if (!doc.ocrTextId) {
      return res.status(404).json({ msg: "OCR not done yet" });
    }

    const ocr = await OCRExtract.findById(doc.ocrTextId);
    if (!ocr) return res.status(404).json({ msg: "OCR text not found" });

    res.json(ocr);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
