import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { 
  Scale, 
  Mail, 
  Lock, 
  Shield, 
  Clock, 
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialEmail = location?.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
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

  const handleVerify = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    const otpString = otp.join("");
    
    if (!email || otpString.length !== 6) {
      return setMsg({ 
        type: "error", 
        text: "Email and valid 6-digit OTP are required" 
      });
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/verify-otp", { email, otp: otpString });

      setMsg({ 
        type: "success", 
        text: res.data?.msg || "Email verified successfully!" 
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "OTP verification failed" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setMsg({ type: "", text: "" });

    if (!email) {
      return setMsg({ 
        type: "error", 
        text: "Please enter your email first" 
      });
    }

    try {
      setResending(true);
      const res = await API.post("/auth/resend-otp", { email });
      setMsg({ 
        type: "success", 
        text: res.data?.msg || "New OTP sent successfully!" 
      });
      setTimer(60);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      setMsg({ 
        type: "error", 
        text: err.response?.data?.msg || "Failed to resend OTP" 
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Verification Info */}
      <div className="hidden lg:flex lg:w-2/5 bg-gray-900 flex-col justify-between p-12">
        <div>
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 p-2.5">
              <Scale className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LegalDocs</span>
          </div>
          
          <div className="mt-16">
            <div className="inline-flex items-center bg-blue-500/10 border border-blue-500/20 px-3 py-1 mb-6">
              <Shield className="h-4 w-4 text-blue-400 mr-2" />
              <span className="text-xs font-medium text-blue-400">SECURE VERIFICATION</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white leading-tight">
              Two-Step
              <span className="text-blue-400 block mt-1">Verification</span>
            </h1>
            
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              To protect your account security, we've sent a one-time password to your email address. Please enter the code to continue.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Code expires in 10 minutes",
                "Check your spam folder",
                "Never share this code"
              ].map((tip, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle2 className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{tip}</span>
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
              Verification code is required for every new device login
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Verification Form */}
      <div className="w-full lg:w-3/5 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 mb-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Check your inbox</h2>
            <p className="text-gray-600 text-sm mt-2">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-gray-900 font-medium mt-1">{email || "your email"}</p>
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
                  <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
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

          <form onSubmit={handleVerify}>
            {/* Email Input */}
            <div className="mb-6">
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 text-gray-900 text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                />
              </div>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Verification Code
                </label>
                {!canResend && timer > 0 && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
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
                    className="w-12 h-12 text-center bg-white border border-gray-300 text-gray-900 text-lg font-semibold focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                    autoFocus={index === 0}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter the 6-digit code sent to your email
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || otp.join("").length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors mb-3"
            >
              {loading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          {/* Resend Section */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResend}
                disabled={resending || !canResend}
                className="text-blue-600 font-medium hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {resending ? "Sending..." : "Click to resend"}
              </button>
            </div>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Back to{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

          {/* Help Text */}
          <p className="text-center text-xs text-gray-500 mt-8">
            Having trouble? <button className="text-blue-600 hover:underline">Contact support</button>
          </p>
        </div>
      </div>
    </div>
  );
}