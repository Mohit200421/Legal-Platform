const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Safe Email Sender (won't crash API)
exports.sendEmail = async (to, subject, html) => {
  try {
    // If env not set, skip sending
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log("⚠️ Email not configured. Skipping email...");
      return;
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent to:", to);
  } catch (err) {
    console.log("❌ Email send failed:", err.message);
    // ✅ Don't throw error, so API continues working
    return;
  }
};
