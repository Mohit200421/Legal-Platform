import { useEffect, useState } from "react";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  Calendar,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  ChevronDown,
  Search,
  Clock,
  FileText,
  Briefcase,
  User,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  FolderOpen,
  CalendarDays
} from "lucide-react";

export default function CaseEvents() {
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState("");
  const [selectedCase, setSelectedCase] = useState(null);

  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loadingCases, setLoadingCases] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // editing state
  const [editingEventId, setEditingEventId] = useState(null);

  // form
  const [eventTitle, setEventTitle] = useState("");
  const [eventDetails, setEventDetails] = useState("");
  const [eventDate, setEventDate] = useState("");

  // Load cases
  const fetchCases = async () => {
    try {
      setLoadingCases(true);
      const res = await API.get("/lawyer/case");
      setCases(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load cases");
    } finally {
      setLoadingCases(false);
    }
  };

  // Load events of selected case
  const fetchEvents = async (caseId) => {
    if (!caseId) return;

    try {
      setLoadingEvents(true);
      const res = await API.get(`/lawyer/case/${caseId}/event`);
      setEvents(res.data);
      setFilteredEvents(res.data);
      
      // Find selected case details
      const selected = cases.find(c => c._id === caseId);
      setSelectedCase(selected);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load events");
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  useEffect(() => {
    if (selectedCaseId) {
      fetchEvents(selectedCaseId);
    } else {
      setSelectedCase(null);
      setEvents([]);
      setFilteredEvents([]);
    }
  }, [selectedCaseId]);

  // Filter events
  useEffect(() => {
    if (searchTerm) {
      const filtered = events.filter(e => 
        e.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.eventDetails?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredEvents(filtered);
    } else {
      setFilteredEvents(events);
    }
  }, [searchTerm, events]);

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!selectedCaseId) return toast.error("Please select a case first!");
    if (!eventTitle.trim() || !eventDate)
      return toast.error("Event title & date required!");

    try {
      if (editingEventId) {
        // UPDATE
        const res = await API.put(`/lawyer/case/event/${editingEventId}`, {
          eventTitle,
          eventDetails,
          eventDate,
        });

        toast.success(res.data?.msg || "Event updated");
        setEditingEventId(null);
      } else {
        // CREATE
        const res = await API.post("/lawyer/case/event", {
          caseId: selectedCaseId,
          eventTitle,
          eventDetails,
          eventDate,
        });

        toast.success(res.data?.msg || "Event added");
      }

      setEventTitle("");
      setEventDetails("");
      setEventDate("");

      fetchEvents(selectedCaseId);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Operation failed");
    }
  };

  const handleEditClick = (event) => {
    setEditingEventId(event._id);
    setEventTitle(event.eventTitle);
    setEventDetails(event.eventDetails || "");
    setEventDate(event.eventDate?.slice(0, 10));
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setEventTitle("");
    setEventDetails("");
    setEventDate("");
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await API.delete(`/lawyer/case/event/${eventId}`);
      toast.success(res.data?.msg || "Event deleted");
      fetchEvents(selectedCaseId);
    } catch (err) {
      console.log(err);
      toast.error(err?.response?.data?.msg || "Failed to delete event");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-orange-600 px-3 py-1 mb-3">
              <CalendarDays className="h-4 w-4 text-orange-600 mr-2" />
              <span className="text-xs font-medium text-orange-600">CASE EVENTS</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Case Events Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Schedule and manage events for your legal cases
            </p>
          </div>
          
          {/* Stats */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Total Events</p>
              <p className="text-xl font-bold text-gray-900">{events.length}</p>
            </div>
            <div className="border border-gray-200 bg-white px-4 py-2">
              <p className="text-xs text-gray-500">Upcoming</p>
              <p className="text-xl font-bold text-green-600">
                {events.filter(e => isUpcoming(e.eventDate)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Case Selection */}
      <div className="bg-white border border-gray-200 mb-8">
        <div className="border-b border-gray-200 p-5">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Select Case</h2>
          </div>
        </div>

        <div className="p-5">
          {loadingCases ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent animate-spin"></div>
              <p className="text-gray-600">Loading cases...</p>
            </div>
          ) : cases.length === 0 ? (
            <div className="text-center py-4 border border-gray-100">
              <Briefcase className="h-8 w-8 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No cases found. Please add a case first.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 bg-white text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none appearance-none"
                >
                  <option value="">-- Select a case --</option>
                  {cases.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.caseTitle} - {c.clientName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              {selectedCase && (
                <div className="border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500 mb-1">Selected Case Details</p>
                  <p className="text-sm font-medium text-gray-900">{selectedCase?.caseTitle}</p>
                  <p className="text-xs text-gray-600">Client: {selectedCase?.clientName}</p>
                  <p className="text-xs text-gray-600">Type: {selectedCase?.caseType}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {selectedCaseId && (
        <>
          {/* Add/Edit Event Form */}
          <div className="bg-white border border-gray-200 mb-8">
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center space-x-2">
                {editingEventId ? <Edit2 className="h-5 w-5 text-orange-600" /> : <Plus className="h-5 w-5 text-orange-600" />}
                <h2 className="text-lg font-bold text-gray-900">
                  {editingEventId ? "Edit Event" : "Add New Event"}
                </h2>
              </div>
            </div>

            <form onSubmit={handleAddEvent} className="p-5">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                    Event Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Court Hearing, Client Meeting"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Event Details (Optional)
                </label>
                <textarea
                  placeholder="Add detailed information about the event..."
                  value={eventDetails}
                  onChange={(e) => setEventDetails(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center space-x-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-orange-600 text-white font-medium hover:bg-orange-700 flex items-center space-x-2"
                >
                  {editingEventId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  <span>{editingEventId ? "Save Changes" : "Add Event"}</span>
                </button>
                
                {editingEventId && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 flex items-center space-x-2"
                  >
                    <X className="h-4 w-4" />
                    <span>Cancel</span>
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
                  placeholder="Search events by title or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 bg-white text-sm focus:border-orange-600 focus:ring-1 focus:ring-orange-600 focus:outline-none"
                />
              </div>
              
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium text-gray-900">{filteredEvents.length}</span> events
              </div>
            </div>
          </div>

          {/* Events List */}
          <div className="bg-white border border-gray-200">
            <div className="border-b border-gray-200 p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">Events for {selectedCase?.caseTitle}</h2>
                </div>
              </div>
            </div>

            <div className="p-5">
              {loadingEvents ? (
                <div className="text-center py-12 border border-gray-100">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-orange-600 border-t-transparent animate-spin"></div>
                    <p className="text-gray-600">Loading events...</p>
                  </div>
                </div>
              ) : filteredEvents.length === 0 ? (
                <div className="text-center py-12 border border-gray-100">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-2">No events found</p>
                  <p className="text-xs text-gray-400">
                    {searchTerm 
                      ? "Try adjusting your search criteria" 
                      : "Add your first event to get started"}
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredEvents.map((event) => {
                    const upcoming = isUpcoming(event.eventDate);
                    
                    return (
                      <div
                        key={event._id}
                        className={`border ${
                          upcoming ? 'border-green-200' : 'border-gray-200'
                        } hover:border-orange-300 transition-colors`}
                      >
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-3">
                                <div className={`p-2 ${
                                  upcoming ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                                } border`}>
                                  <Calendar className={`h-5 w-5 ${
                                    upcoming ? 'text-green-600' : 'text-gray-600'
                                  }`} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {event.eventTitle}
                                </h3>
                                {upcoming && (
                                  <span className="text-xs bg-green-100 border border-green-200 text-green-700 px-2 py-1">
                                    Upcoming
                                  </span>
                                )}
                              </div>

                              {event.eventDetails && (
                                <p className="text-sm text-gray-600 mb-3 pl-11">
                                  {event.eventDetails}
                                </p>
                              )}

                              <div className="flex items-center space-x-4 pl-11">
                                <div className="flex items-center text-sm text-gray-600">
                                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                  <span>{formatDate(event.eventDate)}</span>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-start space-x-2 ml-4">
                              <button
                                onClick={() => handleEditClick(event)}
                                className="p-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                                title="Edit event"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event._id)}
                                className="p-2 border border-red-300 text-red-600 hover:bg-red-50"
                                title="Delete event"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Quick Tips */}
      {!selectedCaseId && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 mb-1">Getting Started</h3>
              <p className="text-xs text-blue-700">
                Select a case from the dropdown above to view and manage its events. You can add court hearings, client meetings, deadlines, and more.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}