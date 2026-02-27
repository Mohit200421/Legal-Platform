const Message = require("../models/Message");
const User = require("../models/User");
const Lawyer = require("../models/Lawyer");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message, attachments } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ msg: "receiverId and message required" });
    }

    const newMsg = await Message.create({
      senderId: req.user.id,
      receiverId,
      message,
      attachments: attachments || [],
      status: "sent",
    });

    // Populate sender info
    await newMsg.populate("senderId", "name email role profileImage");
    await newMsg.populate("receiverId", "name email role profileImage");

    res.json({ msg: "Message saved", newMsg });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const myId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: myId },
      ],
      isDeleted: false,
    })
      .populate("senderId", "name email role profileImage")
      .populate("receiverId", "name email role profileImage")
      .sort({ createdAt: 1 });

    // Mark messages as delivered
    await Message.updateMany(
      { senderId: otherUserId, receiverId: myId, status: "sent" },
      { status: "delivered" }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all conversations for a user
exports.getAllConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all unique conversations
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [{ senderId: userId }, { receiverId: userId }],
          isDeleted: false,
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$senderId", userId] },
              then: "$receiverId",
              else: "$senderId",
            },
          },
          lastMessage: { $first: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: {
                if: {
                  $and: [
                    { $eq: ["$receiverId", userId] },
                    { $ne: ["$status", "read"] },
                  ],
                },
                then: 1,
                else: 0,
              },
            },
          },
        },
      },
    ]);

    // Get user details for each conversation
    const conversations = await Promise.all(
      messages.map(async (conv) => {
        const otherUserId = conv._id;

        // Try to find as User first, then as Lawyer
        let otherUser = await User.findById(otherUserId).select(
          "name email profileImage"
        );
        let role = "user";

        if (!otherUser) {
          otherUser = await Lawyer.findOne({ userId: otherUserId }).select(
            "name email profileImage"
          );
          role = "lawyer";
        }

        return {
          _id: otherUserId,
          otherUser: otherUser
            ? {
                _id: otherUser._id || otherUser.userId,
                name: otherUser.name,
                email: otherUser.email,
                profileImage: otherUser.profileImage,
                role,
              }
            : null,
          lastMessage: conv.lastMessage,
          unreadCount: conv.unreadCount,
          lastMessageTime: conv.lastMessage.createdAt,
        };
      })
    );

    // Filter out null users and sort by last message time
    const validConversations = conversations
      .filter((c) => c.otherUser !== null)
      .sort(
        (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
      );

    res.json(validConversations);
  } catch (err) {
    console.error("Error in getAllConversations:", err);
    res.status(500).json({ msg: err.message });
  }
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params;
    const myId = req.user.id;

    await Message.updateMany(
      { senderId: userId, receiverId: myId, status: { $ne: "read" } },
      { status: "read" }
    );

    res.json({ msg: "Messages marked as read" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete message (soft delete)
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      _id: messageId,
      senderId: userId,
    });

    if (!message) {
      return res
        .status(404)
        .json({ msg: "Message not found or not authorized" });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    message.message = "This message was deleted";
    await message.save();

    res.json({ msg: "Message deleted", message });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add reaction to message
exports.addReaction = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user.id;

    if (!emoji) {
      return res.status(400).json({ msg: "Emoji is required" });
    }

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ msg: "Message not found" });
    }

    // Check if user already reacted with this emoji
    const existingReaction = message.reactions.find(
      (r) => r.userId.toString() === userId && r.emoji === emoji
    );

    if (existingReaction) {
      // Remove reaction if already exists
      message.reactions = message.reactions.filter(
        (r) => !(r.userId.toString() === userId && r.emoji === emoji)
      );
    } else {
      // Add new reaction
      message.reactions.push({ userId, emoji });
    }

    await message.save();
    await message.populate("reactions.userId", "name email profileImage");

    res.json({ msg: "Reaction updated", reactions: message.reactions });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const count = await Message.countDocuments({
      receiverId: userId,
      status: { $ne: "read" },
      isDeleted: false,
    });

    res.json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
