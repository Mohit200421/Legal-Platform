import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axios";
import {
  FileText,
  Users,
  Calendar,
  Briefcase,
  FolderOpen,
  Star,
  Search,
  MessageSquare,
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
  Bell,
  BookOpen,
  Award,
  Shield
} from "lucide-react";

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    totalArticles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);
        const res = await API.get("/user/dashboard-stats");
        setStats(res.data);
        
        // Mock recent activity - replace with actual API data when available
        setRecentActivity([
          { id: 1, type: "request", message: "Legal consultation request submitted", time: "2 hours ago", status: "pending" },
          { id: 2, type: "article", message: "New article: 'Understanding IP Rights'", time: "5 hours ago", status: "read" },
          { id: 3, type: "message", message: "Lawyer responded to your query", time: "1 day ago", status: "unread" },
        ]);
      } catch (err) {
        console.log("Dashboard stats API not ready yet");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const quickActions = [
    {
      to: "/user/search-lawyer",
      icon: Search,
      label: "Search Lawyer",
      desc: "Find lawyers by specialization & city",
      color: "border-blue-500",
      bg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      to: "/user/talk-to-lawyer",
      icon: MessageSquare,
      label: "Talk to Lawyer",
      desc: "Start a consultation request",
      color: "border-green-500",
      bg: "bg-green-50",
      iconColor: "text-green-600"
    },
    {
      to: "/user/articles",
      icon: BookOpen,
      label: "Legal Articles",
      desc: "Latest legal articles & updates",
      color: "border-purple-500",
      bg: "bg-purple-50",
      iconColor: "text-purple-600"
    },
    {
      to: "/user/events",
      icon: Calendar,
      label: "Events",
      desc: "Legal events & seminars",
      color: "border-orange-500",
      bg: "bg-orange-50",
      iconColor: "text-orange-600"
    },
    {
      to: "/user/jobs",
      icon: Briefcase,
      label: "Jobs",
      desc: "Explore law internships & jobs",
      color: "border-teal-500",
      bg: "bg-teal-50",
      iconColor: "text-teal-600"
    },
    {
      to: "/user/documents",
      icon: FolderOpen,
      label: "Documents",
      desc: "View uploaded legal documents",
      color: "border-indigo-500",
      bg: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
  ];

  const statCards = [
    { 
      label: "Total Requests", 
      value: stats.totalRequests, 
      icon: FileText, 
      color: "border-blue-500",
      textColor: "text-blue-600"
    },
    { 
      label: "Pending", 
      value: stats.pendingRequests, 
      icon: Clock, 
      color: "border-yellow-500",
      textColor: "text-yellow-600"
    },
    { 
      label: "Accepted", 
      value: stats.acceptedRequests, 
      icon: CheckCircle, 
      color: "border-green-500",
      textColor: "text-green-600"
    },
    { 
      label: "Articles", 
      value: stats.totalArticles, 
      icon: BookOpen, 
      color: "border-purple-500",
      textColor: "text-purple-600"
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-3">
              <Scale className="h-3 w-3 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-blue-600">USER DASHBOARD</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0] || "User"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your legal requests, read articles, and explore services.
            </p>
          </div>
          
          {/* User Quick Info */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name || "User"}</p>
              <p className="text-xs text-gray-500">{user?.email || "No email"}</p>
            </div>
            <div className="w-10 h-10 bg-gray-200 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className={`bg-white border-l-4 ${stat.color} border border-gray-200 p-5`}>
              <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${stat.textColor}`} />
                <span className={`text-xs font-medium ${stat.textColor}`}>
                  {loading ? "..." : stat.value}
                </span>
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? "..." : stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Grid */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.to}
                    className={`group border ${action.color} ${action.bg} p-4 hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 bg-white border ${action.color}`}>
                        <Icon className={`h-4 w-4 ${action.iconColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">
                          {action.label}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{action.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <Bell className="h-5 w-5 text-gray-400" />
            </div>
            
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 border-b border-gray-100 pb-3 last:border-0">
                  <div className={`w-2 h-2 mt-2 ${
                    activity.status === 'unread' ? 'bg-blue-600' : 
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                  {activity.status === 'unread' && (
                    <span className="text-xs bg-blue-600 text-white px-2 py-1">New</span>
                  )}
                </div>
              ))}
            </div>
            
            <button className="mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
              View all activity
              <ArrowRight className="h-3 w-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Right Column - Profile & Tips */}
        <div className="space-y-6">
          {/* Account Info Card */}
          <div className="bg-white border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Account Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-gray-200 flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{user?.name || "User"}</p>
                  <p className="text-xs text-gray-500">Member since 2024</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">{user?.email || "No email"}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">
                    Role: <span className="font-medium capitalize text-blue-600">{user?.role || "user"}</span>
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <Award className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Verified Account</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tip Card */}
          <div className="bg-blue-50 border-l-4 border-blue-600 p-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-blue-900 mb-2">Pro Tip</h3>
                <p className="text-xs text-blue-700 leading-relaxed">
                  Keep your request details clear and specific. Include relevant documents and deadlines to help lawyers respond faster.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white border border-gray-200 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Requests</span>
                <span className="text-sm font-bold text-gray-900">{stats.totalRequests || 0}</span>
              </div>
              <div className="w-full bg-gray-200 h-1">
                <div className="bg-blue-600 h-1" style={{ width: `${Math.min((stats.acceptedRequests / (stats.totalRequests || 1)) * 100, 100)}%` }}></div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Accepted: {stats.acceptedRequests || 0}</span>
                <span>Pending: {stats.pendingRequests || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}