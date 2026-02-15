const path = require("path");

const Article = require("../models/Article");
const Document = require("../models/Document");
const Case = require("../models/Case");
const CaseEvent = require("../models/CaseEvent");
const News = require("../models/News");
const Job = require("../models/Job"); 
const JobApplication = require("../models/JobApplication");
const Discussion = require("../models/Discussion");
const { sendEmail } = require("../utils/emailService");
const ContactRequest = require("../models/ContactRequest");

// ---------------- ARTICLE CRUD -----------------

// ADD ARTICLE
exports.addArticle = async (req, res) => {
  try {
    const article = await Article.create({
      authorId: req.user.id,
      subject: req.body.subject,
      description: req.body.description,
    });

    res.json({ msg: "Article added", article });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ARTICLES OF LOGGED-IN LAWYER
exports.getArticles = async (req, res) => {
  try {
    const articles = await Article.find({ authorId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE ARTICLE (only own article)
exports.updateArticle = async (req, res) => {
  try {
    const updated = await Article.findOneAndUpdate(
      { _id: req.params.id, authorId: req.user.id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Article not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE ARTICLE (only own article)
exports.deleteArticle = async (req, res) => {
  try {
    const deleted = await Article.findOneAndDelete({
      _id: req.params.id,
      authorId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ msg: "Article not found" });

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- DOCUMENT UPLOAD + CRUD -----------------

exports.uploadDocument = async (req, res) => {
  try {
    const { assignedUserId } = req.body; // ✅ user selected by lawyer

    if (!req.file) {
      return res.status(400).json({ msg: "File is required" });
    }

    const doc = await Document.create({
      uploaderId: req.user.id,
      assignedUserId: assignedUserId || null, // ✅ save userId if provided
      filename: req.file.originalname,
      path: req.file.path,
      mimetype: req.file.mimetype,
    });

    res.json({ msg: "Document uploaded", doc });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploaderId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("assignedUserId", "name email");

    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// DELETE DOCUMENT (only own document)
exports.deleteDocument = async (req, res) => {
  try {
    const deleted = await Document.findOneAndDelete({
      _id: req.params.id,
      uploaderId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ msg: "Document not found" });

    res.json({ msg: "Document removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OPTIONAL: VIEW DOCUMENT (only works if you enable route)
exports.viewDocument = async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      uploaderId: req.user.id,
    });

    if (!doc) return res.status(404).json({ msg: "Document not found" });

    const absolutePath = path.resolve(doc.path);

    res.setHeader("Content-Disposition", `inline; filename="${doc.filename}"`);
    res.setHeader("Content-Type", doc.mimetype || "application/pdf");

    return res.sendFile(absolutePath);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- DISCUSSION -----------------

exports.createDiscussion = async (req, res) => {
  try {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({ msg: "Title and message are required" });
    }

    const discussion = await Discussion.create({
      lawyerId: req.user.id,
      title,
      message,
    });

    res.json({ msg: "Discussion created", discussion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDiscussion = async (req, res) => {
  try {
    const discussions = await Discussion.find({ lawyerId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- CASE CRUD -----------------

exports.addCase = async (req, res) => {
  try {
    const { caseTitle, clientName, caseType } = req.body;

    if (!caseTitle || !clientName || !caseType) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const newCase = await Case.create({
      lawyerId: req.user.id,
      caseTitle,
      clientName,
      caseType,
    });

    res.json({ msg: "Case created", newCase });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getCases = async (req, res) => {
  try {
    const cases = await Case.find({ lawyerId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCase = async (req, res) => {
  try {
    const deleted = await Case.findOneAndDelete({
      _id: req.params.id,
      lawyerId: req.user.id,
    });

    if (!deleted) return res.status(404).json({ msg: "Case not found" });

    res.json({ msg: "Case deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------- CASE EVENTS -----------------

exports.getCaseEvents = async (req, res) => {
  try {
    const events = await CaseEvent.find({ caseId: req.params.caseId }).sort({
      eventDate: 1,
    });

    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ADD CASE EVENT + EMAIL NOTIFICATION (secure)
exports.addCaseEvent = async (req, res) => {
  try {
    const { caseId, eventTitle, eventDetails, eventDate } = req.body;

    if (!caseId || !eventTitle || !eventDate) {
      return res
        .status(400)
        .json({ msg: "caseId, eventTitle and eventDate are required" });
    }

    // ✅ Ensure case belongs to logged-in lawyer
    const caseData = await Case.findOne({
      _id: caseId,
      lawyerId: req.user.id,
    }).populate("lawyerId");

    if (!caseData) {
      return res.status(404).json({ msg: "Case not found or not authorized" });
    }

    const event = await CaseEvent.create({
      caseId,
      eventTitle,
      eventDetails,
      eventDate: new Date(eventDate),
    });

    // ✅ Email won't crash now
    await sendEmail(
      caseData.lawyerId.email,
      "New Case Event Added",
      `<h3>New Case Event Added</h3>
       <p>Case: ${caseData.caseTitle}</p>
       <p>Event: ${eventTitle}</p>
       <p>Date: ${eventDate}</p>`
    );

    res.json({ msg: "Case event added", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLawyerDashboardStats = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    const totalArticles = await Article.countDocuments({ authorId: lawyerId });
    const totalDocuments = await Document.countDocuments({ uploaderId: lawyerId });
    const totalCases = await Case.countDocuments({ lawyerId });

    // upcoming events (next 7 days)
    const today = new Date();
    const next7Days = new Date();
    next7Days.setDate(today.getDate() + 7);

    // get lawyer cases first
    const lawyerCases = await Case.find({ lawyerId }).select("_id caseTitle clientName");

    const caseIds = lawyerCases.map((c) => c._id);

    const upcomingEvents = await CaseEvent.find({
      caseId: { $in: caseIds },
      eventDate: { $gte: today, $lte: next7Days },
    })
      .sort({ eventDate: 1 })
      .limit(5)
      .populate("caseId", "caseTitle clientName");

    res.json({
      totalArticles,
      totalDocuments,
      totalCases,
      upcomingEvents,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteCaseEvent = async (req, res) => {
  try {
    const eventId = req.params.id;

    // Find event
    const event = await CaseEvent.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // Ensure this event belongs to lawyer's case
    const caseData = await Case.findOne({
      _id: event.caseId,
      lawyerId: req.user.id,
    });

    if (!caseData) {
      return res.status(403).json({ msg: "Not authorized to delete this event" });
    }

    await CaseEvent.findByIdAndDelete(eventId);

    res.json({ msg: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateCaseEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { eventTitle, eventDetails, eventDate } = req.body;

    const event = await CaseEvent.findById(eventId);
    if (!event) return res.status(404).json({ msg: "Event not found" });

    // ✅ ensure lawyer owns this case
    const caseData = await Case.findOne({
      _id: event.caseId,
      lawyerId: req.user.id,
    });

    if (!caseData) {
      return res.status(403).json({ msg: "Not authorized to update this event" });
    }

    event.eventTitle = eventTitle || event.eventTitle;
    event.eventDetails = eventDetails || event.eventDetails;
    event.eventDate = eventDate ? new Date(eventDate) : event.eventDate;

    await event.save();

    res.json({ msg: "Event updated successfully", event });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ GET ALL REQUESTS FOR LOGGED-IN LAWYER
exports.getLawyerRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ lawyerId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("userId", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ UPDATE REQUEST STATUS (Accepted / Rejected)
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Pending", "Accepted", "Rejected"].includes(status)) {
      return res.status(400).json({ msg: "Invalid status" });
    }

    const request = await ContactRequest.findOneAndUpdate(
      { _id: req.params.id, lawyerId: req.user.id },
      { status },
      { new: true }
    );

    if (!request) return res.status(404).json({ msg: "Request not found" });

    res.json({ msg: "Status updated", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getDiscussion = async (req, res) => {
  try {
    const discussions = await Discussion.find({ lawyerId: req.user.id })
      .sort({ updatedAt: -1 })
      .populate("userId", "name email");

    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSingleDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findOne({
      _id: req.params.id,
      lawyerId: req.user.id,
    }).populate("userId", "name email");

    if (!discussion) return res.status(404).json({ msg: "Discussion not found" });

    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.replyDiscussion = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ msg: "Message text is required" });

    const discussion = await Discussion.findOne({
      _id: req.params.id,
      lawyerId: req.user.id,
    });

    if (!discussion) return res.status(404).json({ msg: "Discussion not found" });

    discussion.messages.push({
      senderRole: "lawyer",
      senderId: req.user.id,
      text,
    });

    await discussion.save();

    res.json({ msg: "Reply sent", discussion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resolveDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findOneAndUpdate(
      { _id: req.params.id, lawyerId: req.user.id },
      { status: "resolved" },
      { new: true }
    );

    if (!discussion) return res.status(404).json({ msg: "Discussion not found" });

    res.json({ msg: "Discussion resolved", discussion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createDiscussion = async (req, res) => {
  try {
    const { title, text, userId } = req.body;

    if (!title || !text || !userId) {
      return res.status(400).json({ msg: "title, text, userId are required" });
    }

    const discussion = await Discussion.create({
      lawyerId: req.user.id,
      userId,
      title,
      messages: [
        {
          senderRole: "lawyer",
          senderId: req.user.id,
          text,
        },
      ],
    });

    res.json({ msg: "Discussion created", discussion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ MARK DISCUSSION AS READ (LAWYER)
exports.markLawyerDiscussionRead = async (req, res) => {
  try {
    const discussion = await Discussion.findOne({
      _id: req.params.id,
      lawyerId: req.user.id,
    });

    if (!discussion) return res.status(404).json({ msg: "Discussion not found" });

    let updated = false;

    discussion.messages = discussion.messages.map((m) => {
      // lawyer is reading => mark user messages as read
      if (m.senderRole === "user" && m.isRead === false) {
        updated = true;
        return {
          ...m.toObject(),
          isRead: true,
          readAt: new Date(),
        };
      }
      return m;
    });

    if (updated) await discussion.save();

    res.json({ msg: "Discussion marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
