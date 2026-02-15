const Document = require("../models/Document");
const Case = require("../models/Case");

exports.uploadDocument = async (req, res) => {
  try {
    const doc = await Document.create({
      uploaderId: req.user.id,
      filename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
    });

    res.json({ msg: "Document uploaded", doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.downloadDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc) return res.status(404).json({ msg: "Document not found" });

  res.download(doc.path);
};

exports.attachDocumentToCase = async (req, res) => {
  try {
    const { documentId, caseId } = req.body;

    const caseData = await Case.findById(caseId);

    if (!caseData) return res.status(404).json({ msg: "Case not found" });

    if (!caseData.documents) caseData.documents = [];

    caseData.documents.push(documentId);
    await caseData.save();

    res.json({ msg: "Document attached to case", case: caseData });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
