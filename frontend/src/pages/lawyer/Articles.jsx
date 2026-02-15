import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  FileText,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  BookOpen,
  Calendar,
  Clock,
  Eye,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  PenTool,
  Archive,
  RefreshCw
} from "lucide-react";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // form state
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editSubject, setEditSubject] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/article");
      setArticles(res.data);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleAddArticle = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !description.trim()) {
      return toast.error("Subject and Description are required!");
    }

    try {
      setSubmitting(true);
      const res = await API.post("/lawyer/article", {
        subject,
        description,
      });

      toast.success(res.data?.msg || "Article added");
      setSubject("");
      setDescription("");
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to add article");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (article) => {
    setEditingId(article._id);
    setEditSubject(article.subject);
    setEditDescription(article.description);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditSubject("");
    setEditDescription("");
  };

  const handleUpdate = async (id) => {
    if (!editSubject.trim() || !editDescription.trim()) {
      return toast.error("Subject and Description are required!");
    }

    try {
      await API.put(`/lawyer/article/${id}`, {
        subject: editSubject,
        description: editDescription,
      });

      toast.success("Article updated");
      cancelEdit();
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to update article");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await API.delete(`/lawyer/article/${id}`);
      toast.success(res.data?.msg || "Article deleted");
      fetchArticles();
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.error || "Failed to delete article");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-3">
              <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-blue-600">ARTICLE MANAGEMENT</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Manage Articles
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create and manage legal articles for your clients
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Total Articles</p>
              <p className="text-xl font-bold text-gray-900">{articles.length}</p>
            </div>
            <button
              onClick={fetchArticles}
              className="p-2 border border-gray-200 bg-white hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Add Article Form */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 sticky top-6">
            {/* Form Header */}
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center space-x-2">
                <PenTool className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Write New Article</h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Share your legal expertise with clients
              </p>
            </div>

            {/* Form Body */}
            <form onSubmit={handleAddArticle} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Subject / Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Understanding Property Rights in India"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Article Content
                </label>
                <textarea
                  placeholder="Write your article content here. Include legal references, case studies, and practical advice..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
                />
              </div>

              {/* Character Count */}
              <div className="text-right text-xs text-gray-400">
                {description.length} characters
              </div>

              {/* Form Footer */}
              <div className="border-t border-gray-100 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-2.5 px-4 font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Publish Article</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Writing Tips */}
            <div className="border-t border-gray-200 bg-gray-50 p-5">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Writing Tips</h3>
              <ul className="space-y-2">
                <li className="flex items-start text-xs text-gray-600">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Use clear, jargon-free language
                </li>
                <li className="flex items-start text-xs text-gray-600">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Include relevant legal citations
                </li>
                <li className="flex items-start text-xs text-gray-600">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Add practical examples
                </li>
                <li className="flex items-start text-xs text-gray-600">
                  <CheckCircle className="h-3 w-3 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  Keep paragraphs concise
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column - Articles List */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200">
            {/* List Header */}
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Archive className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">Published Articles</h2>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1">
                  {articles.length} {articles.length === 1 ? 'article' : 'articles'}
                </span>
              </div>
            </div>

            {/* Articles List */}
            <div className="p-5">
              {loading ? (
                <div className="text-center py-12 border border-gray-100">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent animate-spin"></div>
                    <p className="text-gray-600">Loading articles...</p>
                  </div>
                </div>
              ) : articles.length === 0 ? (
                <div className="text-center py-12 border border-gray-100">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No articles published yet</p>
                  <p className="text-xs text-gray-400">
                    Create your first article using the form
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {articles.map((article) => (
                    <div
                      key={article._id}
                      className={`border ${
                        editingId === article._id 
                          ? 'border-blue-300 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      } transition-colors`}
                    >
                      {editingId === article._id ? (
                        // Edit Mode
                        <div className="p-5">
                          <div className="space-y-4">
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Subject
                              </label>
                              <input
                                value={editSubject}
                                onChange={(e) => setEditSubject(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
                              />
                            </div>
                            <div className="flex items-center space-x-2 pt-2">
                              <button
                                onClick={() => handleUpdate(article._id)}
                                className="px-4 py-2 bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                              >
                                <Save className="h-4 w-4" />
                                <span>Save Changes</span>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                              >
                                <X className="h-4 w-4" />
                                <span>Cancel</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // View Mode
                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <FileText className="h-4 w-4 text-blue-600" />
                                <h3 className="text-lg font-bold text-gray-900">
                                  {article.subject}
                                </h3>
                              </div>
                              
                              {/* Metadata */}
                              <div className="flex items-center space-x-4 text-xs text-gray-500 mb-3">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {new Date(article.createdAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                                {article.updatedAt !== article.createdAt && (
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    Updated
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <span className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1">
                              Published
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4 leading-relaxed whitespace-pre-wrap">
                            {article.description.length > 300
                              ? `${article.description.substring(0, 300)}...`
                              : article.description}
                          </p>

                          {article.description.length > 300 && (
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium mb-3 flex items-center">
                              Read More
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </button>
                          )}

                          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                            <button
                              onClick={() => startEdit(article)}
                              className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                              title="Edit article"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(article._id)}
                              className="p-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete article"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}