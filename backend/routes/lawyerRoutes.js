const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");
const {
  addArticle,
  getArticles,
  deleteArticle,
  updateArticle,
  uploadDocument,
  getDocuments,
  deleteDocument,
  viewDocument,
  addCase,
  getCases,
  deleteCase,
  addCaseEvent,
  getCaseEvents,
  getLawyerRequests,
  updateRequestStatus,
  getSingleDiscussion,
  replyDiscussion,
  resolveDiscussion,
  getNews,
  getJobs,
  createDiscussion,
  getLawyerDashboardStats,
  deleteCaseEvent,
  updateCaseEvent,
  getDiscussion,
  markLawyerDiscussionRead,

} = require("../controllers/lawyerController");

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/documents/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.get("/dashboard/stats", auth, role("lawyer"), getLawyerDashboardStats);

// ARTICLE
router.post("/article", auth, role("lawyer"), addArticle);
router.get("/article", auth, role("lawyer"), getArticles);
router.put("/article/:id", auth, role("lawyer"), updateArticle);
router.delete("/article/:id", auth, role("lawyer"), deleteArticle);

// DOCUMENT
router.post(
  "/document",
  auth,
  role("lawyer"),
  upload.single("file"),
  uploadDocument
);
router.get("/document", auth, role("lawyer"), getDocuments);
// router.get("/document/view/:id", auth, role("lawyer"), viewDocument);
router.delete("/document/:id", auth, role("lawyer"), deleteDocument);

// CASE
router.post("/case", auth, role("lawyer"), addCase);
router.get("/case", auth, role("lawyer"), getCases);
router.delete("/case/:id", auth, role("lawyer"), deleteCase);

// CASE EVENTS
router.post("/case/event", auth, role("lawyer"), addCaseEvent);
router.get("/case/:caseId/event", auth, role("lawyer"), getCaseEvents);
router.delete("/case/event/:id", auth, role("lawyer"), deleteCaseEvent);
router.put("/case/event/:id", auth, role("lawyer"), updateCaseEvent);

router.get("/requests", auth, role("lawyer"), getLawyerRequests);
router.put("/requests/:id/status", auth, role("lawyer"), updateRequestStatus);

// NEWS & JOB VIEW
// router.get("/news", auth, role("lawyer"), getNews);
// router.get("/jobs", auth, role("lawyer"), getJobs);

// DISCUSSION
router.get("/discussion", auth, role("lawyer"), getDiscussion);
router.get("/discussion/:id", auth, role("lawyer"), getSingleDiscussion);
router.post("/discussion/:id/reply", auth, role("lawyer"), replyDiscussion);
router.patch("/discussion/:id/read", auth, role("lawyer"), markLawyerDiscussionRead);

router.patch(
  "/discussion/:id/resolve",
  auth,
  role("lawyer"),
  resolveDiscussion
);

module.exports = router;
