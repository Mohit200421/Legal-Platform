const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  location: String,
  qualification: String,
  description: String,
  contactEmail: String,
  contactPhone: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Job", JobSchema);
