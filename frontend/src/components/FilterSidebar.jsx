import { MapPin, X, Filter, ChevronDown } from "lucide-react";

const problemTypes = [
  "Divorce & Child Custody",
  "Property & Real Estate",
  "Cheque Bounce & Money Recovery",
  "Employment Issues",
  "Consumer Protection",
  "Civil Matters",
  "Cyber Crime",
  "Company & Start-Ups",
  "Other Legal Problem",
  "Criminal Matter",
];

export default function FilterSidebar({
  location,
  setLocation,
  selectedProblems,
  setSelectedProblems,
}) {
  const toggleProblem = (problem) => {
    if (selectedProblems.includes(problem)) {
      setSelectedProblems(selectedProblems.filter((p) => p !== problem));
    } else {
      setSelectedProblems([...selectedProblems, problem]);
    }
  };

  const clearFilters = () => {
    setLocation("");
    setSelectedProblems([]);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (location) count++;
    count += selectedProblems.length;
    return count;
  };

  return (
    <aside className="h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-600" />
            <h3 className="font-bold text-gray-900">Filters</h3>
          </div>
          {getActiveFilterCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              Clear all
              <X className="h-3 w-3 ml-1" />
            </button>
          )}
        </div>
        
        {/* Active Filter Count Badge */}
        {getActiveFilterCount() > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            {getActiveFilterCount()} active filter{getActiveFilterCount() > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="p-4 border-b border-gray-200">
        <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
          Location
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Enter city or state"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full pl-9 pr-8 py-2 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
          />
          {location && (
            <button
              onClick={() => setLocation("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-gray-100 p-0.5"
            >
              <X className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        
        {/* Location Hint */}
        <p className="text-xs text-gray-400 mt-1">
          e.g., Mumbai, Delhi, Bangalore
        </p>
      </div>

      {/* Problem Type Section */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
            Problem Type
          </label>
          {selectedProblems.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5">
              {selectedProblems.length} selected
            </span>
          )}
        </div>
        
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {problemTypes.map((item, index) => (
            <label
              key={index}
              className={`flex items-center space-x-3 cursor-pointer group p-1 ${
                selectedProblems.includes(item) ? 'bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={selectedProblems.includes(item)}
                onChange={() => toggleProblem(item)}
                className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className={`text-sm flex-1 ${
                selectedProblems.includes(item) 
                  ? 'text-blue-700 font-medium' 
                  : 'text-gray-700 group-hover:text-gray-900'
              }`}>
                {item}
              </span>
              {selectedProblems.includes(item) && (
                <X 
                  className="h-3 w-3 text-gray-400 hover:text-gray-600" 
                  onClick={(e) => {
                    e.preventDefault();
                    toggleProblem(item);
                  }}
                />
              )}
            </label>
          ))}
        </div>
      </div>

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <p className="text-xs font-medium text-gray-700 mb-2">Applied Filters</p>
          <div className="space-y-2">
            {location && (
              <div className="flex items-center justify-between text-xs bg-white border border-gray-200 p-2">
                <div className="flex items-center">
                  <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-gray-600">Location:</span>
                </div>
                <span className="font-medium text-gray-900">{location}</span>
              </div>
            )}
            {selectedProblems.length > 0 && (
              <div className="bg-white border border-gray-200 p-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">Problem Types:</span>
                  <span className="text-xs text-gray-500">{selectedProblems.length}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedProblems.slice(0, 2).map((problem) => (
                    <span key={problem} className="text-xs bg-blue-50 border border-blue-200 px-2 py-0.5 flex items-center">
                      {problem.length > 20 ? `${problem.substring(0, 20)}...` : problem}
                      <button
                        onClick={() => toggleProblem(problem)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="h-2 w-2" />
                      </button>
                    </span>
                  ))}
                  {selectedProblems.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{selectedProblems.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* Apply Filters Button (for mobile) */}
          <button
            onClick={clearFilters}
            className="w-full mt-3 py-2 border border-gray-300 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-center space-x-1 lg:hidden"
          >
            <X className="h-3 w-3" />
            <span>Clear all filters</span>
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Total problem types:</span>
            <span className="font-medium text-gray-700">{problemTypes.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Selected:</span>
            <span className="font-medium text-blue-600">{selectedProblems.length}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}