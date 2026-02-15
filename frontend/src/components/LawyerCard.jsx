import { useState } from "react";
import { Phone, Video, X, MessageCircle, Send, CheckCircle, Clock, AlertCircle, Star, MapPin, Briefcase, IndianRupee } from "lucide-react";

export default function LawyerCard({
  lawyer,
  requestStatus, // "Pending" | "Accepted" | "Rejected" | undefined
  refreshRequests, // function to refresh status map
  onChat, // optional
}) {
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSendRequest = async () => {
    if (!subject.trim() || !message.trim()) {
      return alert("Subject and message are required!");
    }

    try {
      setSending(true);

      const res = await API.post("/user/contact-lawyer", {
        lawyerId: lawyer._id,
        subject,
        message,
      });

      alert(res.data.msg || "Request sent!");

      setSubject("");
      setMessage("");
      setOpen(false);

      if (refreshRequests) refreshRequests();
    } catch (err) {
      console.log(err);
      alert(err?.response?.data?.msg || "Failed to send request");
    } finally {
      setSending(false);
    }
  };

  const isPending = requestStatus === "Pending";
  const isAccepted = requestStatus === "Accepted";
  const isRejected = requestStatus === "Rejected";

  const getStatusBadge = () => {
    if (isAccepted) {
      return {
        icon: CheckCircle,
        text: "Accepted",
        bg: "bg-green-100",
        textColor: "text-green-700",
        border: "border-green-200"
      };
    }
    if (isPending) {
      return {
        icon: Clock,
        text: "Pending",
        bg: "bg-yellow-100",
        textColor: "text-yellow-700",
        border: "border-yellow-200"
      };
    }
    if (isRejected) {
      return {
        icon: AlertCircle,
        text: "Rejected",
        bg: "bg-red-100",
        textColor: "text-red-700",
        border: "border-red-200"
      };
    }
    return null;
  };

  const statusBadge = getStatusBadge();

  return (
    <>
      <div className="bg-white border border-gray-200 hover:shadow-lg transition-shadow">
        {/* Header with Avatar */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-start space-x-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gray-200 flex items-center justify-center flex-shrink-0 border border-gray-300">
              <span className="text-2xl font-bold text-gray-600">
                {lawyer?.name?.charAt(0)?.toUpperCase() || "L"}
              </span>
            </div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 truncate">
                  {lawyer?.name || "Lawyer"}
                </h3>
                {statusBadge && (
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.textColor}`}>
                    <statusBadge.icon className="h-3 w-3 mr-1" />
                    {statusBadge.text}
                  </span>
                )}
              </div>
              
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-700 ml-1">
                  {lawyer?.rating || "4.5"}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  ({lawyer?.reviews || 0} reviews)
                </span>
              </div>

              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">
                  {lawyer?.cityName || "City"}, {lawyer?.stateName || "State"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-5 border-b border-gray-100">
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-100 p-2">
              <p className="text-xs text-gray-500 mb-1">Experience</p>
              <div className="flex items-center">
                <Briefcase className="h-3 w-3 text-gray-400 mr-1" />
                <span className="text-sm font-medium text-gray-900">
                  {lawyer?.experience || "0"} years
                </span>
              </div>
            </div>
            <div className="border border-gray-100 p-2">
              <p className="text-xs text-gray-500 mb-1">Consultation Fee</p>
              <div className="flex items-center">
                <IndianRupee className="h-3 w-3 text-gray-400 mr-1" />
                <span className="text-sm font-medium text-gray-900">
                  ₹{lawyer?.price || "500"}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Specialization</p>
            <p className="text-sm text-gray-900 font-medium">
              {lawyer?.specialization || "General Practice"}
            </p>
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm text-gray-600 truncate">
              {lawyer?.email || "Not available"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 bg-gray-50">
          <div className="grid grid-cols-3 gap-2">
            <button className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
              <Phone className="h-3 w-3" />
              <span>Call</span>
            </button>

            <button className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm">
              <Video className="h-3 w-3" />
              <span>Video</span>
            </button>

            {isAccepted && (
              <button
                onClick={() => {
                  if (onChat) onChat(lawyer);
                  else alert("Chat is not connected here. Open My Requests page.");
                }}
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm"
              >
                <MessageCircle className="h-3 w-3" />
                <span>Chat</span>
              </button>
            )}

            {isPending ? (
              <button
                disabled
                className="flex items-center justify-center space-x-1 px-3 py-2 bg-gray-300 text-gray-600 cursor-not-allowed text-sm col-span-2"
              >
                <Clock className="h-3 w-3" />
                <span>Request Pending</span>
              </button>
            ) : (
              <button
                onClick={() => setOpen(true)}
                className={`flex items-center justify-center space-x-1 px-3 py-2 text-white transition-colors text-sm col-span-2 ${
                  isRejected 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                <Send className="h-3 w-3" />
                <span>{isRejected ? 'Send Again' : 'Send Request'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {open && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setOpen(false)}
        >
          <div 
            className="bg-white w-full max-w-md border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Send Request</h2>
                <p className="text-sm text-gray-500 mt-1">
                  To: <span className="font-medium text-gray-900">{lawyer?.name || "Lawyer"}</span>
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g., Consultation for Property Dispute"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Describe your legal issue in detail..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 border-l-4 border-blue-600 p-3">
                <p className="text-xs text-blue-700">
                  The lawyer will respond to your request within 24-48 hours. You'll be notified once they accept.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSendRequest}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Send Request</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}