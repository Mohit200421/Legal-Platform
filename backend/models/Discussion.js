const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    lawyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },

    status: {
      type: String,
      enum: ["open", "resolved"],
      default: "open",
    },

    messages: [
      {
        senderRole: {
          type: String,
          enum: ["user", "lawyer"],
          required: true,
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    
        // ✅ Unread system
        isRead: { type: Boolean, default: false },
        readAt: { type: Date, default: null },
      },
    ],
    
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discussion", discussionSchema);
