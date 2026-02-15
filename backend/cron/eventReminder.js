const cron = require("node-cron");
const CaseEvent = require("../models/CaseEvent");
const Case = require("../models/Case");
const { sendEmail } = require("../utils/emailService");

// Runs every day at 9 AM
cron.schedule("0 9 * * *", async () => {
  console.log("⏰ Running daily reminders...");

  const today = new Date().toISOString().split("T")[0];

  const events = await CaseEvent.find();
  
  for (const ev of events) {
    const eventDate = new Date(ev.eventDate).toISOString().split("T")[0];

    if (today === eventDate) {
      const caseData = await Case.findById(ev.caseId).populate("lawyerId");

      await sendEmail(
        caseData.lawyerId.email,
        "Case Event Reminder",
        `<h2>Reminder!</h2>
         <p>Today you have a scheduled event for case: 
         <strong>${caseData.caseTitle}</strong></p>
         <p>Event: ${ev.eventTitle}</p>`
      );
    }
  }
});
