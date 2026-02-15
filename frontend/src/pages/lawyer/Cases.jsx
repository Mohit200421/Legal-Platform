import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  User,
  Calendar,
  Clock,
  FileText,
  Scale,
  Gavel,
  Search,
  Filter,
  ChevronDown,
  X,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  MoreVertical,
  FolderOpen
} from "lucide-react";

export default function Cases() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Form state
  const [caseTitle, setCaseTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [caseType, setCaseType] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchCases = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/case");
      setCases(res.data);
      setFilteredCases(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load cases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  // Filter and search
  useEffect(() => {
    let result = [...cases];

    if (searchTerm) {
      result = result.filter(c => 
        c.caseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseType?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCases(result);
  }, [cases, searchTerm]);

  const handleAddCase = async (e) => {
    e.preventDefault();

    if (!caseTitle || !clientName || !caseType) {
      return toast.error("Please fill all fields");
    }

    try {
      if (editingId) {
        await API.put(`/lawyer/case/${editingId}`, { caseTitle, clientName, caseType });
        toast.success("Case updated successfully");
        setEditingId(null);
      } else {
        await API.post("/lawyer/case", { caseTitle, clientName, caseType });
        toast.success("Case added successfully");
      }

      setCaseTitle("");
      setClientName("");
      setCaseType("");
      fetchCases();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Operation failed");
    }
  };

  const handleEdit = (caseItem) => {
    setEditingId(caseItem._id);
    setCaseTitle(caseItem.caseTitle);
    setClientName(caseItem.clientName);
    setCaseType(caseItem.caseType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
    
    try {
      await API.delete(`/lawyer/case/${id}`);
      toast.success("Case deleted successfully");
      fetchCases();
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete case");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setCaseTitle("");
    setClientName("");
    setCaseType("");
  };

  const caseTypes = [
    "Civil",
    "Criminal",
    "Corporate",
    "Family",
    "Property",
    "Tax",
    "Employment",
    "Intellectual Property"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-3">
              <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-blue-600">CASE MANAGEMENT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Case Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your legal cases and client information
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Total Cases</p>
              <p className="text-xl font-bold text-gray-900">{cases.length}</p>
            </div>
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Active Cases</p>
              <p className="text-xl font-bold text-blue-600">{cases.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Case Form */}
      <div className="bg-white border border-gray-200 mb-8">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center space-x-2">
            {editingId ? <Edit2 className="h-5 w-5 text-blue-600" /> : <Plus className="h-5 w-5 text-blue-600" />}
            <h2 className="text-lg font-bold text-gray-900">
              {editingId ? "Edit Case" : "Add New Case"}
            </h2>
          </div>
        </div>

        <form onSubmit={handleAddCase} className="p-5">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Case Title
              </label>
              <input
                type="text"
                placeholder="e.g., Smith vs Corporation"
                value={caseTitle}
                onChange={(e) => setCaseTitle(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Client Name
              </label>
              <input
                type="text"
                placeholder="Full name of client"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Case Type
              </label>
              <div className="relative">
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none appearance-none"
                >
                  <option value="">Select case type</option>
                  {caseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 flex items-center space-x-2"
            >
              {editingId ? <Edit2 className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              <span>{editingId ? "Update Case" : "Add Case"}</span>
            </button>
            
            {editingId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border border-gray-200 mb-6 p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search cases by title, client, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
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
          
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{filteredCases.length}</span> cases
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">My Cases</h2>
            </div>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-12 border border-gray-100">
              <div className="inline-flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin"></div>
                <p className="text-gray-600">Loading cases...</p>
              </div>
            </div>
          ) : filteredCases.length === 0 ? (
            <div className="text-center py-12 border border-gray-100">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No cases found</p>
              <p className="text-xs text-gray-400">
                {searchTerm 
                  ? "Try adjusting your search criteria" 
                  : "Add your first case to get started"}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredCases.map((caseItem) => (
                <div
                  key={caseItem._id}
                  className="border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="p-2 bg-blue-50 border border-blue-200">
                            <Gavel className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">
                            {caseItem.caseTitle}
                          </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="border border-gray-100 p-3">
                            <p className="text-xs text-gray-500 mb-1">Client</p>
                            <div className="flex items-center">
                              <User className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm font-medium text-gray-900">
                                {caseItem.clientName}
                              </span>
                            </div>
                          </div>

                          <div className="border border-gray-100 p-3">
                            <p className="text-xs text-gray-500 mb-1">Case Type</p>
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-900">
                                {caseItem.caseType}
                              </span>
                            </div>
                          </div>

                          <div className="border border-gray-100 p-3">
                            <p className="text-xs text-gray-500 mb-1">Created</p>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">
                                {new Date(caseItem.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Case ID */}
                        <div className="text-xs text-gray-400">
                          Case ID: {caseItem._id}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-start space-x-2 ml-4">
                        <button
                          onClick={() => handleEdit(caseItem)}
                          className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                          title="Edit case"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(caseItem._id)}
                          className="p-2 border border-red-300 text-red-600 hover:bg-red-50"
                          title="Delete case"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-6 bg-blue-50 border-l-4 border-blue-600 p-4">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 mb-1">Case Management Tips</h3>
            <p className="text-xs text-blue-700">
              Add detailed case information to help track progress. You can add case events and documents after creating the case.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}