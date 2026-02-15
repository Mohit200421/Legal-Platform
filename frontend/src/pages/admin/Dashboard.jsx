import { useEffect, useState } from "react";
import axios from "axios";
import { Users, Scale, Briefcase, Newspaper, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLawyers: 0,
    activeJobs: 0,
    newsPosts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardCounts();
  }, []);

  const fetchDashboardCounts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard-counts`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStats(res.data);
    } catch (error) {
      console.error("Dashboard API error:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: Scale,
      label: "Total Lawyers",
      value: stats.totalLawyers,
      borderColor: "border-blue-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      label: "Total Users",
      value: stats.totalUsers,
      borderColor: "border-green-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: stats.activeJobs,
      borderColor: "border-purple-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: Newspaper,
      label: "News Posts",
      value: stats.newsPosts,
      borderColor: "border-orange-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      to: "/admin/add-lawyer",
      icon: Scale,
      label: "Add New Lawyer",
      desc: "Create a new lawyer account",
    },
    {
      to: "/admin/pending-lawyers",
      icon: Users,
      label: "Pending Lawyers",
      desc: "Review lawyer applications",
    },
    {
      to: "/admin/news",
      icon: Newspaper,
      label: "Manage News",
      desc: "Add or edit news posts",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-gray-200 p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to the Admin Dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white border-l-4 ${stat.borderColor} border border-gray-200 p-5`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 ${stat.bgColor} border ${stat.borderColor}`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              {loading ? (
                <div className="h-8 w-20 bg-gray-200 animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.to}
                className="flex items-center p-4 border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="bg-blue-100 p-3 border border-blue-200 mr-4">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.label}</p>
                  <p className="text-sm text-gray-500">{action.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;