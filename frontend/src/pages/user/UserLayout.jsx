import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  FolderOpen,
  FileText,
  UserPlus,
  ClipboardList,
  Briefcase,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Shield,
  User,
  Settings,
  HelpCircle
} from "lucide-react";

const UserLayout = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const intervalRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    await logout();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/user/discussion");
      let totalUnread = 0;
      res.data.forEach((d) => {
        const count =
          d?.messages?.filter(
            (m) => m.senderRole === "lawyer" && m.isRead === false
          )?.length || 0;
        totalUnread += count;
      });
      setUnreadCount(totalUnread);
    } catch (err) {
      if (err.response?.status === 401) {
        await logout();
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    intervalRef.current = setInterval(() => {
      fetchUnreadCount();
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const navItems = [
    { to: "/user", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/user/talk-to-lawyer", icon: UserPlus, label: "Talk To Lawyer" },
    { to: "/user/articles", icon: FileText, label: "Legal Articles" },
    { to: "/user/my-requests", icon: ClipboardList, label: "My Requests" },
    {
      to: "/user/discussion",
      icon: MessageSquare,
      label: "Discussions",
      badge: unreadCount,
    },
    { to: "/user/events", icon: Calendar, label: "Events" },
    { to: "/user/documents", icon: FolderOpen, label: "Documents" },
    { to: "/user/jobs", icon: Briefcase, label: "Job Listings" },
  ];

  const quickActions = [
    { label: "Profile Settings", icon: Settings },
    { label: "Help Center", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:relative md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">LegalPortal</span>
          </div>
          <button 
            className="md:hidden text-gray-400 hover:text-white" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-800 flex items-center justify-center">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">User Account</p>
              <p className="text-xs text-gray-400">Client Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
              onClick={() => setIsSidebarOpen(false)}
            >
              <div className="flex items-center space-x-3">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              <div className="flex items-center">
                {item.badge > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 min-w-[20px] text-center">
                    {item.badge}
                  </span>
                )}
                {!item.badge && <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100" />}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-1"
              >
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </button>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 transition-colors mt-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 hover:bg-gray-100 transition-colors mr-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Breadcrumb placeholder */}
            <div className="hidden md:flex items-center text-sm">
              <span className="text-gray-500">User Portal</span>
              <ChevronRight className="h-3 w-3 mx-2 text-gray-400" />
              <span className="text-gray-900 font-medium">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-2 hover:bg-gray-100 transition-colors"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-lg z-50">
                  <div className="p-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                  </div>
                  <div className="p-4 text-center text-sm text-gray-500">
                    {unreadCount > 0 ? (
                      <p>You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}</p>
                    ) : (
                      <p>No new notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-3 border-l border-gray-200 pl-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">User Account</p>
                <p className="text-xs text-gray-500">Client</p>
              </div>
              <div className="w-8 h-8 bg-gray-200 flex items-center justify-center">
                <User className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-3 px-6">
          <p className="text-xs text-gray-500 text-center">
            © {new Date().getFullYear()} LegalPortal. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UserLayout;