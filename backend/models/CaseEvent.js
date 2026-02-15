const mongoose = require("mongoose");

const caseEventSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.Types.ObjectId, ref: "Case", required: true },
    eventTitle: { type: String, required: true },
    eventDetails: { type: String },
    eventDate: { type: Date, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CaseEvent", caseEventSchema);
