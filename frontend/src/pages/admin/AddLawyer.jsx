import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Briefcase,
  MapPin,
  BookOpen,
  FileText,
  Upload,
  X,
  ChevronDown,
  Award,
  Camera,
  Shield,
  AlertCircle,
  CheckCircle,
  Loader2
} from "lucide-react";

export default function AddLawyer() {
  const navigate = useNavigate();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    state: "",
    city: "",
    category: "",
    description: "",
  });

  const [profileImg, setProfileImg] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profilePreview, setProfilePreview] = useState(null);

  /* ================= LOAD INITIAL DATA ================= */

  useEffect(() => {
    fetchStates();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (form.state) {
      fetchCities(form.state);
      setForm((prev) => ({ ...prev, city: "" }));
    }
  }, [form.state]);

  const fetchStates = async () => {
    try {
      const res = await API.get("/admin/master/state");
      setStates(res.data);
    } catch (err) {
      toast.error("Failed to load states");
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const res = await API.get(`/admin/master/city/${stateId}`);
      setCities(res.data);
    } catch (err) {
      toast.error("Failed to load cities");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await API.get("/admin/master/category");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  /* ================= FORM HANDLERS ================= */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const { name, email, phone, experience, state, city, category } = form;

    if (!name || !email || !phone || !experience || !state || !city || !category) {
      toast.error("Please fill all required fields");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        fd.append(key, value);
      });

      if (profileImg) fd.append("profile", profileImg);
      if (documentFile) fd.append("document", documentFile);

      await API.post("/admin/lawyers", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Lawyer added successfully");
      navigate("/admin/lawyers");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.msg || "Failed to add lawyer");
    } finally {
      setLoading(false);
    }
  };

  const clearProfileImage = () => {
    setProfileImg(null);
    setProfilePreview(null);
    document.getElementById("profile-upload").value = "";
  };

  const clearDocument = () => {
    setDocumentFile(null);
    document.getElementById("document-upload").value = "";
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center border border-blue-600 px-3 py-1 mb-3">
              <User className="h-4 w-4 text-blue-600 mr-2" />
              <span className="text-xs font-medium text-blue-600">ADD LAWYER</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Add New Lawyer
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create a new lawyer account and profile
            </p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white border border-gray-200">
        <form onSubmit={handleSubmit}>
          {/* Form Header */}
          <div className="border-b border-gray-200 p-5">
            <h2 className="text-lg font-bold text-gray-900">Basic Information</h2>
            <p className="text-xs text-gray-500 mt-1">All fields marked with * are required</p>
          </div>

          {/* Form Body */}
          <div className="p-5 space-y-6">
            {/* Profile Image Upload */}
            <div className="border border-gray-200 p-5">
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-3">
                Profile Image
              </label>
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 bg-gray-100 border border-gray-300 flex items-center justify-center">
                  {profilePreview ? (
                    <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Camera className="h-8 w-8 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      id="profile-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 px-4 py-2 border border-gray-300 bg-gray-50 text-sm text-gray-500">
                        {profileImg ? profileImg.name : "Choose a profile image..."}
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                  {profileImg && (
                    <button
                      type="button"
                      onClick={clearProfileImage}
                      className="mt-2 text-xs text-red-600 hover:text-red-700 flex items-center"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove image
                    </button>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Recommended: Square image, at least 200x200px</p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="lawyer@example.com"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  Experience (Years) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    name="experience"
                    type="number"
                    value={form.experience}
                    onChange={handleChange}
                    placeholder="Years of practice"
                    min="0"
                    className="w-full pl-9 pr-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Location Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    className="w-full pl-9 pr-8 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none appearance-none"
                  >
                    <option value="">Select State</option>
                    {states.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.stateName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    disabled={!form.state}
                    className="w-full pl-9 pr-8 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none appearance-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {form.state ? "Select City" : "Select State First"}
                    </option>
                    {cities.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.cityName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Specialization Category <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full pl-9 pr-8 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none appearance-none"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-2">
                Description / Bio
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Write a brief description about the lawyer's expertise, experience, and background..."
                rows={4}
                className="w-full px-4 py-2.5 border border-gray-300 bg-white text-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 focus:outline-none resize-none"
              />
            </div>

            {/* Document Upload */}
            <div className="border border-gray-200 p-5">
              <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-3">
                Supporting Document
              </label>
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-100 border border-gray-300 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <input
                      id="document-upload"
                      type="file"
                      onChange={(e) => setDocumentFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 px-4 py-2 border border-gray-300 bg-gray-50 text-sm text-gray-500">
                        {documentFile ? documentFile.name : "Upload document (PDF, DOC, etc.)"}
                      </div>
                      <button
                        type="button"
                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        Browse
                      </button>
                    </div>
                  </div>
                  {documentFile && (
                    <button
                      type="button"
                      onClick={clearDocument}
                      className="mt-2 text-xs text-red-600 hover:text-red-700 flex items-center"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove document
                    </button>
                  )}
                  <p className="text-xs text-gray-400 mt-2">Upload bar council certificate or ID proof</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Footer */}
          <div className="border-t border-gray-200 p-5 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-600">
              <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
              <span>All information will be verified before activation</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => navigate("/admin/lawyers")}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4" />
                    <span>Add Lawyer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}