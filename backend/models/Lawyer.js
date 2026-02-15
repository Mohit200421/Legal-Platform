const mongoose = require("mongoose");

const LawyerSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    phone: String,
    experience: Number,

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    city: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "City",
      required: true,
    },

    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },

    profileImage: String,

    documents: [String],

    status: {
      type: String,
      enum: ["pending", "approved", "blocked"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Lawyer", LawyerSchema);
