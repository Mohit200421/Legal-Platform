import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { 
  Scale, 
  Briefcase, 
  ArrowRight, 
  CheckCircle,
  Shield,
  Mail,
  User,
  Lock,
  UserCircle
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    const newForm = { ...form, [e.target.name]: e.target.value };
    setForm(newForm);
    
    if (e.target.name === "password") {
      calculatePasswordStrength(e.target.value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await API.post("/auth/register", form);
      alert(res.data?.msg || "Registration successful! OTP sent to email ✅");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (err) {
      alert(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel - Brand Side */}
      <div className="hidden lg:flex lg:w-2/5 bg-gray-900 flex-col justify-between p-12">
        <div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-3">
              <Scale className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">LegalDocs</span>
          </div>
          
          <div className="mt-16">
            <div className="inline-flex items-center bg-blue-600/10 border border-blue-600/20 px-3 py-1 mb-6">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-xs font-medium text-blue-400">SECURE PLATFORM</span>
            </div>
            
            <h1 className="text-4xl font-bold text-white leading-tight">
              Join the future of
              <span className="text-blue-400 block mt-2">legal documentation</span>
            </h1>
            
            <p className="text-gray-400 text-lg mt-6 leading-relaxed">
              Streamline your legal workflow with our comprehensive document management platform.
            </p>
          </div>

          <div className="mt-12 space-y-6">
            {[
              "Secure document storage",
              "Real-time collaboration",
              "E-signature integration",
              "24/7 expert support"
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-700 border-2 border-gray-900 flex items-center justify-center">
                  <span className="text-xs text-gray-400">U{i}</span>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm">
              <span className="text-blue-400 font-semibold">10,000+</span> legal professionals
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Side */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
            <p className="text-gray-600 mt-2">
              Get started with your free account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Smith"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  required
                  placeholder="johnsmith"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-gray-300 text-gray-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              
              {/* Password Strength Meter */}
              {form.password && (
                <div className="mt-3">
                  <div className="flex space-x-1 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 ${
                          level <= passwordStrength
                            ? level === 1
                              ? "bg-red-500"
                              : level === 2
                              ? "bg-yellow-500"
                              : level === 3
                              ? "bg-blue-500"
                              : "bg-green-500"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">
                    {passwordStrength === 0 && "Enter a password"}
                    {passwordStrength === 1 && "Weak password"}
                    {passwordStrength === 2 && "Fair password"}
                    {passwordStrength === 3 && "Good password"}
                    {passwordStrength === 4 && "Strong password"}
                  </p>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 mt-0.5 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2 group"
            >
              {loading ? (
                "Creating account..."
              ) : (
                <>
                  <span>Create account</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Login Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </form>

          {/* Lawyer Portal Section - Matching Login Page Style */}
          <div className="mt-8 border-t border-gray-200 pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-100">
                  <Briefcase className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">
                    Are you a legal professional?
                  </p>
                  <p className="text-sm font-medium text-gray-900">
                    Access Lawyer Portal
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate("/apply-lawyer")}
                className="px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>

          {/* Support Link */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Having trouble?{" "}
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