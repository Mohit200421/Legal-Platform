import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useContext } from "react";
import API from "../../api/axios";
import { AuthContext } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  LayoutDashboard,
  Users,
  Scale,
  FileText,
  Calendar,
  Briefcase,
  Newspaper,
  Database,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  Shield,
  Settings,
  HelpCircle,
  Sun,
  Moon
} from "lucide-react";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const [pendingCount, setPendingCount] = useState(0);
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

  const fetchPendingCount = async () => {
    try {
      const res = await API.get("/admin/pending-lawyers");
      setPendingCount(res.data?.length || 0);
    } catch (err) {
      if (err.response?.status === 401) {
        await logout();
        navigate("/login", { replace: true });
      }
    }
  };

  useEffect(() => {
    fetchPendingCount();
    intervalRef.current = setInterval(() => {
      fetchPendingCount();
    }, 15000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const navItems = [
    { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      to: "/admin/pending-lawyers",
      icon: Scale,
      label: "Pending Lawyers",
      badge: pendingCount,
    },
    { to: "/admin/add-lawyer", icon: Users, label: "Add Lawyer" },
    { to: "/admin/lawyers", icon: Scale, label: "Manage Lawyers" },
    { to: "/admin/users", icon: Users, label: "Manage Users" },
  //  { to: "/admin/jobs", icon: Briefcase, label: "Manage Jobs" },
    //{ to: "/admin/events", icon: Calendar, label: "Manage Events" },
    //{ to: "/admin/news", icon: Newspaper, label: "Manage News" },
    //{ to: "/admin/master", icon: Database, label: "Master Data" },
  ];

  const quickActions = [
    { label: "Settings", icon: Settings },
    { label: "Help", icon: HelpCircle },
  ];

  return (
    <div className={`min-h-screen flex overflow-hidden ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Sidebar - Fixed */}
      <aside
        className={`
          fixed md:fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
          ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-900 text-white'}
        `}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className={`flex-shrink-0 h-16 flex items-center justify-between px-4 border-b ${
            darkMode ? 'border-gray-800' : 'border-gray-800'
          }`}>
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 p-1.5">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">Admin Panel</span>
            </div>
            <button 
              className="md:hidden text-gray-400 hover:text-white" 
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation - Scrollable if needed */}
          <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1 scrollbar-hide">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : `text-gray-300 hover:bg-gray-800 hover:text-white`
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
          <div className={`flex-shrink-0 p-4 border-t ${
            darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-800 bg-gray-900'
          }`}>
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
        <header className={`flex-shrink-0 border-b h-16 flex items-center justify-between px-4 md:px-6 sticky top-0 z-30 ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center">
            <button
              className={`md:hidden p-2 hover:bg-gray-100 transition-colors mr-2 ${
                darkMode ? 'hover:bg-gray-800' : ''
              }`}
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            
            {/* Breadcrumb */}
            <div className="hidden md:flex items-center text-sm">
              <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Admin Portal</span>
              <ChevronRight className={`h-3 w-3 mx-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
              <span className={darkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'}>Dashboard</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleDarkMode}
              className={`p-2 border transition-colors ${
                darkMode 
                  ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' 
                  : 'border-gray-200 bg-white hover:bg-gray-50'
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700" />
              )}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                className={`relative p-2 transition-colors border ${
                  darkMode 
                    ? 'border-gray-700 hover:bg-gray-800' 
                    : 'border-gray-200 hover:bg-gray-100'
                }`}
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className={`h-5 w-5 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center border-2 border-white">
                    {pendingCount > 9 ? '9+' : pendingCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className={`absolute right-0 mt-2 w-80 border shadow-lg z-50 ${
                  darkMode 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-white border-gray-200'
                }`}>
                  <div className={`p-3 border-b ${
                    darkMode ? 'border-gray-800' : 'border-gray-200'
                  }`}>
                    <h3 className={`text-sm font-semibold ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>Notifications</h3>
                  </div>
                  <div className={`p-4 text-center text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {pendingCount > 0 ? (
                      <div>
                        <p className="mb-2">You have {pendingCount} pending lawyer {pendingCount === 1 ? 'application' : 'applications'}</p>
                        <button 
                          onClick={() => {
                            navigate("/admin/pending-lawyers");
                            setShowNotifications(false);
                          }}
                          className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                        >
                          View pending applications
                        </button>
                      </div>
                    ) : (
                      <p>No new notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content - Scrollable */}
        <main className={`flex-1 overflow-y-auto ${
          darkMode ? 'bg-gray-900' : 'bg-gray-50'
        }`}>
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>

        {/* Footer - Fixed at bottom */}
        <footer className={`flex-shrink-0 border-t py-3 px-6 ${
          darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center justify-between text-xs ${
            darkMode ? 'text-gray-500' : 'text-gray-500'
          }">
            <p>© {new Date().getFullYear()} LegalCompliance. All rights reserved.</p>
            <div className="flex items-center space-x-4">
              <span className={`cursor-pointer ${
                darkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'
              }`}>Privacy Policy</span>
              <span className={`cursor-pointer ${
                darkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'
              }`}>Terms of Service</span>
              <span className={`cursor-pointer ${
                darkMode ? 'hover:text-gray-300' : 'hover:text-gray-700'
              }`}>Help</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;