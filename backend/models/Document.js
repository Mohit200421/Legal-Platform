const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  uploaderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  assignedUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },

  filename: String,
  path: String,
  mimetype: String,
  ocrTextId: { type: mongoose.Schema.Types.ObjectId, ref: "OCRExtract" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
