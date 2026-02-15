const mongoose = require("mongoose");

const caseSchema = new mongoose.Schema(
  {
    lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caseTitle: { type: String, required: true },
    clientName: { type: String, required: true },
    caseType: { type: String, required: true },
    status: { type: String, default: "Open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Case", caseSchema);
