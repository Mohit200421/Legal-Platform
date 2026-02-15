import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { 
  Scale, 
  Eye, 
  EyeOff, 
  Sun, 
  Moon, 
  Mail, 
  Lock,
  Briefcase,
  ArrowRight,
  Shield,
  AlertCircle
} from "lucide-react";

export default function Login() {
  const { login } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");

    try {
      const res = await API.post("/auth/login", { email, password });
      const { user } = res.data;
      await login();

      if (user.role === "admin") navigate("/admin");
      else if (user.role === "lawyer") navigate("/lawyer");
      else navigate("/user");
    } catch (error) {
      const msg = error.response?.data?.msg || "Invalid email or password";

      if (msg.toLowerCase().includes("verify your email")) {
        alert("Please verify your email first ✅");
        navigate("/verify-otp", { state: { email } });
      } else {
        setErr(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      
      {/* Left Panel - Brand Side */}
      <div className={`hidden lg:flex lg:w-2/5 flex-col justify-between p-12 ${
        darkMode ? 'bg-gray-950' : 'bg-gray-900'
      }`}>
        <div>
          {/* Theme Toggle in Left Panel */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2.5">
                <Scale className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">LegalCompliance</span>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2 bg-gray-800 hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-300" />
              )}
            </button>
          </div>
          
          <div className="mt-16">
            <div className="inline-flex items-center bg-blue-600/10 border border-blue-600/20 px-3 py-1 mb-6">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-xs font-medium text-blue-400">SECURE PLATFORM</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white leading-tight">
              Welcome Back to
              <span className="text-blue-400 block mt-1">Legal Compliance</span>
            </h1>
            
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              Access your dashboard, manage documents, and streamline your legal workflow with our enterprise-grade platform.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "256-bit encryption",
                "Role-based access control",
                "Audit trail & compliance",
                "24/7 secure access"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-1.5 h-1.5 bg-blue-400"></div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-800 border-2 border-gray-900 flex items-center justify-center">
                  <span className="text-xs text-gray-400">U{i}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              <span className="text-blue-400 font-semibold">2,500+</span> active users
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Side */}
      <div className={`w-full lg:w-3/5 flex items-center justify-center p-6 ${
        darkMode ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2">
                  <Scale className="h-5 w-5 text-white" />
                </div>
                <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  LegalCompliance
                </span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`p-2 border ${
                  darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                }`}
              >
                {darkMode ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-gray-700" />
                )}
              </button>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Sign in to your account
            </h2>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Enter your credentials to access your dashboard
            </p>
          </div>

          {/* Error Alert */}
          {err && (
            <div className="border-l-4 border-red-500 bg-red-50 dark:bg-red-500/10 p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-sm text-red-700 dark:text-red-400">{err}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className={`block text-xs font-medium uppercase tracking-wider mb-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type="email"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border focus:outline-none focus:ring-1 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={`block text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-400' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className={`text-xs font-medium ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`w-full pl-10 pr-12 py-3 border focus:outline-none focus:ring-1 ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500' 
                      : 'bg-white border-gray-300 text-gray-900 focus:border-blue-600 focus:ring-blue-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 ${
                    darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="remember" className={`ml-2 text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <span>Sign in</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Register Link */}
            <div className="text-center pt-4">
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className={`font-medium ${
                    darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                  }`}
                >
                  Create account
                </Link>
              </p>
            </div>
          </form>

          {/* Lawyer Portal Link */}
          <div className={`mt-8 border-t pt-6 ${
            darkMode ? 'border-gray-800' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-100'
                }`}>
                  <Briefcase className={`h-4 w-4 ${
                    darkMode ? 'text-gray-300' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Are you a legal professional?
                  </p>
                  <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Access Lawyer Portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/apply-lawyer")}
                className={`px-4 py-2 text-sm font-medium border ${
                  darkMode 
                    ? 'border-gray-700 text-gray-300 hover:bg-gray-800' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                } transition-colors`}
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Support Link */}
          <p className={`text-center text-xs mt-6 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Having trouble signing in?{" "}
            <button className="text-blue-600 hover:underline">
              Contact support
            </button>
          </p>
        </div>
      </div>

      {/* Mobile Lawyer Button */}
      <button
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-3 text-sm font-medium hover:bg-blue-700 transition shadow-lg lg:hidden flex items-center space-x-2"
        onClick={() => navigate("/apply-lawyer")}
      >
        <Briefcase className="h-4 w-4" />
        <span>Lawyer Portal</span>
      </button>
    </div>
  );
}