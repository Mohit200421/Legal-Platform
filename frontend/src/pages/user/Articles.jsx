import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  BookOpen, 
  Search, 
  X, 
  Calendar, 
  User, 
  ChevronRight,
  FileText,
  Clock,
  Eye,
  ArrowRight
} from "lucide-react";

export default function UserArticles() {
  const [articles, setArticles] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  // Fetch Articles (User View)
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user/articles");
        setArticles(res.data || []);
        setFiltered(res.data || []);
      } catch (err) {
        console.log(err);
        setArticles([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Search Filter
  useEffect(() => {
    const result = articles.filter((a) =>
      a.subject?.toLowerCase().includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, articles]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-3">
              <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-blue-600">LEGAL LIBRARY</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Legal Articles
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Read latest legal articles written by verified lawyers
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Total Articles</p>
              <p className="text-xl font-bold text-gray-900">{articles.length}</p>
            </div>
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Contributors</p>
              <p className="text-xl font-bold text-gray-900">
                {new Set(articles.map(a => a.authorId?._id)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 p-5 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles by subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          {/* Results Count */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium text-gray-900">{filtered.length}</span> articles
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading articles...</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && (
        <div className="bg-white border border-gray-200 p-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-sm text-gray-500 mb-4">
            {search ? "No results match your search criteria" : "No articles available yet"}
          </p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <X className="h-4 w-4" />
              <span>Clear search</span>
            </button>
          )}
        </div>
      )}

      {/* Articles Grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((article) => (
            <article
              key={article._id}
              className="bg-white border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group cursor-pointer"
              onClick={() => setSelected(article)}
            >
              {/* Card Header */}
              <div className="border-b border-gray-100 p-5">
                <div className="flex items-start justify-between mb-2">
                  <div className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-100">
                    <FileText className="h-3 w-3 text-blue-600 mr-1" />
                    <span className="text-xs font-medium text-blue-600">Article</span>
                  </div>
                  {article.authorId?.name && (
                    <div className="flex items-center text-xs text-gray-500">
                      <User className="h-3 w-3 mr-1" />
                      <span className="truncate max-w-[100px]">{article.authorId.name}</span>
                    </div>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.subject}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                  {article.description}
                </p>

                {/* Card Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {article.createdAt
                        ? new Date(article.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : "No date"}
                    </span>
                  </div>

                  <button 
                    className="inline-flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected(article);
                    }}
                  >
                    Read More
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Article Modal */}
      {selected && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelected(null)}
        >
          <div 
            className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-flex items-center px-3 py-1 bg-blue-50 border border-blue-100 mb-3">
                    <BookOpen className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-xs font-medium text-blue-600">LEGAL ARTICLE</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 pr-8">
                    {selected.subject}
                  </h2>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="p-2 hover:bg-gray-100 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Article Metadata */}
              <div className="flex flex-wrap gap-4 mb-6 pb-6 border-b border-gray-100">
                {selected.createdAt && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Published: {new Date(selected.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                )}
                {selected.authorId?.name && (
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Author: <span className="font-medium text-gray-900">{selected.authorId.name}</span></span>
                  </div>
                )}
                {selected.authorId?.specialization && (
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                    <span>Specialization: {selected.authorId.specialization}</span>
                  </div>
                )}
              </div>

              {/* Article Content */}
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {selected.description}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 bg-gray-50 p-6">
              <div className="flex items-center justify-end">
                <button
                  onClick={() => setSelected(null)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}