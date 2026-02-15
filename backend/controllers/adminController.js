const User = require("../models/User");
const City = require("../models/City");
const State = require("../models/State");
const Category = require("../models/Category");
const Lawyer = require("../models/Lawyer");
const Job = require("../models/Job");
const News = require("../models/News");

/* ================= USERS =================== */

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

exports.activateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "active" });
  res.json({ msg: "User activated" });
};

exports.deactivateUser = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, { status: "inactive" });
  res.json({ msg: "User deactivated" });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "User deleted" });
};

/* ================= LAWYERS =================== */

exports.getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find()
      .populate("city", "cityName")
      .populate("state", "stateName")
      .populate("category", "name");

    res.json(lawyers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};





/* ================= CITY =================== */

exports.addCity = async (req, res) => {
  const city = await City.create({ name: req.body.name });
  res.json(city);
};

exports.getCities = async (req, res) => {
  const cities = await City.find();
  res.json(cities);
};

exports.deleteCity = async (req, res) => {
  await City.findByIdAndDelete(req.params.id);
  res.json({ msg: "City deleted" });
};

/* ================= STATE =================== */

exports.addState = async (req, res) => {
  const state = await State.create({ name: req.body.name });
  res.json(state);
};

exports.getStates = async (req, res) => {
  const states = await State.find();
  res.json(states);
};

exports.deleteState = async (req, res) => {
  await State.findByIdAndDelete(req.params.id);
  res.json({ msg: "State deleted" });
};

/* ================= CATEGORY =================== */

exports.addCategory = async (req, res) => {
  const category = await Category.create({ name: req.body.name });
  res.json(category);
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.deleteCategory = async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ msg: "Category deleted" });
};

/* ================= DASHBOARD =================== */

exports.getDashboardCounts = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLawyers = await Lawyer.countDocuments();
    const activeJobs = await Job.countDocuments({ status: "active" });
    const newsPosts = await News.countDocuments();

    res.status(200).json({
      totalUsers,
      totalLawyers,
      activeJobs,
      newsPosts,
    });
  } catch (error) {
    console.error("Dashboard count error:", error);
    res.status(500).json({ msg: "Dashboard count error" });
  }
};

/* ================= LAWYER APPROVAL (USERS TABLE) =================== */

// ✅ Get all pending lawyer users
exports.getPendingLawyerUsers = async (req, res) => {
  try {
    const pendingLawyers = await User.find({
      role: "lawyer",
      lawyerApprovalStatus: "pending",
    }).select("-passwordHash");

    res.json(pendingLawyers);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ✅ Approve lawyer user
exports.approveLawyerUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "Lawyer not found" });

    if (user.role !== "lawyer") {
      return res.status(400).json({ msg: "This user is not a lawyer" });
    }

    user.lawyerApprovalStatus = "approved";
    await user.save();

    res.json({ msg: "Lawyer approved successfully ✅", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ❌ Reject lawyer user
exports.rejectLawyerUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ msg: "Lawyer not found" });

    if (user.role !== "lawyer") {
      return res.status(400).json({ msg: "This user is not a lawyer" });
    }

    user.lawyerApprovalStatus = "rejected";
    await user.save();

    res.json({ msg: "Lawyer rejected ❌", user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};
