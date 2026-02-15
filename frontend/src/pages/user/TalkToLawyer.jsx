import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterSidebar from "../../components/FilterSidebar";
import LawyerCard from "../../components/LawyerCard";
import API from "../../api/axios";
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  ChevronDown,
  Star,
  Briefcase,
  IndianRupee,
  MapPin,
  Users,
  ArrowUpDown
} from "lucide-react";

export default function TalkToLawyer() {
  const navigate = useNavigate();

  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Search + Sort
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  // Sidebar Filters
  const [location, setLocation] = useState("");
  const [selectedProblems, setSelectedProblems] = useState([]);

  // store request status map { lawyerId : "Pending/Accepted/Rejected" }
  const [requestMap, setRequestMap] = useState({});

  const fetchLawyers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/user/lawyers");
      setLawyers(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to load lawyers");
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequestsMap = async () => {
    try {
      const res = await API.get("/user/my-requests-map");
      setRequestMap(res.data || {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLawyers();
    fetchMyRequestsMap();
  }, []);

  const filteredLawyers = useMemo(() => {
    let data = [...lawyers];

    if (search.trim()) {
      data = data.filter((l) =>
        `${l.name || ""} ${l.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    if (location.trim()) {
      data = data.filter((l) =>
        `${l.cityName || ""} ${l.stateName || ""} ${l.email || ""}`
          .toLowerCase()
          .includes(location.toLowerCase())
      );
    }

    if (selectedProblems.length > 0) {
      data = data.filter((l) =>
        selectedProblems.some((p) =>
          (l.specialization || "").toLowerCase().includes(p.toLowerCase())
        )
      );
    }

    if (sortBy === "Rating") {
      data.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === "Experience") {
      data.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    } else if (sortBy === "Price") {
      data.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return data;
  }, [lawyers, search, sortBy, location, selectedProblems]);

  const getActiveFilterCount = () => {
    let count = 0;
    if (location) count++;
    if (selectedProblems.length > 0) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Talk to Lawyer</h1>
              <p className="text-sm text-gray-500 mt-1">
                Connect with experienced legal professionals
              </p>
            </div>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="ml-1 bg-blue-600 text-white text-xs w-5 h-5 flex items-center justify-center">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Filter Sidebar - Desktop */}
        <div className="hidden lg:block w-80 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <FilterSidebar
            location={location}
            setLocation={setLocation}
            selectedProblems={selectedProblems}
            setSelectedProblems={setSelectedProblems}
          />
        </div>

        {/* Filter Sidebar - Mobile */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto">
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <FilterSidebar
                location={location}
                setLocation={setLocation}
                selectedProblems={selectedProblems}
                setSelectedProblems={setSelectedProblems}
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search and Sort Bar */}
          <div className="bg-white border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Box */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>

              {/* Sort Dropdown */}
              <div className="md:w-64">
                <div className="relative">
                  <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 border border-gray-300 bg-white text-sm appearance-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  >
                    <option value="">Sort by</option>
                    <option value="Rating">Rating (High to Low)</option>
                    <option value="Experience">Experience (High to Low)</option>
                    <option value="Price">Price (Low to High)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(location || selectedProblems.length > 0) && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500 py-1">Active filters:</span>
                {location && (
                  <span className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-200 text-xs">
                    <MapPin className="h-3 w-3 text-blue-600 mr-1" />
                    {location}
                    <button
                      onClick={() => setLocation("")}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {selectedProblems.map((problem) => (
                  <span key={problem} className="inline-flex items-center px-2 py-1 bg-blue-50 border border-blue-200 text-xs">
                    <Briefcase className="h-3 w-3 text-blue-600 mr-1" />
                    {problem}
                    <button
                      onClick={() => setSelectedProblems(selectedProblems.filter(p => p !== problem))}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Results Stats */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium text-gray-900">{filteredLawyers.length}</span> lawyers
              {search && <span> for "<span className="font-medium">{search}</span>"</span>}
            </p>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">{lawyers.length} total available</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="bg-white border border-gray-200 p-8 text-center">
              <div className="inline-flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent animate-spin"></div>
                <span className="text-gray-600">Loading lawyers...</span>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredLawyers.length === 0 && (
            <div className="bg-white border border-gray-200 p-12 text-center">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No lawyers found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Try adjusting your search or filter criteria
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setLocation("");
                  setSelectedProblems([]);
                  setSortBy("");
                }}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Lawyer Grid */}
          {!loading && filteredLawyers.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredLawyers.map((lawyer) => (
                <LawyerCard
                  key={lawyer._id}
                  lawyer={lawyer}
                  requestStatus={requestMap[lawyer._id]}
                  refreshRequests={fetchMyRequestsMap}
                  onChat={() => navigate("/user/my-requests")}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}