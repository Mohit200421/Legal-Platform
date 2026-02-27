const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const {
  sendMessage,
  getConversation,
  getAllConversations,
  markAsRead,
  deleteMessage,
  addReaction,
  getUnreadCount,
} = require("../controllers/messageController");

router.post("/send", auth, sendMessage);
router.get("/conversation/:userId", auth, getConversation);
router.get("/conversations", auth, getAllConversations);
router.put("/:userId/read", auth, markAsRead);
router.delete("/:messageId", auth, deleteMessage);
router.post("/:messageId/reaction", auth, addReaction);
router.get("/unread/count", auth, getUnreadCount);

module.exports = router;
