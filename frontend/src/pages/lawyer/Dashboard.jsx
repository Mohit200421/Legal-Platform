import { useEffect, useState } from "react";
import API from "../../api/axios";
import { 
  FileText, 
  FolderOpen, 
  Briefcase, 
  Calendar,
  Users,
  Scale,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Shield,
  Gavel,
  BookOpen,
  Star,
  BarChart3
} from "lucide-react";

export default function LawyerDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lawyer/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white border border-gray-200 p-8 text-center">
          <div className="inline-flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent animate-spin"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Articles",
      value: stats?.totalArticles || 0,
      icon: FileText,
      color: "border-blue-500",
      bg: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+12%"
    },
    {
      label: "Total Documents",
      value: stats?.totalDocuments || 0,
      icon: FolderOpen,
      color: "border-green-500",
      bg: "bg-green-50",
      iconColor: "text-green-600",
      trend: "+8%"
    },
    {
      label: "Total Cases",
      value: stats?.totalCases || 0,
      icon: Briefcase,
      color: "border-purple-500",
      bg: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "+15%"
    },
    {
      label: "Active Cases",
      value: stats?.activeCases || 0,
      icon: Gavel,
      color: "border-orange-500",
      bg: "bg-orange-50",
      iconColor: "text-orange-600",
      trend: "+5%"
    }
  ];

  const caseStats = [
    { label: "Active Cases", value: stats?.activeCases || 0, color: "bg-blue-600" },
    { label: "Pending", value: stats?.pendingCases || 0, color: "bg-yellow-500" },
    { label: "Completed", value: stats?.completedCases || 0, color: "bg-green-500" },
    { label: "Urgent", value: stats?.urgentCases || 0, color: "bg-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-purple-600 px-3 py-1 mb-3">
              <Scale className="h-4 w-4 text-purple-600 mr-2" />
              <span className="text-xs font-medium text-purple-600">LAWYER DASHBOARD</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, Adv. {stats?.lawyerName || "Lawyer"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your cases, documents, and legal practice from one central location.
            </p>
          </div>
          
          {/* Period Selector */}
          <div className="hidden md:flex items-center space-x-2 border border-gray-200 bg-white">
            <button
              onClick={() => setSelectedPeriod("week")}
              className={`px-4 py-2 text-sm font-medium ${
                selectedPeriod === "week" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod("month")}
              className={`px-4 py-2 text-sm font-medium ${
                selectedPeriod === "month" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setSelectedPeriod("year")}
              className={`px-4 py-2 text-sm font-medium ${
                selectedPeriod === "year" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              Year
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white border-l-4 ${stat.color} border border-gray-200 p-5`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 ${stat.bg} border ${stat.color}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
                {stat.trend && (
                  <span className="text-xs text-green-600 font-medium">{stat.trend}</span>
                )}
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Case Distribution & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Case Distribution */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Case Distribution</h2>
              </div>
              <select className="px-3 py-1.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none">
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {caseStats.map((stat, index) => (
                <div key={index} className="border border-gray-100 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">{stat.label}</span>
                    <span className="text-xs font-medium text-gray-900">{stat.value}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5">
                    <div 
                      className={`${stat.color} h-1.5`} 
                      style={{ width: `${(stat.value / (stats?.totalCases || 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">{stats?.totalClients || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Total Clients</p>
              </div>
              <div className="border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{stats?.successRate || 0}%</p>
                <p className="text-xs text-gray-500 mt-1">Success Rate</p>
              </div>
            </div>
          </div>

          {/* Recent Cases */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-bold text-gray-900">Recent Cases</h2>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            {stats?.recentCases?.length === 0 ? (
              <div className="text-center py-8 border border-gray-100">
                <Briefcase className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No recent cases</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentCases?.map((caseItem) => (
                  <div
                    key={caseItem._id}
                    className="border border-gray-200 p-4 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">
                          {caseItem.caseTitle}
                        </h4>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {caseItem.clientName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(caseItem.filingDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs border ${
                        caseItem.status === "Active" 
                          ? "border-green-200 bg-green-50 text-green-700"
                          : caseItem.status === "Pending"
                          ? "border-yellow-200 bg-yellow-50 text-yellow-700"
                          : "border-gray-200 bg-gray-50 text-gray-700"
                      }`}>
                        {caseItem.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Upcoming Events & Profile */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-bold text-gray-900">Upcoming Events</h2>
            </div>

            {stats?.upcomingEvents?.length === 0 ? (
              <div className="text-center py-8 border border-gray-100">
                <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.upcomingEvents?.map((event) => (
                  <div
                    key={event._id}
                    className="border-l-4 border-orange-500 border border-gray-200 p-4"
                  >
                    <h4 className="font-bold text-gray-900 mb-2">{event.eventTitle}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-3 w-3 mr-2 text-gray-400" />
                        <span>Case: {event.caseId?.caseTitle || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <User className="h-3 w-3 mr-2 text-gray-400" />
                        <span>Client: {event.caseId?.clientName || "N/A"}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-3 w-3 mr-2 text-gray-400" />
                        <span>{new Date(event.eventDate).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Summary */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Profile Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-purple-100 border border-purple-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-600">
                    {stats?.lawyerName?.charAt(0) || "L"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">Adv. {stats?.lawyerName || "Lawyer"}</p>
                  <p className="text-xs text-gray-500">Bar Council ID: {stats?.barId || "N/A"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{stats?.email || "No email"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{stats?.phone || "No phone"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{stats?.location || "No location"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Experience: {stats?.experience || 0} years</span>
                </div>
              </div>

              {/* Specialization Tags */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Specializations</p>
                <div className="flex flex-wrap gap-2">
                  {stats?.specializations?.map((spec, index) => (
                    <span key={index} className="px-2 py-1 border border-gray-200 bg-gray-50 text-xs">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}