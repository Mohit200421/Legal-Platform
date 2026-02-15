import { useEffect, useState } from "react";
import API from "../../api/axios";
import {
  FileText,
  Search,
  X,
  Download,
  Eye,
  User,
  Calendar,
  Clock,
  Filter,
  ChevronDown,
  File,
  Image,
  FileSpreadsheet,
  FileArchive,
  Loader2,
  Trash2,
  Share2,
  MoreVertical,
  HardDrive
} from "lucide-react";

export default function UserDocuments() {
  const [documents, setDocuments] = useState([]);
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);

  // Search
  const [query, setQuery] = useState("");
  
  // Filters
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const BACKEND_URL = import.meta.env.VITE_API_URL;

  // Fetch User Documents
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/documents");
      setDocuments(res.data);
      setFilteredDocs(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Search OCR Documents
  const handleSearch = async () => {
    if (!query.trim()) {
      setFilteredDocs(documents);
      return;
    }

    try {
      setSearchLoading(true);
      const res = await API.get(`/user/search-documents?query=${query}`);
      setFilteredDocs(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to search documents");
    } finally {
      setSearchLoading(false);
    }
  };

  // Apply filters and sorting
  useEffect(() => {
    let result = [...documents];

    // Apply type filter
    if (filterType !== "all") {
      result = result.filter(doc => {
        const ext = doc.filename?.split('.').pop()?.toLowerCase();
        if (filterType === "pdf") return ext === "pdf";
        if (filterType === "image") return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext);
        if (filterType === "doc") return ['doc', 'docx', 'txt', 'rtf'].includes(ext);
        if (filterType === "spreadsheet") return ['xls', 'xlsx', 'csv'].includes(ext);
        return true;
      });
    }

    // Apply sorting
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
  }, [documents, filterType, sortBy]);

  const handleView = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    window.open(fileUrl, "_blank");
  };

  const handleDownload = (doc) => {
    const fileUrl = `${BACKEND_URL}/${doc.path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = doc.filename || "document";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearSearch = () => {
    setQuery("");
    setFilteredDocs(documents);
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return <FileText className="h-6 w-6 text-red-500" />;
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <Image className="h-6 w-6 text-blue-500" />;
    if (['doc', 'docx', 'txt'].includes(ext)) return <FileText className="h-6 w-6 text-blue-600" />;
    if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileSpreadsheet className="h-6 w-6 text-green-600" />;
    if (['zip', 'rar', '7z'].includes(ext)) return <FileArchive className="h-6 w-6 text-yellow-600" />;
    return <File className="h-6 w-6 text-gray-500" />;
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
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-3">
              <HardDrive className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-blue-600">DOCUMENT MANAGEMENT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Documents
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Access and manage all your legal documents
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Total Documents</p>
              <p className="text-xl font-bold text-gray-900">{documents.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white border border-gray-200 p-5 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search inside documents (OCR)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-9 pr-10 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={searchLoading}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 min-w-[120px]"
          >
            {searchLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-xs text-gray-500">Filter by:</span>
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="image">Images</option>
            <option value="doc">Documents</option>
            <option value="spreadsheet">Spreadsheets</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
          </select>

          {(filterType !== "all" || query) && (
            <button
              onClick={() => {
                setFilterType("all");
                setSortBy("newest");
                setQuery("");
                setFilteredDocs(documents);
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Clear all filters
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      {!loading && !searchLoading && (
        <div className="mb-4 text-sm text-gray-600">
          Showing <span className="font-medium text-gray-900">{filteredDocs.length}</span> documents
        </div>
      )}

      {/* Loading State */}
      {(loading || searchLoading) && (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center space-x-3">
            <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
            <p className="text-gray-600">
              {loading ? "Loading documents..." : "Searching documents..."}
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !searchLoading && filteredDocs.length === 0 && (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {query 
              ? "No results match your search criteria" 
              : "You don't have any documents assigned yet"}
          </p>
          {query && (
            <button
              onClick={clearSearch}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear search</span>
            </button>
          )}
        </div>
      )}

      {/* Documents List */}
      {!loading && !searchLoading && filteredDocs.length > 0 && (
        <div className="space-y-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc._id}
              className="bg-white border border-gray-200 hover:border-blue-300 transition-colors"
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
                            {doc.uploaderId?.name || "Unknown"}
                          </span>
                          
                          <span className="flex items-center text-gray-600">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(doc.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </span>
                          
                          <span className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(doc.createdAt).toLocaleTimeString()}
                          </span>

                          {doc.size && (
                            <span className="flex items-center text-gray-600">
                              <HardDrive className="h-4 w-4 mr-1 text-gray-400" />
                              {formatFileSize(doc.size)}
                            </span>
                          )}
                        </div>

                        {/* Uploader Email */}
                        {doc.uploaderId?.email && (
                          <p className="text-xs text-gray-500 mt-2">
                            Uploaded by: {doc.uploaderId.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(doc)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      title="View document"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="text-sm">View</span>
                    </button>
                    
                    <button
                      onClick={() => handleDownload(doc)}
                      className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      title="Download document"
                    >
                      <Download className="h-4 w-4" />
                      <span className="text-sm">Download</span>
                    </button>

                    <button className="p-2 border border-gray-300 hover:bg-gray-50 transition-colors">
                      <MoreVertical className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}