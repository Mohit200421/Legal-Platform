const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  username: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },

  role: { type: String, enum: ["admin", "lawyer", "user"], default: "user" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },

  cityId: { type: mongoose.Schema.Types.ObjectId, ref: "City", default: null },
  stateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "State",
    default: null,
  },

  specialization: { type: String, default: "" },

  // ✅ Lawyer Profile Fields (Editable later in Lawyer Panel)
  phone: { type: String, default: "" },
  barId: { type: String, default: "" },
  experience: { type: Number, default: 0 },
  about: { type: String, default: "" },

  // ✅ Lawyer Approval System
  // user = none, lawyer = pending/approved/rejected
  lawyerApprovalStatus: {
    type: String,
    enum: ["none", "pending", "approved", "rejected"],
    default: "none",
  },

  // ✅ EMAIL VERIFICATION
  isEmailVerified: { type: Boolean, default: false },

  // ✅ PASSWORD RESET
  resetOtpHash: { type: String, default: null },
  resetOtpExpiresAt: { type: Date, default: null },

  // ✅ OTP SYSTEM
  otpCodeHash: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", UserSchema);
