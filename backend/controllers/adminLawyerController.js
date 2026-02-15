const User = require("../models/User");
const { sendEmail } = require("../utils/emailService");

// ✅ Get all lawyer requests (pending)
exports.getPendingLawyers = async (req, res) => {
  try {
    const lawyers = await User.find({
      role: "lawyer",
      lawyerApprovalStatus: "pending",
    }).select("-passwordHash");

    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// ✅ Approve / Reject lawyer
exports.updateLawyerApprovalStatus = async (req, res) => {
  try {
    const { status } = req.body; // approved / rejected

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const lawyer = await User.findById(req.params.id);

    if (!lawyer || lawyer.role !== "lawyer") {
      return res.status(404).json({ msg: "Lawyer not found" });
    }

    lawyer.lawyerApprovalStatus = status;
    await lawyer.save();

    // ✅ optional email notification
    try {
      await sendEmail(
        lawyer.email,
        "Lawyer Account Approval Status",
        `
          <h2>LawSetu Lawyer Account</h2>
          <p>Hello <b>${lawyer.name}</b>,</p>
          <p>Your lawyer account request has been <b>${status.toUpperCase()}</b>.</p>
          <p>Thank you.</p>
        `
      );
    } catch (e) {}

    res.json({ msg: `Lawyer ${status} successfully`, lawyer });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
