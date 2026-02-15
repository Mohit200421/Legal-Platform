import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axios";
import { 
  Scale, 
  ArrowLeft, 
  KeyRound,
  Mail,
  Lock,
  Shield,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Clock
} from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!email) {
      setMsg({ type: "error", text: "Email is required" });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      setMsg({ type: "success", text: res.data?.msg || "Reset OTP sent to email" });
      setStep(2);
      startTimer();
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "Failed to send OTP" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setMsg({ type: "", text: "" });

    try {
      setLoading(true);
      const res = await API.post("/auth/forgot-password", { email });
      setMsg({ type: "success", text: res.data?.msg || "New OTP sent to email" });
      startTimer();
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "Failed to resend OTP" 
      });
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const otpString = otp.join("");
    
    if (!email || otpString.length !== 6) {
      setMsg({ type: "error", text: "Email and valid 6-digit OTP are required" });
      return;
    }

    if (!newPassword) {
      setMsg({ type: "error", text: "New password is required" });
      return;
    }

    if (newPassword.length < 8) {
      setMsg({ type: "error", text: "Password must be at least 8 characters" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/reset-password", {
        email,
        otp: otpString,
        newPassword,
      });

      setMsg({ type: "success", text: res.data?.msg || "Password reset successfully" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "Failed to reset password" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Security Info */}
      <div className="hidden lg:flex lg:w-2/5 bg-gray-900 flex-col justify-between p-12">
        <div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2.5">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LegalCompliance</span>
          </div>
          
          <div className="mt-12">
            <div className="inline-flex items-center border border-blue-500 bg-blue-500/10 px-3 py-1 mb-6">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-xs font-medium text-blue-400">SECURE RESET</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white leading-tight">
              Reset Your
              <span className="text-blue-400 block mt-1">Password</span>
            </h1>
            
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              Forgot your password? No worries. Follow the simple steps below to securely reset your password and regain access to your account.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Step 1: Enter your registered email",
                "Step 2: Check inbox for 6-digit OTP",
                "Step 3: Set a new strong password",
                "OTP expires in 10 minutes"
              ].map((step, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-800 flex items-center justify-center">
              <KeyRound className="h-4 w-4 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500">
              Password reset links are valid for 10 minutes only
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Side */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Login</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-4">
              <KeyRound className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-blue-600">PASSWORD RESET</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              {step === 1 ? "Forgot Password?" : "Reset Password"}
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              {step === 1
                ? "Enter your email address and we'll send you a verification code."
                : "Enter the 6-digit code sent to your email and set a new password."}
            </p>
          </div>

          {/* Message Alert */}
          {msg.text && (
            <div className={`border-l-4 p-4 mb-6 ${
              msg.type === "success" 
                ? "bg-green-50 border-green-500" 
                : "bg-red-50 border-red-500"
            }`}>
              <div className="flex items-center">
                {msg.type === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                )}
                <p className={`text-sm ${
                  msg.type === "success" ? "text-green-700" : "text-red-700"
                }`}>
                  {msg.text}
                </p>
              </div>
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </form>
          )}

          {/* Step 2: Reset Password Form */}
          {step === 2 && (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Verification Code
                </label>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-500">
                    Enter the 6-digit code sent to {email}
                  </p>
                  {!canResend && timer > 0 && (
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{String(Math.floor(timer / 60)).padStart(2, '0')}:{String(timer % 60).padStart(2, '0')}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-12 text-center border border-gray-300 bg-white text-gray-900 text-lg font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                      autoFocus={index === 0}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Minimum 8 characters with at least one number
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 bg-white text-gray-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
                
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={loading || !canResend}
                  className="px-4 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  title="Resend OTP"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                ← Back to email entry
              </button>
            </form>
          )}

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Remember your password?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Support Link */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Having trouble? <button className="text-blue-600 hover:underline">Contact support</button>
          </p>
        </div>
      </div>
    </div>
  );
}