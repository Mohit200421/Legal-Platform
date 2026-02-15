import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Search,
  X,
  Shield,
  Filter,
  ChevronDown,
  Phone,
  MapPin,
  Briefcase,
  Award,
  AlertCircle
} from "lucide-react";

export default function ManageLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const fetchPendingLawyers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/pending-lawyers");
      setLawyers(res.data);
      setFilteredLawyers(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load pending lawyers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = [...lawyers];

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter(l => l.lawyerApprovalStatus?.toLowerCase() === statusFilter.toLowerCase());
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(l => 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredLawyers(result);
  }, [lawyers, searchTerm, statusFilter]);

  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/approve`);
      toast.success(res.data.msg || "Lawyer approved");
      setLawyers((prev) => prev.filter((l) => l._id !== id));
      setSelectedLawyer(null);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/reject`);
      toast.success(res.data.msg || "Lawyer rejected");
      setLawyers((prev) => prev.filter((l) => l._id !== id));
      setSelectedLawyer(null);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to reject");
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case "approved":
        return {
          icon: CheckCircle,
          text: "Approved",
          bg: "bg-green-100",
          textColor: "text-green-700",
          border: "border-green-200"
        };
      case "rejected":
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-purple-600 px-3 py-1 mb-3">
              <Shield className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-medium text-purple-600">LAWYER MANAGEMENT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Manage Lawyers
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and manage lawyer applications
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {lawyers.filter(l => l.lawyerApprovalStatus === "pending").length}
              </p>
            </div>
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-xl font-bold text-gray-900">{lawyers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
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
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-3 text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredLawyers.length}</span> of {lawyers.length} lawyers
        </div>
      </div>

      {/* Lawyers Table */}
      <div className="bg-white border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent animate-spin"></div>
              <p className="text-gray-600">Loading lawyers...</p>
            </div>
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="p-12 text-center">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No lawyers found</p>
            <p className="text-xs text-gray-400">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your filters" 
                : "No lawyer applications yet"}
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Lawyer Applications
                </h2>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lawyer
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLawyers.map((lawyer) => {
                    const statusBadge = getStatusBadge(lawyer.lawyerApprovalStatus);
                    const StatusIcon = statusBadge.icon;

                    return (
                      <tr key={lawyer._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0">
                              <User className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{lawyer.name}</p>
                              <p className="text-xs text-gray-500 mt-1">ID: {lawyer._id.slice(-8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-3 w-3 mr-2 text-gray-400" />
                              {lawyer.email}
                            </div>
                            {lawyer.phone && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="h-3 w-3 mr-2 text-gray-400" />
                                {lawyer.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs border ${statusBadge.border} ${statusBadge.bg} ${statusBadge.textColor}`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusBadge.text}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedLawyer(lawyer)}
                              className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            
                            {lawyer.lawyerApprovalStatus === "pending" && (
                              <>
                                <button
                                  onClick={() => handleApprove(lawyer._id)}
                                  className="p-2 border border-green-300 text-green-700 hover:bg-green-50 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleReject(lawyer._id)}
                                  className="p-2 border border-red-300 text-red-700 hover:bg-red-50 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* View Details Modal */}
      {selectedLawyer && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLawyer(null)}
        >
          <div
            className="bg-white w-full max-w-2xl border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Lawyer Details</h2>
              </div>
              <button
                onClick={() => setSelectedLawyer(null)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm font-medium text-gray-900">{selectedLawyer.name}</p>
                  </div>
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm text-gray-900">{selectedLawyer.email}</p>
                  </div>
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="text-sm text-gray-900">{selectedLawyer.phone || "N/A"}</p>
                  </div>
                  <div className="border border-gray-100 p-3">
                    <p className="text-xs text-gray-500 mb-1">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 text-xs border ${
                      selectedLawyer.lawyerApprovalStatus === "pending" 
                        ? "border-yellow-200 bg-yellow-100 text-yellow-700"
                        : selectedLawyer.lawyerApprovalStatus === "approved"
                        ? "border-green-200 bg-green-100 text-green-700"
                        : "border-red-200 bg-red-100 text-red-700"
                    }`}>
                      {selectedLawyer.lawyerApprovalStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-200 bg-gray-50">
              {selectedLawyer.lawyerApprovalStatus === "pending" && (
                <>
                  <button
                    onClick={() => handleApprove(selectedLawyer._id)}
                    className="px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Approve</span>
                  </button>
                  <button
                    onClick={() => handleReject(selectedLawyer._id)}
                    className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 flex items-center space-x-2"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedLawyer(null)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">About Lawyer Management</h3>
            <p className="text-xs text-blue-700">
              Pending applications require review. Approved lawyers will be able to access the platform and receive client requests. Rejected applications are removed from the list.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}