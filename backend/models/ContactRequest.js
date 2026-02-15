const mongoose = require("mongoose");

const contactRequestSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    subject: { type: String, required: true },
    message: { type: String, required: true },

    status: { type: String, default: "Pending" }, // Pending / Accepted / Rejected
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactRequest", contactRequestSchema);
