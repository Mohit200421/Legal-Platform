const User = require("../models/User");
const Article = require("../models/Article");
const News = require("../models/News");
const Job = require("../models/Job"); // ✅ Missing Job import added
const JobApplication = require("../models/JobApplication");
const Document = require("../models/Document");
const Feedback = require("../models/Feedback");
const ContactRequest = require("../models/ContactRequest");
const { sendEmail } = require("../utils/emailService");
const OCRExtract = require("../models/OCRExtract");
const Discussion = require("../models/Discussion");

// ---------------------- SEARCH LAWYER ----------------------
exports.searchLawyer = async (req, res) => {
  const { specialization, city, state } = req.query;

  let query = { role: "lawyer" };

  if (specialization) query.specialization = specialization;
  if (city) query.cityId = city;
  if (state) query.stateId = state;

  const lawyers = await User.find(query).select("-passwordHash");
  res.json(lawyers);
};

// ---------------------- GET ALL LAWYERS (TalkToLawyer page) ----------------------
exports.getLawyers = async (req, res) => {
  try {
    const lawyers = await User.find({ role: "lawyer" }).select("-passwordHash");
    res.json(lawyers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- VIEW ARTICLES ----------------------
exports.getArticles = async (req, res) => {
  const articles = await Article.find().populate("authorId", "name");
  res.json(articles);
};

// ---------------------- VIEW NEWS ----------------------
exports.getNews = async (req, res) => {
  const news = await News.find();
  res.json(news);
};

// ---------------------- VIEW JOBS ----------------------
exports.getJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

// ---------------------- APPLY FOR JOB ----------------------
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const application = await JobApplication.create({
      userId: req.user.id,
      jobId: jobId,
    });

    res.json({ msg: "Job Applied Successfully", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- DOWNLOAD DOCUMENT ----------------------
exports.downloadDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id);

  if (!doc) return res.status(404).json({ msg: "Document not found" });

  res.download(doc.path);
};

// ---------------------- USER DOCUMENTS ----------------------
exports.getUserDocuments = async (req, res) => {
  try {
    const docs = await Document.find()
      .sort({ createdAt: -1 })
      .populate("uploaderId", "name email role");

    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.contactLawyer = async (req, res) => {
  try {
    const { lawyerId, subject, message } = req.body;

    if (!lawyerId || !subject || !message) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const request = await ContactRequest.create({
      userId: req.user.id,
      lawyerId,
      subject,
      message,
    });

    res.json({ msg: "Request sent successfully", request });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("lawyerId", "name email");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- GIVE FEEDBACK ----------------------
exports.giveFeedback = async (req, res) => {
  const fb = await Feedback.create({
    userId: req.user.id,
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });

  // Send Email to Admin
  await sendEmail(
    "admin@legalportal.com",
    "New Feedback Received",
    `<h3>User Feedback</h3>
     <p>Name: ${req.body.name}</p>
     <p>Email: ${req.body.email}</p>
     <p>Message: ${req.body.message}</p>
    `
  );

  res.json({ msg: "Feedback submitted & emailed to admin", feedback: fb });
};

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("lawyerId", "name email specialization");

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ---------------------- SEARCH DOCUMENTS (OCR TEXT) ----------------------
exports.searchDocuments = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || !query.trim()) {
      return res.status(400).json({ msg: "Query is required" });
    }

    // 1) get user documents only
    const docs = await Document.find({
      assignedUserId: req.user.id,
      ocrTextId: { $ne: null },
    }).populate("uploaderId", "name email");

    // 2) get OCR texts for those documents
    const docIds = docs.map((d) => d._id);

    const ocrRecords = await OCRExtract.find({
      documentId: { $in: docIds },
      extractedText: { $regex: query, $options: "i" }, // search keyword
    });

    const matchedDocIds = new Set(ocrRecords.map((o) => String(o.documentId)));

    // 3) return only matched docs
    const matchedDocs = docs.filter((d) => matchedDocIds.has(String(d._id)));

    res.json(matchedDocs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyRequestsMap = async (req, res) => {
  try {
    const requests = await ContactRequest.find({ userId: req.user.id }).select(
      "lawyerId status"
    );

    // map: lawyerId -> status
    const map = {};
    requests.forEach((r) => {
      map[r.lawyerId.toString()] = r.status;
    });

    res.json(map);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ✅ GET ALL DISCUSSIONS FOR USER
exports.getUserDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({ userId: req.user.id })
      .sort({ updatedAt: -1 })
      .populate("lawyerId", "name email");

    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ GET SINGLE DISCUSSION THREAD
exports.getSingleUserDiscussion = async (req, res) => {
  try {
    const discussion = await Discussion.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).populate("lawyerId", "name email");

    if (!discussion) return res.status(404).json({ msg: "Discussion not found" });

    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ USER REPLY
exports.userReplyDiscussion = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) return res.status(400).json({ msg: "Message text is required" });

    const discussion = await Discussion.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!discussion) return res.status(404).json({ msg: "Discussion not found" });

    if (discussion.status === "resolved") {
      return res.status(400).json({ msg: "Discussion is resolved" });
    }

    discussion.messages.push({
      senderRole: "user",
      senderId: req.user.id,
      text,
    });

    await discussion.save();

    res.json({ msg: "Message sent", discussion });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ MARK DISCUSSION AS READ (USER)
exports.markUserDiscussionRead = async (req, res) => {
  try {
    const discussion = await Discussion.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!discussion) return res.status(404).json({ msg: "Discussion not found" });

    let updated = false;

    discussion.messages = discussion.messages.map((m) => {
      // user is reading => mark lawyer messages as read
      if (m.senderRole === "lawyer" && m.isRead === false) {
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
