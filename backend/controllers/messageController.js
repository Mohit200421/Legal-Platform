const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    if (!receiverId || !message) {
      return res.status(400).json({ msg: "receiverId and message required" });
    }

    const newMsg = await Message.create({
      senderId: req.user.id,
      receiverId,
      message,
    });

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
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
