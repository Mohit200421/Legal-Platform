import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import socket from "../../api/socket";
import {
  MessageSquare,
  Search,
  X,
  Phone,
  Video,
  MoreVertical,
  CheckCheck,
  Clock,
  Send,
  ArrowLeft,
  User,
  Shield,
  Lock,
} from "lucide-react";

export default function ConversationList({
  open,
  onClose,
  onSelectConversation,
}) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);

  useEffect(() => {
    if (open) {
      loadConversations();
    }
  }, [open]);

  // Listen for new messages to update conversation list
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const currentUserId = user?.id;

    const handler = (data) => {
      if (!currentUserId) return;

      // Get the other user's ID (not the current user)
      const otherUserId =
        String(data.senderId) === String(currentUserId)
          ? data.receiverId
          : data.senderId;

      // Update the conversation list when a new message arrives
      setConversations((prev) => {
        const existingIndex = prev.findIndex(
          (c) => String(c._id) === String(otherUserId)
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            lastMessage: data,
            lastMessageTime: data.timestamp || data.createdAt,
          };
          // Increment unread count if message is from other user
          if (String(data.senderId) !== String(currentUserId)) {
            updated[existingIndex].unreadCount =
              (updated[existingIndex].unreadCount || 0) + 1;
          }
          return updated.sort(
            (a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
          );
        }
        // If conversation doesn't exist, add it at the top
        return [
          {
            _id: otherUserId,
            lastMessage: data,
            lastMessageTime: data.timestamp || data.createdAt,
            unreadCount:
              String(data.senderId) !== String(currentUserId) ? 1 : 0,
          },
          ...prev,
        ];
      });
    };

    socket.on("receiveMessage", handler);
    return () => socket.off("receiveMessage", handler);
  }, []);

  const loadConversations = async () => {
    try {
      setLoading(true);
      const res = await API.get("/messages/conversations");
      setConversations(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  const getLastMessagePreview = (lastMessage) => {
    if (!lastMessage) return "No messages yet";
    const msg = lastMessage.message || "";
    return msg.length > 40 ? msg.substring(0, 40) + "..." : msg;
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm) return true;
    const name = conv.otherUser?.name?.toLowerCase() || "";
    return name.includes(searchTerm.toLowerCase());
  });

  const getTotalUnread = () => {
    return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  };

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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">
                  Messages
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {getTotalUnread()} unread
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="relative">
                <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm ? "No conversations found" : "No conversations yet"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm
                  ? "Try a different search term"
                  : "Start a conversation by contacting a lawyer"}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredConversations.map((conv) => {
                const otherUser = conv.otherUser;
                const hasUnread = conv.unreadCount > 0;

                return (
                  <button
                    key={conv._id}
                    onClick={() => onSelectConversation(conv)}
                    className="w-full p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center space-x-3"
                  >
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {otherUser?.name?.charAt(0) || "U"}
                        </span>
                      </div>
                      {hasUnread && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4
                          className={`font-medium truncate ${
                            hasUnread
                              ? "text-gray-900 dark:text-white font-bold"
                              : "text-gray-900 dark:text-white"
                          }`}
                        >
                          {otherUser?.name || "Unknown User"}
                        </h4>
                        <span
                          className={`text-xs flex-shrink-0 ${
                            hasUnread
                              ? "text-purple-600 dark:text-purple-400 font-medium"
                              : "text-gray-400"
                          }`}
                        >
                          {formatTime(conv.lastMessageTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate ${
                            hasUnread
                              ? "text-gray-700 dark:text-gray-300 font-medium"
                              : "text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {getLastMessagePreview(conv.lastMessage)}
                        </p>
                        {otherUser?.role === "lawyer" && (
                          <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full">
                            Lawyer
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-center text-xs text-gray-400 dark:text-gray-500">
            <Lock className="h-3 w-3 mr-1" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
