import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/axios";
import {
  Scale,
  User,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  Briefcase,
  MessageSquare,
  Shield,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Award,
  Calendar,
  Hash,
  FileCheck,
  Upload,
  Info
} from "lucide-react";

export default function ApplyLawyer() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    barId: "",
    city: "",
    state: "",
    specialization: "",
    experience: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = "Full name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Email is invalid";
    if (!form.phone) newErrors.phone = "Phone number is required";
    if (!form.barId) newErrors.barId = "Bar Council ID is required";
    if (!form.city) newErrors.city = "City is required";
    if (!form.state) newErrors.state = "State is required";
    if (!form.specialization) newErrors.specialization = "Specialization is required";
    if (!form.experience) newErrors.experience = "Experience is required";
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setLoading(true);
      await API.post("/auth/apply-lawyer", form);

      alert("Your request submitted successfully ✅");
      navigate("/login");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.msg || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const inputFields = [
    { 
      name: "name", 
      label: "Full Name", 
      placeholder: "Enter your full name", 
      icon: User, 
      type: "text",
      colSpan: "col-span-2"
    },
    { 
      name: "email", 
      label: "Email Address", 
      placeholder: "your@email.com", 
      icon: Mail, 
      type: "email",
      colSpan: "col-span-1"
    },
    { 
      name: "phone", 
      label: "Phone Number", 
      placeholder: "+91 98765 43210", 
      icon: Phone, 
      type: "tel",
      colSpan: "col-span-1"
    },
    { 
      name: "barId", 
      label: "Bar Council ID", 
      placeholder: "BCI/12345/2020", 
      icon: Hash, 
      type: "text",
      colSpan: "col-span-2"
    },
    { 
      name: "city", 
      label: "City", 
      placeholder: "Mumbai", 
      icon: MapPin, 
      type: "text",
      colSpan: "col-span-1"
    },
    { 
      name: "state", 
      label: "State", 
      placeholder: "Maharashtra", 
      icon: MapPin, 
      type: "text",
      colSpan: "col-span-1"
    },
    { 
      name: "specialization", 
      label: "Specialization", 
      placeholder: "e.g., Criminal, Civil, Corporate", 
      icon: Briefcase, 
      type: "text",
      colSpan: "col-span-2"
    },
    { 
      name: "experience", 
      label: "Years of Experience", 
      placeholder: "5", 
      icon: Calendar, 
      type: "number",
      colSpan: "col-span-2"
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Panel - Info Side */}
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
              <span className="text-xs font-medium text-blue-400">LAWYER PORTAL</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white leading-tight">
              Join Our Network of
              <span className="text-blue-400 block mt-1">Legal Experts</span>
            </h1>
            
            <p className="text-gray-400 text-sm mt-4 leading-relaxed">
              Become part of India's fastest growing legal platform. Get access to premium clients, case management tools, and a supportive community of legal professionals.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Access to 500+ monthly client queries",
                "Integrated case management system",
                "Verified client leads only",
                "24/7 technical support",
                "Flexible work schedule",
                "Competitive fee structure"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex items-center space-x-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 bg-gray-800 border-2 border-gray-900 flex items-center justify-center">
                  <Award className="h-3 w-3 text-gray-400" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500">
              <span className="text-blue-400 font-semibold">150+</span> lawyers already joined
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form Side */}
      <div className="w-full lg:w-3/5 flex items-start justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-2xl py-8">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back to Home</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-4">
                  <FileCheck className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-xs font-medium text-blue-600">APPLICATION FORM</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Lawyer Registration</h2>
                <p className="text-sm text-gray-600 mt-2">
                  Fill in your details below. Admin will verify and approve your access within 24-48 hours.
                </p>
              </div>
              
              {/* Step Indicator */}
              <div className="border border-gray-200 p-3">
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 mr-2"></div>
                  <span className="text-sm font-medium text-gray-900">Pending Verification</span>
                </div>
              </div>
            </div>
          </div>

          {/* Error Summary */}
          {Object.keys(errors).length > 0 && (
            <div className="border-l-4 border-red-500 bg-red-50 p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <p className="text-sm text-red-700">
                  Please fill in all required fields correctly.
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form Grid */}
            <div className="grid grid-cols-2 gap-4">
              {inputFields.map((field) => (
                <div key={field.name} className={field.colSpan}>
                  <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <field.icon className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
                      errors[field.name] ? 'text-red-400' : 'text-gray-400'
                    }`} />
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={form[field.name]}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-4 py-2.5 text-sm border ${
                        errors[field.name] 
                          ? 'border-red-500 bg-red-50' 
                          : 'border-gray-300 bg-white'
                      } focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600`}
                    />
                  </div>
                  {errors[field.name] && (
                    <p className="text-xs text-red-600 mt-1">{errors[field.name]}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Message Textarea */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Additional Message (Optional)
              </label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  name="message"
                  placeholder="Tell us why you'd like to join our platform, your areas of expertise, or any additional information..."
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-300 bg-white focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>
            </div>

            {/* Document Upload Section (Placeholder) */}
            <div className="border border-gray-200 p-4">
              <div className="flex items-center mb-3">
                <Upload className="h-4 w-4 text-blue-600 mr-2" />
                <h3 className="text-sm font-medium text-gray-900">Supporting Documents</h3>
                <span className="ml-2 text-xs text-gray-500">(Optional)</span>
              </div>
              <p className="text-xs text-gray-500 mb-3">
                You can upload your Bar Council certificate, resume, or other relevant documents after registration.
              </p>
              <button
                type="button"
                className="px-3 py-1.5 text-xs border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => alert("Document upload will be available after registration")}
              >
                Upload Documents
              </button>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                type="checkbox"
                id="terms"
                required
                className="h-4 w-4 mt-0.5 border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600">
                I confirm that the information provided is true and accurate. I agree to the{" "}
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 font-medium hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>

            {/* Info Note */}
            <div className="bg-blue-50 border border-blue-100 p-3">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-blue-600 flex-shrink-0 mt-0.5 mr-2" />
                <p className="text-xs text-blue-700">
                  Your application will be reviewed by our admin team. You'll receive an email confirmation once your account is verified and activated.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Submitting Application..." : "Submit Application"}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-xs text-gray-500">
              Already have a lawyer account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Support Info */}
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-xs text-gray-400">
              Need help with your application?{" "}
              <button className="text-blue-600 hover:underline">
                Contact support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}