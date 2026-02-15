const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
  resume: String,
  appliedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
