const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  searchLawyer,
  getArticles,
  getNews,
  getJobs,
  applyJob,
  downloadDocument,
  giveFeedback,
  contactLawyer,
  getMyRequests,
  getUserDocuments,
  searchDocuments,
  getMyRequestsMap,
  getUserDiscussions,
  getSingleUserDiscussion,
  userReplyDiscussion,
  markUserDiscussionRead,

} = require("../controllers/userController");


// ✅ USER DISCUSSION
router.get("/discussion", auth, role("user"), getUserDiscussions);
router.get("/discussion/:id", auth, role("user"), getSingleUserDiscussion);
router.post("/discussion/:id/reply", auth, role("user"), userReplyDiscussion);
router.patch("/discussion/:id/read", auth, role("user"), markUserDiscussionRead);


router.get("/my-requests-map", auth, role("user"), getMyRequestsMap);

// ✅ MY REQUESTS
router.get("/my-requests", auth, role("user"), getMyRequests);

// ✅ USER DOCUMENTS (list)
router.get("/documents", auth, role("user"), getUserDocuments);

// SEARCH LAWYER
router.get("/lawyers", auth, role("user"), searchLawyer);

// ARTICLES
router.get("/articles", auth, role("user"), getArticles);

// NEWS + JOBS
router.get("/news", auth, role("user"), getNews);
router.get("/jobs", auth, role("user"), getJobs);

// APPLY FOR JOB
router.post("/apply-job", auth, role("user"), applyJob);

// CONTACT LAWYER REQUEST
router.post("/contact-lawyer", auth, role("user"), contactLawyer);

// DOWNLOAD DOCUMENT
router.get("/document/:id/download", auth, role("user"), downloadDocument);

router.get("/search-documents", auth, role("user"), searchDocuments);


// FEEDBACK
router.post("/feedback", auth, role("user"), giveFeedback);

module.exports = router;
