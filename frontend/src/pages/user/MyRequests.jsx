import { useEffect, useState } from "react";
import API from "../../api/axios";
import ChatModal from "../../components/chat/ChatModal";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Mail,
  FileText,
  AlertCircle,
  Send,
  ArrowRight,
  RefreshCw
} from "lucide-react";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Chat Modal state
  const [openChat, setOpenChat] = useState(false);
  const [chatLawyer, setChatLawyer] = useState(null);

  const fetchMyRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/my-requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const refreshRequests = async () => {
    setRefreshing(true);
    await fetchMyRequests();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchMyRequests();
  }, []);

  const handleOpenChat = (lawyer) => {
    if (!lawyer?._id) return alert("Lawyer not found for this request!");
    setChatLawyer(lawyer);
    setOpenChat(true);
  };

  const handleCloseChat = () => {
    setOpenChat(false);
    setChatLawyer(null);
    refreshRequests();
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
    const counts = {
      total: requests.length,
      pending: requests.filter(r => r.status === "Pending").length,
      accepted: requests.filter(r => r.status === "Accepted").length,
      rejected: requests.filter(r => r.status === "Rejected").length
    };
    return counts;
  };

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-3">
              <FileText className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-blue-600">REQUEST MANAGEMENT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your consultation requests
            </p>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={refreshRequests}
            disabled={refreshing}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm font-medium text-gray-700">Refresh</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border-l-4 border-blue-600 border border-gray-200 p-5">
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

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading your requests...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && requests.length === 0 && (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <Send className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            You haven't sent any consultation requests to lawyers.
          </p>
          <button
            onClick={() => window.location.href = "/user/talk-to-lawyer"}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
          >
            <span>Browse Lawyers</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Requests List */}
      {!loading && requests.length > 0 && (
        <div className="space-y-4">
          {requests.map((request) => {
            const statusBadge = getStatusBadge(request.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <div
                key={request._id}
                className="bg-white border border-gray-200 hover:border-gray-300 transition-colors"
              >
                {/* Request Header */}
                <div className="border-b border-gray-100 p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.textColor}`}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusBadge.text}
                        </span>
                        <span className="text-xs text-gray-500">
                          ID: {request._id.slice(-8)}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {request.subject}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                        {request.message}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Request Details */}
                <div className="p-5 bg-gray-50">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lawyer Info */}
                    <div className="border border-gray-200 bg-white p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Lawyer Details</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">
                            {request.lawyerId?.name || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            {request.lawyerId?.email || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Request Metadata */}
                    <div className="border border-gray-200 bg-white p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Request Info</p>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-600">
                            Sent: {new Date(request.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {request.updatedAt && request.updatedAt !== request.createdAt && (
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">
                              Updated: {new Date(request.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex items-center justify-end space-x-3">
                    {request.status === "Accepted" && request.lawyerId?._id && (
                      <button
                        onClick={() => handleOpenChat(request.lawyerId)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Chat with Lawyer</span>
                      </button>
                    )}
                    
                    {request.status === "Rejected" && (
                      <button
                        onClick={() => window.location.href = "/user/talk-to-lawyer"}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
                      >
                        <Send className="h-4 w-4" />
                        <span>Send New Request</span>
                      </button>
                    )}
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
        receiverId={chatLawyer?._id}
        receiverName={chatLawyer?.name}
      />
    </div>
  );
}