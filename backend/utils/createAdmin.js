const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const hashed = await bcrypt.hash("Admin@123", 10);

  const admin = await User.create({
    name: "Admin",
    email: "admin@gmail.com",
    username: "admin123",
    passwordHash: hashed,
    role: "admin",
    status: "active"
  });

  console.log("Admin created:", admin);
  process.exit();
}

createAdmin();
