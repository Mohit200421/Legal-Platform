import { Link, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Menu, X, Scale, Sun, Moon, User } from "lucide-react";

function Navbar() {
  const { user, logout, loading } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading) return null;

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              LegalCompliance
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
            >
              About
            </Link>

            {/* Desktop Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>

            {!user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <User className="h-4 w-4 inline mr-1" />
                  {user.name || user.username}
                </span>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "lawyer" && (
                  <Link
                    to="/lawyer"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "user" && (
                  <Link
                    to="/user"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-3 pt-4">
              {/* Mobile Menu Items */}
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              
              <Link
                to="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>

              {/* Mobile Theme Toggle - Inside Menu */}
              <button
                onClick={() => {
                  toggleDarkMode();
                  // Don't close menu when toggling theme
                }}
                className="flex items-center justify-between w-full text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <span>Theme</span>
                <div className="flex items-center">
                  {darkMode ? (
                    <>
                      <Sun className="h-5 w-5 text-yellow-500 mr-2" />
                      <span className="text-sm">Light</span>
                    </>
                  ) : (
                    <>
                      <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300 mr-2" />
                      <span className="text-sm">Dark</span>
                    </>
                  )}
                </div>
              </button>

              {!user ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition px-2 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition mx-2 text-center"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <div className="flex flex-col space-y-3 px-2">
                  <div className="text-sm text-gray-600 dark:text-gray-400 py-2 border-b border-gray-200 dark:border-gray-700">
                    <User className="h-4 w-4 inline mr-2" />
                    {user.name || user.username} ({user.role})
                  </div>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === "lawyer" && (
                    <Link
                      to="/lawyer"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === "user" && (
                    <Link
                      to="/user"
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg px-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition text-left w-full"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;