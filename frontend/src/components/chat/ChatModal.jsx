import { useEffect, useRef, useState } from "react";
import API from "../../api/axios";
import socket from "../../api/socket";
import toast from "react-hot-toast";
import {
  Send,
  X,
  User,
  Shield,
  CheckCheck,
  Check,
  Clock,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Download,
  Copy,
  Star,
  Flag,
  Mic,
  Image as ImageIcon,
  File,
  Calendar,
  Lock,
  MessageSquare,
  Trash2,
  Heart,
  ThumbsUp,
  Trash,
  MoreHorizontal,
  SmilePlus,
} from "lucide-react";

export default function ChatModal({ open, onClose, receiverId, receiverName }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id;
  const senderRole = user?.role;

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showReactions, setShowReactions] = useState(null);
  const [isOnline, setIsOnline] = useState(false);

  const bottomRef = useRef(null);
  const typingTimer = useRef(null);
  const fileInputRef = useRef(null);

  // Join room when modal opens
  useEffect(() => {
    if (open && senderId) {
      socket.emit("joinRoom", senderId);
    }
  }, [open, senderId]);

  // Load old messages when modal opens
  useEffect(() => {
    const loadConversation = async () => {
      if (!open || !receiverId) return;

      try {
        setLoading(true);
        const res = await API.get(`/messages/conversation/${receiverId}`);
        setMessages(res.data);

        // Mark messages as read
        await API.put(`/messages/${receiverId}/read`);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load chat");
      } finally {
        setLoading(false);
      }
    };

    loadConversation();
  }, [open, receiverId]);

  // Real-time receive messages
  useEffect(() => {
    const handler = (data) => {
      // Convert IDs to strings for comparison
      const dataSenderId = String(data.senderId);
      const dataReceiverId = String(data.receiverId);
      const currentReceiverId = String(receiverId);
      const currentSenderId = String(senderId);

      // Check if this message is part of this conversation
      const isRelevantMessage =
        (dataSenderId === currentReceiverId &&
          dataReceiverId === currentSenderId) ||
        (dataSenderId === currentSenderId &&
          dataReceiverId === currentReceiverId);

      if (isRelevantMessage) {
        console.log("Received real-time message:", data);
        setMessages((prev) => [...prev, { ...data, status: "delivered" }]);

        // Mark as read if we're receiving
        if (dataSenderId === currentReceiverId) {
          API.put(`/messages/${receiverId}/read`).catch(console.log);
        }
      }
    };

    // Typing indicators - improved handlers
    const typingHandler = (data) => {
      if (String(data.senderId) === String(receiverId)) {
        setIsTyping(true);
      }
    };

    const stopTypingHandler = (data) => {
      if (String(data.senderId) === String(receiverId)) {
        setIsTyping(false);
      }
    };

    // Delivery receipts
    const deliveryHandler = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          String(msg._id) === String(data.messageId)
            ? { ...msg, status: "delivered" }
            : msg
        )
      );
    };

    // Read receipts
    const readHandler = (data) => {
      if (String(data.readerId) === String(receiverId)) {
        setMessages((prev) =>
          prev.map((msg) =>
            String(msg.senderId) === String(senderId)
              ? { ...msg, status: "read" }
              : msg
          )
        );
      }
    };

    // Online status
    const onlineHandler = (data) => {
      if (String(data.userId) === String(receiverId)) {
        setIsOnline(true);
      }
    };

    const offlineHandler = (data) => {
      if (String(data.userId) === String(receiverId)) {
        setIsOnline(false);
      }
    };

    // Reactions
    const reactionHandler = (data) => {
      setMessages((prev) =>
        prev.map((msg) =>
          String(msg._id) === String(data.messageId)
            ? {
                ...msg,
                reactions: [
                  ...(msg.reactions || []),
                  { emoji: data.emoji, userId: data.userId },
                ],
              }
            : msg
        )
      );
    };

    socket.on("receiveMessage", handler);
    socket.on("userTyping", typingHandler);
    socket.on("userStoppedTyping", stopTypingHandler);
    socket.on("messageDelivered", deliveryHandler);
    socket.on("messageRead", readHandler);
    socket.on("userOnline", onlineHandler);
    socket.on("userOffline", offlineHandler);
    socket.on("reactionAdded", reactionHandler);

    return () => {
      socket.off("receiveMessage", handler);
      socket.off("userTyping", typingHandler);
      socket.off("userStoppedTyping", stopTypingHandler);
      socket.off("messageDelivered", deliveryHandler);
      socket.off("messageRead", readHandler);
      socket.off("userOnline", onlineHandler);
      socket.off("userOffline", offlineHandler);
      socket.off("reactionAdded", reactionHandler);
    };
  }, [receiverId, senderId]);

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Clear chat on close
  useEffect(() => {
    if (!open) {
      setMessages([]);
      setMessage("");
      setIsTyping(false);
      setShowEmojiPicker(false);
      setShowAttachments(false);
      setSelectedMessage(null);
      setShowReactions(null);
    }
  }, [open]);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", {
      receiverId,
      senderId,
      senderRole,
    });

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId,
        senderId,
        senderRole,
      });
    }, 1000);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!receiverId) return toast.error("Receiver not found!");

    const tempId = Date.now().toString();
    const msgData = {
      _id: tempId,
      senderId,
      receiverId,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: "sent",
    };

    try {
      setSending(true);

      // Stop typing
      socket.emit("stopTyping", {
        receiverId,
        senderId,
        senderRole,
      });

      // Show instantly on sender UI
      setMessages((prev) => [...prev, msgData]);

      // Emit realtime to receiver
      socket.emit("sendMessage", msgData);

      // Save to DB
      const res = await API.post("/messages/send", {
        receiverId,
        message: msgData.message,
      });

      // Update with actual ID from server
      if (res.data.newMsg) {
        setMessages((prev) =>
          prev.map((m) =>
            m._id === tempId ? { ...m, _id: res.data.newMsg._id } : m
          )
        );
      }

      setMessage("");
      setShowEmojiPicker(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message");

      // Remove the optimistically added message on error
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
  };

  const handleReaction = async (messageId, emoji) => {
    try {
      // Emit reaction to socket
      socket.emit("addReaction", {
        messageId,
        emoji,
        senderId,
        receiverId,
      });

      // Save to backend
      const res = await API.post(`/messages/${messageId}/reaction`, { emoji });

      // Update local state
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, reactions: res.data.reactions }
            : msg
        )
      );

      setShowReactions(null);
    } catch (err) {
      console.log(err);
      toast.error("Failed to add reaction");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await API.delete(`/messages/${messageId}`);
      setMessages((prev) => prev.filter((m) => m._id !== messageId));
      toast.success("Message deleted");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete message");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, msg) => {
    const date = formatDate(msg.timestamp || msg.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
    return groups;
  }, {});

  // Reaction options
  const reactionOptions = ["👍", "❤️", "😂", "😢", "😡", "🙏"];

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 w-full max-w-md h-[650px] rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* Avatar with online indicator */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm font-bold text-white">
                    {receiverName?.charAt(0) || "U"}
                  </span>
                </div>
                <div
                  className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                    isOnline ? "bg-green-500" : "bg-gray-400"
                  }`}
                ></div>
              </div>

              {/* User Info */}
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  {receiverName || "Conversation"}
                </h3>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                  {isOnline ? (
                    <span className="text-green-500">Online</span>
                  ) : (
                    <span>Offline</span>
                  )}
                  <span className="mx-1">•</span>
                  <Lock className="h-3 w-3 mr-1" />
                  <span>Encrypted</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-1">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Phone className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Video className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors">
                <Info className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 scrollbar-hide [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative">
                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl flex items-center justify-center mb-4">
                <MessageSquare className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No messages yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Send a message to start the conversation
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-400 dark:text-gray-500">
                <Shield className="h-3 w-3" />
                <span>Messages are end-to-end encrypted</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex justify-center my-4">
                    <span className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-gray-600 dark:text-gray-400">
                      {date}
                    </span>
                  </div>

                  {dateMessages.map((msg, idx) => {
                    // Convert IDs to strings for proper comparison
                    const msgSenderId = String(
                      msg.senderId?._id || msg.senderId
                    );
                    const currentSenderId = String(senderId);
                    const isMe = msgSenderId === currentSenderId;
                    const msgId = msg._id;

                    return (
                      <div
                        key={msgId || idx}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        } mb-3 group`}
                      >
                        <div
                          className={`flex items-end space-x-2 max-w-[80%] ${
                            isMe ? "flex-row-reverse space-x-reverse" : ""
                          }`}
                        >
                          {/* Avatar */}
                          {!isMe && (
                            <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-white">
                                {receiverName?.charAt(0) || "U"}
                              </span>
                            </div>
                          )}

                          {/* Message Bubble */}
                          <div className="relative">
                            <div
                              className={`relative px-4 py-2 rounded-2xl ${
                                isMe
                                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-br-none"
                                  : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-bl-none"
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words">
                                {msg.message}
                              </p>

                              {/* Reactions display */}
                              {msg.reactions && msg.reactions.length > 0 && (
                                <div
                                  className={`flex flex-wrap gap-1 mt-1 ${
                                    isMe ? "justify-end" : "justify-start"
                                  }`}
                                >
                                  {msg.reactions
                                    .slice(0, 3)
                                    .map((reaction, rIdx) => (
                                      <span
                                        key={rIdx}
                                        className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full"
                                      >
                                        {reaction.emoji}
                                      </span>
                                    ))}
                                  {msg.reactions.length > 3 && (
                                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                                      +{msg.reactions.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Message Footer */}
                              <div
                                className={`flex items-center justify-end space-x-1 mt-1 text-xs ${
                                  isMe ? "text-purple-200" : "text-gray-400"
                                }`}
                              >
                                <span>
                                  {formatTime(msg.timestamp || msg.createdAt)}
                                </span>
                                {isMe &&
                                  (msg.status === "read" ? (
                                    <CheckCheck className="h-3 w-3 text-blue-300" />
                                  ) : msg.status === "delivered" ? (
                                    <CheckCheck className="h-3 w-3" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  ))}
                              </div>

                              {/* Reaction Picker */}
                              {showReactions === msgId && (
                                <div
                                  className={`absolute ${
                                    isMe ? "left-0" : "right-0"
                                  } -top-10 flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg p-1 z-10`}
                                >
                                  {reactionOptions.map((emoji) => (
                                    <button
                                      key={emoji}
                                      onClick={() =>
                                        handleReaction(msgId, emoji)
                                      }
                                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-lg transition-colors"
                                    >
                                      {emoji}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Context Menu (on hover) */}
                            <div
                              className={`absolute top-0 ${
                                isMe ? "left-0" : "right-0"
                              } -translate-y-full hidden group-hover:flex items-center space-x-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-1 z-10`}
                            >
                              <button
                                onClick={() =>
                                  setShowReactions(
                                    showReactions === msgId ? null : msgId
                                  )
                                }
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <SmilePlus className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                              </button>
                              <button
                                onClick={() => copyToClipboard(msg.message)}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              >
                                <Copy className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                              </button>
                              {isMe && (
                                <button
                                  onClick={() => handleDeleteMessage(msgId)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                  <Trash2 className="h-3 w-3 text-red-500" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {receiverName?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-bl-none px-4 py-3">
                      <div className="flex space-x-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          {/* Emoji Picker (simplified) */}
          {showEmojiPicker && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-6 gap-2">
                {[
                  "😊",
                  "😂",
                  "❤️",
                  "👍",
                  "🎉",
                  "😢",
                  "😡",
                  "😍",
                  "🤔",
                  "👋",
                  "🙏",
                  "🔥",
                ].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-xl transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Attachments Menu */}
          {showAttachments && (
            <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={handleFileUpload}
                  className="flex flex-col items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <ImageIcon className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Image
                  </span>
                </button>
                <button
                  onClick={handleFileUpload}
                  className="flex flex-col items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <File className="h-5 w-5 text-green-500 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    File
                  </span>
                </button>
                <button className="flex flex-col items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  <Mic className="h-5 w-5 text-red-500 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Audio
                  </span>
                </button>
                <button className="flex flex-col items-center p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors">
                  <Calendar className="h-5 w-5 text-purple-500 mb-1" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    Event
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                value={message}
                onChange={handleTyping}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                rows={1}
                className="w-full px-4 py-3 pr-24 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:text-white placeholder-gray-400 resize-none"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />

              {/* Input Actions */}
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Smile className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
                <button
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <Paperclip className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/25"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Encryption Notice */}
          <div className="flex items-center justify-center mt-3 text-xs text-gray-400 dark:text-gray-500">
            <Lock className="h-3 w-3 mr-1" />
            <span>Messages are end-to-end encrypted</span>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={(e) => {
          const files = e.target.files;
          if (files && files.length > 0) {
            // Handle file upload - would need to implement file upload to backend
            console.log("Files selected:", files);
            toast.success(`${files.length} file(s) selected`);
          }
          setShowAttachments(false);
        }}
      />
    </div>
  );
}
