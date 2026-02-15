const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  try {
    let token = null;

    // ✅ 1) Cookie token
    if (req.cookies?.token) {
      token = req.cookies.token;
    }

    // ✅ 2) Authorization header token (Bearer)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ❌ No token found
    if (!token) {
      return res.status(401).json({ msg: "Not authorized (No token found)" });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Get user from DB
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ msg: "Not authorized (User not found)" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Auth Middleware Error:", err.message);
    return res.status(401).json({ msg: "Session expired / Invalid token" });
  }
};
