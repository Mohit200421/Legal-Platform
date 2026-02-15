import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  MessageSquare,
  Briefcase,
  Calendar,
  ClipboardList,
  LogOut,
  Menu,
  X,
  Bell,
  Scale,
  ChevronRight,
  User,
  Settings,
  HelpCircle,
  Shield,
  Gavel
} from "lucide-react";

const LawyerLayout = () => {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const intervalRef = useRef(null);

  const handleLogout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.log("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const res = await API.get("/lawyer/discussion");
      let totalUnread = 0;
      res.data.forEach((d) => {
        const count =
          d?.messages?.filter(
            (m) => m.senderRole === "user" && m.isRead === false
          )?.length || 0;
        totalUnread += count;
      });
      setUnreadCount(totalUnread);
    } catch (err) {
      console.log("Unread count fetch failed:", err);
      if (err.response?.status === 401) {
        setUser(null);
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    intervalRef.current = setInterval(() => {
      fetchUnreadCount();
    }, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const navItems = [
    { to: "/lawyer", icon: LayoutDashboard, label: "Dashboard", end: true },
    { to: "/lawyer/articles", icon: FileText, label: "Manage Articles" },
    { to: "/lawyer/documents", icon: FolderOpen, label: "Documents" },
    {
      to: "/lawyer/discussion",
      icon: MessageSquare,
      label: "Discussions",
      badge: unreadCount,
    },
    { to: "/lawyer/cases", icon: Briefcase, label: "Cases" },
    { to: "/lawyer/case-events", icon: Calendar, label: "Case Events" },
    { to: "/lawyer/requests", icon: ClipboardList, label: "Requests" },
  ];

  const quickActions = [
    { label: "Profile Settings", icon: Settings },
    { label: "Help Center", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar - Fixed on desktop, overlay on mobile */}
      <aside
        className={`
          fixed md:fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header - Fixed */}
          <div className="flex-shrink-0 h-16 flex items-center justify-between px-4 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5">
                <Scale className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">LegalCompliance</span>
            </div>
            <button 
              className="md:hidden text-gray-400 hover:text-white" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Lawyer Info - Fixed */}
          <div className="flex-shrink-0 p-4 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-600 flex items-center justify-center flex-shrink-0">
                <Gavel className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">Adv. {user?.name || "Lawyer"}</p>
                <p className="text-xs text-gray-400 truncate">Legal Professional</p>
              </div>
            </div>
          </div>

          {/* Navigation - Scrollable if needed */}
          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
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
                <div className="flex items-center space-x-3 min-w-0">
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
                <div className="flex items-center flex-shrink-0">
                  {item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 min-w-[20px] text-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
              </NavLink>
            ))}
          </nav>

          {/* Quick Actions - Fixed at bottom */}
          <div className="flex-shrink-0 p-4 border-t border-gray-800 bg-gray-900">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors mb-1"
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{action.label}</span>
                </button>
              );
            })}
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-2.5 text-sm text-white bg-red-600 hover:bg-red-700 transition-colors mt-2"
            >
              <LogOut className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content - With fixed header and footer */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64">
        {/* Header - Fixed at top */}
        <header className="flex-shrink-0 bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
          <div className="flex items-center">
            <button
              className="md:hidden p-2 hover:bg-gray-100 transition-colors mr-2"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 text-gray-600" />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center text-sm">
              <span className="text-gray-500">Lawyer Portal</span>
              <ChevronRight className="h-3 w-3 mx-2 text-gray-400" />
              <span className="text-gray-900 font-medium">Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <div className="relative">
              <button 
                className="relative p-2 hover:bg-gray-100 transition-colors border border-gray-200"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center border-2 border-white">
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
                      <div>
                        <p className="mb-2">You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}</p>
                        <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
                          View all messages
                        </button>
                      </div>
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
                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">Adv. {user?.name || "Lawyer"}</p>
                <p className="text-xs text-gray-500 truncate max-w-[200px]">Bar Council ID: {user?.barId || "N/A"}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 border border-purple-200 flex items-center justify-center flex-shrink-0">
                <Shield className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer - Fixed at bottom */}
        <footer className="flex-shrink-0 bg-white border-t border-gray-200 py-3 px-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <p>© {new Date().getFullYear()} LegalCompliance. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span className="cursor-pointer hover:text-gray-700">Privacy Policy</span>
              <span className="cursor-pointer hover:text-gray-700">Terms of Service</span>
              <span className="cursor-pointer hover:text-gray-700">Help</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LawyerLayout;