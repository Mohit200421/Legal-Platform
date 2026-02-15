import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Award,
  FileText,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  Calendar,
  Clock,
  Star,
  BookOpen,
  AlertCircle,
  Search,
  X
} from "lucide-react";

export default function PendingLawyers() {
  const [lawyers, setLawyers] = useState([]);
  const [filteredLawyers, setFilteredLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // View Card State
  const [selectedLawyer, setSelectedLawyer] = useState(null);

  const fetchPendingLawyers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/pending-lawyers");
      setLawyers(res.data || []);
      setFilteredLawyers(res.data || []);
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

  // Filter lawyers based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = lawyers.filter(l => 
        l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredLawyers(filtered);
    } else {
      setFilteredLawyers(lawyers);
    }
  }, [searchTerm, lawyers]);

  const handleApprove = async (id) => {
    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/approve`);
      toast.success(res.data?.msg || "Lawyer approved");
      setSelectedLawyer(null);
      fetchPendingLawyers();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Approve failed");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this lawyer?")) return;

    try {
      const res = await API.put(`/admin/pending-lawyers/${id}/reject`);
      toast.success(res.data?.msg || "Lawyer rejected");
      setSelectedLawyer(null);
      fetchPendingLawyers();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Reject failed");
    }
  };

  // Convert key to readable format
  const formatKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Show only these fields in View Card
  const allowedFields = [
    "name",
    "email",
    "username",
    "phone",
    "city",
    "state",
    "experience",
    "specialization",
    "barCouncilNumber",
    "about",
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-yellow-600 px-3 py-1 mb-3">
              <Clock className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-xs font-medium text-yellow-600">PENDING REVIEW</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Pending Lawyer Requests
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Review and approve lawyer applications
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-xl font-bold text-yellow-600">{lawyers.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 p-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, specialization, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-10 py-2 border border-gray-300 bg-white text-sm focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600 focus:outline-none"
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
      </div>

      {/* Lawyers Table */}
      <div className="bg-white border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center space-x-2">
              <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent animate-spin"></div>
              <p className="text-gray-600">Loading lawyers...</p>
            </div>
          </div>
        ) : filteredLawyers.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-2">No pending lawyers found</p>
            <p className="text-xs text-gray-400">
              {searchTerm ? "Try adjusting your search" : "All applications have been processed"}
            </p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">
                  Applications ({filteredLawyers.length})
                </h2>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lawyer Details
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specialization
                    </th>
                    <th className="text-right p-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLawyers.map((lawyer) => (
                    <tr key={lawyer._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-yellow-100 border border-yellow-200 flex items-center justify-center flex-shrink-0">
                            <User className="h-5 w-5 text-yellow-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{lawyer.name}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <Briefcase className="h-3 w-3 mr-1" />
                              {lawyer.experience || "0"} years exp.
                            </div>
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
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <BookOpen className="h-3 w-3 mr-2 text-gray-400" />
                            {lawyer.specialization || "Not specified"}
                          </div>
                          {lawyer.city && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                              {lawyer.city}, {lawyer.state || ""}
                            </div>
                          )}
                        </div>
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
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* View Card Modal */}
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
                <Shield className="h-5 w-5 text-yellow-600" />
                <h2 className="text-lg font-bold text-gray-900">Lawyer Application Details</h2>
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
                {allowedFields.map((key) => (
                  <div key={key} className="border border-gray-100 p-4">
                    <p className="text-xs text-gray-500 mb-1">{formatKey(key)}</p>
                    <p className="text-sm text-gray-900">
                      {selectedLawyer?.[key]
                        ? String(selectedLawyer[key])
                        : "N/A"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => handleApprove(selectedLawyer._id)}
                className="px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 flex items-center space-x-2"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve Application</span>
              </button>
              <button
                onClick={() => handleReject(selectedLawyer._id)}
                className="px-4 py-2 border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 flex items-center space-x-2"
              >
                <XCircle className="h-4 w-4" />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}