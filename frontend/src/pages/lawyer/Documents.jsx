import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  X,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  HardDrive,
  File,
  Image,
  FileSpreadsheet,
  FileArchive,
  Loader2,
  Search,
  Filter,
  ChevronDown,
  UserPlus,
  Brain,
  FileSearch
} from "lucide-react";

export default function Documents() {
  const [file, setFile] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  // for assign dropdown
  const [requests, setRequests] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  // OCR Modal
  const [openOCR, setOpenOCR] = useState(false);
  const [ocrText, setOcrText] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDocId, setOcrDocId] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Fetch Documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/document");
      setDocuments(res.data);
      setFilteredDocs(res.data);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Accepted Requests
  const fetchAcceptedRequests = async () => {
    try {
      const res = await API.get("/lawyer/requests");
      const accepted = res.data.filter((r) => r.status === "Accepted");
      setRequests(accepted);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load accepted requests");
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchAcceptedRequests();
  }, []);

  // Filter and Sort Documents
  useEffect(() => {
    let result = [...documents];

    // Search filter
    if (searchTerm) {
      result = result.filter(doc => 
        doc.filename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.assignedUserId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // OCR status filter
    if (filterStatus !== "all") {
      result = result.filter(doc => 
        filterStatus === "completed" ? doc.ocrTextId : !doc.ocrTextId
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "name") {
        return a.filename?.localeCompare(b.filename);
      }
      return 0;
    });

    setFilteredDocs(result);
  }, [documents, searchTerm, filterStatus, sortBy]);

  // Upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) return toast.error("Please select a file first!");
    if (!selectedUserId) return toast.error("Please select a user to assign!");

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("assignedUserId", selectedUserId);

      const res = await API.post("/lawyer/document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.msg || "Document uploaded!");
      setFile(null);
      setSelectedUserId("");
      fetchDocuments();
      
      // Reset file input
      const fileInput = document.getElementById("file-upload");
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      const res = await API.delete(`/lawyer/document/${id}`);
      toast.success(res.data.msg || "Document deleted");
      fetchDocuments();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Delete failed");
    }
  };

  // View
  const handleView = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    window.open(fileUrl, "_blank");
  };

  // Download
  const handleDownload = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = doc.filename || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Run OCR
  const handleRunOCR = async (docId) => {
    try {
      setOcrLoading(true);
      const res = await API.get(`/ocr/${docId}`);
      toast.success(res.data.msg || "OCR completed!");
      fetchDocuments();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "OCR failed");
    } finally {
      setOcrLoading(false);
    }
  };

  // View OCR Text
  const handleViewOCR = async (docId) => {
    try {
      setOcrLoading(true);
      setOcrDocId(docId);
      setOpenOCR(true);
      setOcrText("");

      const res = await API.get(`/ocr/text/${docId}`);
      setOcrText(res.data.extractedText || "No OCR text found");
    } catch (err) {
      console.log(err);
      setOcrText(err?.response?.data?.msg || "Failed to load OCR text");
    } finally {
      setOcrLoading(false);
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-5 w-5 text-red-500" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <Image className="h-5 w-5 text-blue-500" />;
    if (['doc', 'docx', 'txt'].includes(ext)) return <FileText className="h-5 w-5 text-blue-600" />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="h-5 w-5 text-green-600" />;
    if (['zip', 'rar', '7z'].includes(ext)) return <FileArchive className="h-5 w-5 text-yellow-600" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "N/A";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-purple-600 px-3 py-1 mb-3">
              <HardDrive className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-medium text-purple-600">DOCUMENT MANAGEMENT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Document Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload, manage, and process legal documents with OCR
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Total Documents</p>
              <p className="text-xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">OCR Completed</p>
              <p className="text-xl font-bold text-green-600">
                {documents.filter(d => d.ocrTextId).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Form */}
      <div className="bg-white border border-gray-200 mb-8">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Upload New Document</h2>
          </div>
        </div>

        <form onSubmit={handleUpload} className="p-5">
          <div className="grid md:grid-cols-3 gap-4">
            {/* User Selection */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Assign to Client
              </label>
              <div className="relative">
                <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none appearance-none"
                >
                  <option value="">Select a client</option>
                  {requests.length === 0 ? (
                    <option disabled>No accepted requests</option>
                  ) : (
                    requests.map((r) => (
                      <option key={r._id} value={r.userId?._id}>
                        {r.userId?.name} ({r.userId?.email})
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* File Upload */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Select File
              </label>
              <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                  <input
                    id="file-upload"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm text-gray-500 flex items-center">
                    <File className="h-4 w-4 mr-2 text-gray-400" />
                    {file ? file.name : "Choose a file..."}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      <span>Upload</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 mb-6 p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by filename or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            >
              <option value="all">All Documents</option>
              <option value="completed">OCR Completed</option>
              <option value="pending">OCR Pending</option>
            </select>
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <div className="bg-white border border-gray-200">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-bold text-gray-900">Uploaded Documents</h2>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1">
              {filteredDocs.length} of {documents.length} documents
            </span>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-12 border border-gray-100">
              <div className="inline-flex items-center space-x-2">
                <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                <p className="text-gray-600">Loading documents...</p>
              </div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="text-center py-12 border border-gray-100">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No documents found</p>
              <p className="text-xs text-gray-400">
                {searchTerm || filterStatus !== "all" 
                  ? "Try adjusting your filters" 
                  : "Upload your first document to get started"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc._id}
                  className="border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="p-5">
                    <div className="flex items-start space-x-4">
                      {/* File Icon */}
                      <div className="flex-shrink-0">
                        {getFileIcon(doc.filename)}
                      </div>

                      {/* Document Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1">
                              {doc.filename}
                            </h3>
                            
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <span className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-1 text-gray-400" />
                                {doc.assignedUserId?.name || "Unassigned"}
                              </span>
                              
                              <span className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                                {new Date(doc.createdAt).toLocaleDateString()}
                              </span>
                              
                              {doc.size && (
                                <span className="flex items-center text-gray-600">
                                  <HardDrive className="h-4 w-4 mr-1 text-gray-400" />
                                  {formatFileSize(doc.size)}
                                </span>
                              )}
                            </div>

                            {/* OCR Status */}
                            <div className="mt-2">
                              <span className={`inline-flex items-center px-2 py-1 text-xs border ${
                                doc.ocrTextId
                                  ? "border-green-200 bg-green-50 text-green-700"
                                  : "border-yellow-200 bg-yellow-50 text-yellow-700"
                              }`}>
                                {doc.ocrTextId ? (
                                  <>
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    OCR Completed
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    OCR Pending
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-start space-x-2">
                        <button
                          onClick={() => handleView(doc)}
                          className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                          title="Download"
                        >
                          <Download className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleRunOCR(doc._id)}
                          disabled={ocrLoading}
                          className="p-2 border border-purple-300 text-purple-600 hover:bg-purple-50 disabled:opacity-50"
                          title="Run OCR"
                        >
                          <Brain className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleViewOCR(doc._id)}
                          className="p-2 border border-blue-300 text-blue-600 hover:bg-blue-50"
                          title="View OCR Text"
                        >
                          <FileSearch className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(doc._id)}
                          className="p-2 border border-red-300 text-red-600 hover:bg-red-50"
                          title="Delete"
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

      {/* OCR Text Modal */}
      {openOCR && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setOpenOCR(false)}
        >
          <div 
            className="bg-white w-full max-w-3xl border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <FileSearch className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">OCR Extracted Text</h2>
              </div>
              <button
                onClick={() => setOpenOCR(false)}
                className="p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {ocrLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
                  <span className="ml-2 text-gray-600">Loading OCR text...</span>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm text-gray-700 bg-gray-50 p-4 border border-gray-200">
                  {ocrText}
                </pre>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-5 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setOpenOCR(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}