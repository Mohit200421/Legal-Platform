import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import ChatModal from "../../components/chat/ChatModal";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Mail,
  Calendar,
  FileText,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  X,
  Send,
  ArrowRight,
  RefreshCw,
  Users,
  CheckCheck,
  Briefcase
} from "lucide-react";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Chat modal state
  const [openChat, setOpenChat] = useState(false);
  const [chatUser, setChatUser] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/requests");
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = [...requests];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(r => r.status === statusFilter);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(r => 
        r.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      const res = await API.put(`/lawyer/requests/${id}/status`, { status });
      toast.success(res.data.msg || `Request ${status}`);
      fetchRequests();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to update");
    }
  };

  const handleOpenChat = (user) => {
    if (!user?._id) return toast.error("User not found");
    setChatUser(user);
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setChatUser(null);
    fetchRequests(); // Refresh to update unread counts
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Accepted":
        return {
          icon: CheckCircle,
          text: "Accepted",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200"
        };
      case "Rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          bg: "bg-red-100",
          textColor: "text-red-700",
          border: "border-red-200"
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

  const getStatusCounts = () => {
    return {
      total: requests.length,
      pending: requests.filter(r => r.status === "Pending").length,
      accepted: requests.filter(r => r.status === "Accepted").length,
      rejected: requests.filter(r => r.status === "Rejected").length
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-purple-600 px-3 py-1 mb-3">
              <Users className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-medium text-purple-600">CLIENT REQUESTS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Client Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and respond to consultation requests from clients
            </p>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={fetchRequests}
            className="p-2 border border-gray-200 bg-white hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-l-4 border-purple-600 border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900">{counts.total}</p>
          <p className="text-xs text-gray-400 mt-1">All requests</p>
        </div>
        <div className="bg-white border-l-4 border-yellow-500 border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{counts.pending}</p>
          <p className="text-xs text-gray-400 mt-1">Awaiting response</p>
        </div>
        <div className="bg-white border-l-4 border-green-500 border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{counts.accepted}</p>
          <p className="text-xs text-gray-400 mt-1">Can chat now</p>
        </div>
        <div className="bg-white border-l-4 border-red-500 border border-gray-200 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{counts.rejected}</p>
          <p className="text-xs text-gray-400 mt-1">Not accepted</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 mb-6 p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject, message, or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-10 py-2 border border-gray-300 bg-white text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white text-sm focus:border-purple-600 focus:ring-1 focus:ring-purple-600 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredRequests.length}</span> of {requests.length} requests
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-purple-600 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading requests...</p>
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Send className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {searchTerm || statusFilter !== "all" 
              ? "Try adjusting your filters" 
              : "You haven't received any client requests yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={request._id}
                className="bg-white border border-gray-200 hover:border-purple-300 transition-colors"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Header with Status */}
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="p-2 bg-purple-50 border border-purple-200">
                          <FileText className="h-5 w-5 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">
                          {request.subject}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.textColor}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.text}
                        </span>
                      </div>

                      {/* Message */}
                      <p className="text-sm text-gray-600 mb-4 pl-11">
                        {request.message}
                      </p>

                      {/* Client Info */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pl-11">
                        <div className="border border-gray-100 p-3">
                          <p className="text-xs text-gray-500 mb-1">Client</p>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {request.userId?.name || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="border border-gray-100 p-3">
                          <p className="text-xs text-gray-500 mb-1">Email</p>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {request.userId?.email || "N/A"}
                            </span>
                          </div>
                        </div>

                        <div className="border border-gray-100 p-3">
                          <p className="text-xs text-gray-500 mb-1">Received</p>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-600">
                              {new Date(request.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3 pl-11">
                        {request.status === "Accepted" && (
                          <button
                            onClick={() => handleOpenChat(request.userId)}
                            className="px-4 py-2 bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 flex items-center space-x-2"
                          >
                            <MessageSquare className="h-4 w-4" />
                            <span>Chat with Client</span>
                          </button>
                        )}

                        <button
                          onClick={() => updateStatus(request._id, "Accepted")}
                          disabled={request.status === "Accepted"}
                          className={`px-4 py-2 border text-sm font-medium flex items-center space-x-2 ${
                            request.status === "Accepted"
                              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                              : "border-green-300 text-green-700 hover:bg-green-50"
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span>Accept</span>
                        </button>

                        <button
                          onClick={() => updateStatus(request._id, "Rejected")}
                          disabled={request.status === "Rejected"}
                          className={`px-4 py-2 border text-sm font-medium flex items-center space-x-2 ${
                            request.status === "Rejected"
                              ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                              : "border-red-300 text-red-700 hover:bg-red-50"
                          }`}
                        >
                          <XCircle className="h-4 w-4" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chat Modal */}
      <ChatModal
        open={openChat}
        onClose={handleCloseChat}
        receiverId={chatUser?._id}
        receiverName={chatUser?.name}
      />

      {/* Quick Tips */}
      <div className="mt-6 bg-purple-50 border-l-4 border-purple-600 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-purple-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-purple-900 mb-1">Managing Requests</h3>
            <p className="text-xs text-purple-700">
              Accept requests to start chatting with clients. Once accepted, you can communicate directly through the chat feature. Rejected requests cannot be undone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}