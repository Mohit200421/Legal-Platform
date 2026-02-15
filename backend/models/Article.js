const mongoose = require("mongoose");

const ArticleSchema = new mongoose.Schema({
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  subject: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Article", ArticleSchema);
