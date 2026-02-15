import { useEffect, useState, useRef } from "react";
import API from "../../api/axios";
import socket from "../../api/socket";
import {
  MessageSquare,
  Users,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  Mail,
  Calendar,
  ArrowLeft,
  MoreVertical,
  Paperclip,
  Smile,
  X,
  ChevronRight,
  Bell,
  CheckCheck
} from "lucide-react";

export default function UserDiscussion() {
  const [discussions, setDiscussions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  const messagesEndRef = useRef(null);
  const typingTimer = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selected?.messages]);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/discussion");
      setDiscussions(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load discussions");
    } finally {
      setLoading(false);
    }
  };

  const openDiscussion = async (id) => {
    try {
      const res = await API.get(`/user/discussion/${id}`);
      setSelected(res.data);

      await API.patch(`/user/discussion/${id}/read`);
      fetchDiscussions();
    } catch (err) {
      console.log(err);
      alert("Failed to open discussion");
    }
  };

  const sendReply = async () => {
    if (!replyText.trim()) return alert("Type message first");

    try {
      const res = await API.post(`/user/discussion/${selected._id}/reply`, {
        text: replyText,
      });

      setSelected(res.data.discussion);
      setReplyText("");

      if (selected?.lawyerId?._id) {
        socket.emit("stopTyping", {
          receiverId: selected.lawyerId._id,
          senderRole: "user",
        });
      }

      fetchDiscussions();
    } catch (err) {
      console.log(err);
      alert("Failed to send message");
    }
  };

  const handleTyping = (e) => {
    setReplyText(e.target.value);

    if (!selected?.lawyerId?._id) return;

    socket.emit("typing", {
      receiverId: selected.lawyerId._id,
      senderRole: "user",
    });

    clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selected.lawyerId._id,
        senderRole: "user",
      });
    }, 1000);
  };

  // Listen typing events (lawyer typing)
  useEffect(() => {
    socket.on("typing", ({ senderRole }) => {
      if (senderRole === "lawyer") setIsTyping(true);
    });

    socket.on("stopTyping", ({ senderRole }) => {
      if (senderRole === "lawyer") setIsTyping(false);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, []);

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case "resolved":
        return {
          icon: CheckCircle,
          text: "Resolved",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200"
        };
      case "active":
        return {
          icon: MessageSquare,
          text: "Active",
          bg: "bg-blue-100",
          textColor: "text-blue-700",
          border: "border-blue-200"
        };
      default:
        return {
          icon: Clock,
          text: "Pending",
          bg: "bg-yellow-100",
          textColor: "text-yellow-700",
          border: "border-yellow-200"
        };
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading discussions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-73px)] bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Discussion List */}
      <div className={`${sidebarOpen ? 'w-96' : 'w-0'} border-r border-gray-200 bg-white transition-all duration-300 overflow-hidden flex flex-col`}>
        {/* Sidebar Header */}
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Discussions</h2>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1">
              {discussions.length} total
            </span>
          </div>
        </div>

        {/* Discussion List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {discussions.length === 0 ? (
            <div className="text-center py-8 border border-gray-100">
              <Users className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No discussions found</p>
            </div>
          ) : (
            discussions.map((d) => {
              const unreadCount = d?.messages?.filter(
                (m) => m.senderRole === "lawyer" && m.isRead === false
              )?.length || 0;
              
              const lastMessage = d.messages?.[d.messages.length - 1];
              const statusBadge = getStatusBadge(d.status);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={d._id}
                  onClick={() => openDiscussion(d._id)}
                  className={`border cursor-pointer transition-all ${
                    selected?._id === d._id
                      ? 'border-blue-300 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-gray-900 flex-1 pr-2">
                        {d.title}
                      </h3>
                      {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center flex-shrink-0">
                          {unreadCount}
                        </span>
                      )}
                    </div>

                    <div className="space-y-2 mb-2">
                      <div className="flex items-center text-xs text-gray-600">
                        <User className="h-3 w-3 mr-1" />
                        <span className="truncate">{d.lawyerId?.name || "N/A"}</span>
                      </div>
                      
                      {lastMessage && (
                        <p className="text-xs text-gray-500 truncate">
                          {lastMessage.text}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-0.5 text-xs border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.textColor}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusBadge.text}
                      </span>
                      
                      {d.updatedAt && (
                        <span className="text-xs text-gray-400">
                          {formatDate(d.updatedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Discussion Selected</h3>
              <p className="text-sm text-gray-500">
                Select a discussion from the sidebar to start chatting
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 p-5 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {!sidebarOpen && (
                    <button
                      onClick={() => setSidebarOpen(true)}
                      className="p-2 hover:bg-gray-100 border border-gray-200"
                    >
                      <ChevronRight className="h-5 w-5 text-gray-600" />
                    </button>
                  )}
                  
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
                      {(() => {
                        const badge = getStatusBadge(selected.status);
                        const Icon = badge.icon;
                        return (
                          <span className={`inline-flex items-center px-2 py-1 text-xs border ${badge.border} ${badge.bg} ${badge.textColor}`}>
                            <Icon className="h-3 w-3 mr-1" />
                            {badge.text}
                          </span>
                        );
                      })()}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        {selected.lawyerId?.name}
                      </span>
                      <span className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-1" />
                        {selected.lawyerId?.email}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-100 border border-gray-200">
                  <MoreVertical className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 bg-gray-50"
            >
              {selected.messages?.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selected.messages.map((message, index) => {
                    const isUser = message.senderRole === "user";
                    const showDate = index === 0 || 
                      formatDate(message.createdAt) !== formatDate(selected.messages[index - 1]?.createdAt);

                    return (
                      <div key={index}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <span className="text-xs bg-gray-200 px-3 py-1 text-gray-600">
                              {formatDate(message.createdAt)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${isUser ? 'order-2' : 'order-1'}`}>
                            <div className="flex items-end space-x-2">
                              {!isUser && (
                                <div className="w-8 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center flex-shrink-0">
                                  <User className="h-4 w-4 text-gray-600" />
                                </div>
                              )}
                              
                              <div className={`border ${
                                isUser 
                                  ? 'bg-blue-600 border-blue-700' 
                                  : 'bg-white border-gray-200'
                              } p-3`}>
                                <p className={`text-sm ${isUser ? 'text-white' : 'text-gray-900'}`}>
                                  {message.text}
                                </p>
                                <div className={`flex items-center justify-end space-x-1 mt-1 ${
                                  isUser ? 'text-blue-200' : 'text-gray-400'
                                }`}>
                                  <span className="text-xs">
                                    {formatTime(message.createdAt)}
                                  </span>
                                  {isUser && (
                                    <CheckCheck className="h-3 w-3" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center space-x-2 mt-2">
                  <div className="w-8 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
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
            </div>

            {/* Input Area */}
            {selected.status === "resolved" ? (
              <div className="border-t border-gray-200 p-5 bg-green-50">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <p className="text-green-700 font-medium">This discussion has been resolved</p>
                </div>
              </div>
            ) : (
              <div className="border-t border-gray-200 p-5 bg-white">
                <div className="flex items-end space-x-3">
                  <div className="flex-1">
                    <textarea
                      value={replyText}
                      onChange={handleTyping}
                      placeholder="Type your message..."
                      rows={2}
                      className="w-full px-4 py-3 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
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
                        onClick={sendReply}
                        disabled={!replyText.trim()}
                        className="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Sidebar Toggle */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-20 p-2 bg-white border border-gray-200 shadow-md lg:hidden"
        >
          <MessageSquare className="h-5 w-5 text-blue-600" />
        </button>
      )}
    </div>
  );
}