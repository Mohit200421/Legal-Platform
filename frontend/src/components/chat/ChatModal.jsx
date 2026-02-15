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
  Clock,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info
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

  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

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
      if (
        (data.senderId === receiverId && data.receiverId === senderId) ||
        (data.senderId === senderId && data.receiverId === receiverId)
      ) {
        setMessages((prev) => [...prev, { ...data, status: "delivered" }]);
      }
    };

    // Typing indicators
    const typingHandler = ({ senderRole }) => {
      setIsTyping(true);
    };

    const stopTypingHandler = ({ senderRole }) => {
      setIsTyping(false);
    };

    socket.on("receiveMessage", handler);
    socket.on("typing", typingHandler);
    socket.on("stopTyping", stopTypingHandler);

    return () => {
      socket.off("receiveMessage", handler);
      socket.off("typing", typingHandler);
      socket.off("stopTyping", stopTypingHandler);
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
    }
  }, [open]);

  const handleTyping = (e) => {
    setMessage(e.target.value);

    socket.emit("typing", {
      receiverId,
      senderRole,
    });

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId,
        senderRole,
      });
    }, 1000);
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    if (!receiverId) return toast.error("Receiver not found!");

    const msgData = {
      senderId,
      receiverId,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    try {
      setSending(true);

      // Stop typing
      socket.emit("stopTyping", {
        receiverId,
        senderRole,
      });

      // Show instantly on sender UI
      setMessages((prev) => [...prev, msgData]);

      // Emit realtime to receiver
      socket.emit("sendMessage", msgData);

      // Save to DB
      await API.post("/messages/send", {
        receiverId,
        message: msgData.message,
      });

      setMessage("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message");
      
      // Remove the optimistically added message on error
      setMessages((prev) => prev.filter(m => m !== msgData));
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

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
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
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
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

  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white w-full max-w-md h-[600px] border border-gray-200 shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 border border-purple-200 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {receiverName || "Conversation"}
                </h3>
                <div className="flex items-center text-xs text-gray-500">
                  <Shield className="h-3 w-3 mr-1" />
                  <span>Encrypted</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <button className="p-2 border border-gray-200 hover:bg-gray-50">
                <Phone className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-200 hover:bg-gray-50">
                <Video className="h-4 w-4 text-gray-600" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 border border-gray-200 hover:bg-gray-50"
              >
                <X className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-gray-100 border border-gray-200 flex items-center justify-center mb-3">
                <MessageSquare className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-500 mb-1">No messages yet</p>
              <p className="text-xs text-gray-400">
                Send a message to start the conversation
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedMessages).map(([date, dateMessages]) => (
                <div key={date}>
                  <div className="flex justify-center my-4">
                    <span className="text-xs bg-gray-200 px-3 py-1 text-gray-600">
                      {date}
                    </span>
                  </div>
                  
                  {dateMessages.map((msg, idx) => {
                    const isMe = msg.senderId === senderId;
                    
                    return (
                      <div
                        key={idx}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-3`}
                      >
                        <div className={`max-w-[80%] ${isMe ? 'order-2' : 'order-1'}`}>
                          <div className="flex items-end space-x-2">
                            {!isMe && (
                              <div className="w-6 h-6 bg-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0">
                                <User className="h-3 w-3 text-purple-600" />
                              </div>
                            )}
                            
                            <div className={`border ${
                              isMe 
                                ? 'bg-purple-600 border-purple-700' 
                                : 'bg-white border-gray-200'
                            } p-3`}>
                              <p className={`text-sm ${isMe ? 'text-white' : 'text-gray-900'}`}>
                                {msg.message}
                              </p>
                              <div className={`flex items-center justify-end space-x-1 mt-1 ${
                                isMe ? 'text-purple-200' : 'text-gray-400'
                              }`}>
                                <span className="text-xs">
                                  {formatTime(msg.timestamp || msg.createdAt)}
                                </span>
                                {isMe && (
                                  <CheckCheck className="h-3 w-3" />
                                )}
                              </div>
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
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-100 border border-purple-200 flex items-center justify-center">
                    <User className="h-3 w-3 text-purple-600" />
                  </div>
                  <div className="border border-gray-200 bg-white px-4 py-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={handleTyping}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 bg-white text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-1">
                  <button className="p-1.5 border border-gray-300 hover:bg-gray-50">
                    <Paperclip className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                  <button className="p-1.5 border border-gray-300 hover:bg-gray-50">
                    <Smile className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                  className="px-4 py-1.5 bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  {sending ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Sending</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5" />
                      <span>Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Missing MessageSquare import
const MessageSquare = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);