import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import { socket } from "../../api/socket";
import toast from "react-hot-toast";
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  CheckCheck,
  Clock,
  User,
  Shield,
  X
} from "lucide-react";

export default function Chat({ receiverId, receiverName, onClose }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const senderId = user?.id;
  const senderRole = user?.role;

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Join room
  useEffect(() => {
    if (senderId) {
      socket.emit("joinRoom", senderId);
    }
  }, [senderId]);

  // Load old messages
  useEffect(() => {
    const fetchConversation = async () => {
      if (!receiverId) return;
      
      try {
        setLoading(true);
        const res = await API.get(`/messages/conversation/${receiverId}`);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };
    
    fetchConversation();
  }, [receiverId]);

  // Receive message real-time
  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Typing indicators
    socket.on("typing", ({ senderRole }) => {
      setIsTyping(true);
    });

    socket.on("stopTyping", ({ senderRole }) => {
      setIsTyping(false);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

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

    const msgData = { 
      senderId, 
      receiverId, 
      message: message.trim(),
      timestamp: new Date().toISOString(),
      status: "sent"
    };

    try {
      setSending(true);

      // Emit socket
      socket.emit("sendMessage", msgData);

      // Save in DB
      await API.post("/messages/send", { receiverId, message: message.trim() });

      // Stop typing
      socket.emit("stopTyping", {
        receiverId,
        senderRole,
      });

      setMessages((prev) => [...prev, { ...msgData, status: "delivered" }]);
      setMessage("");
    } catch (err) {
      console.log(err);
      toast.error("Failed to send message");
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
    const today = new Date();
    const date = new Date(timestamp);
    
    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.timestamp || message.createdAt);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-4xl h-[80vh] border border-gray-200 shadow-xl flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-gray-200 p-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 border border-purple-200 flex items-center justify-center">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900">
                  {receiverName || "Client"}
                </h2>
                <div className="flex items-center text-xs text-gray-500">
                  <span className="flex items-center">
                    <Shield className="h-3 w-3 mr-1" />
                    End-to-end encrypted
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 border border-gray-200 hover:bg-gray-50">
                <Phone className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-200 hover:bg-gray-50">
                <Video className="h-4 w-4 text-gray-600" />
              </button>
              <button className="p-2 border border-gray-200 hover:bg-gray-50">
                <Info className="h-4 w-4 text-gray-600" />
              </button>
              {onClose && (
                <button 
                  onClick={onClose}
                  className="p-2 border border-gray-200 hover:bg-gray-50"
                >
                  <X className="h-4 w-4 text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-gray-500">No messages yet</p>
              <p className="text-xs text-gray-400 mt-1">
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
                  
                  {dateMessages.map((msg, index) => {
                    const isMe = msg.senderId === senderId;
                    
                    return (
                      <div
                        key={index}
                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                          <div className="flex items-end space-x-2">
                            {!isMe && (
                              <div className="w-8 h-8 bg-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0">
                                <User className="h-4 w-4 text-purple-600" />
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

                            {isMe && (
                              <div className="w-8 h-8 bg-purple-600 border border-purple-700 flex items-center justify-center flex-shrink-0">
                                <Shield className="h-4 w-4 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-8 h-8 bg-purple-100 border border-purple-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-purple-600" />
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
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={message}
                onChange={handleTyping}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-300 bg-white text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none resize-none"
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <button className="p-2 border border-gray-300 hover:bg-gray-50">
                    <Paperclip className="h-4 w-4 text-gray-600" />
                  </button>
                  <button className="p-2 border border-gray-300 hover:bg-gray-50">
                    <Smile className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                <button
                  onClick={handleSend}
                  disabled={!message.trim() || sending}
                  className="px-6 py-2 bg-purple-600 text-white font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {sending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
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