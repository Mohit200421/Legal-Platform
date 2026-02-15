require("dotenv").config();
require("./cron/eventReminder");

const express = require("express");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const userArticleRoutes = require("./routes/userArticleRoutes");

const app = express();

/* =========================
   ✅ LOCALHOST CORS ONLY
   ========================= */
const LOCAL_ORIGIN = "http://localhost:5173";

// ✅ Request logger (debug)
app.use((req, res, next) => {
  console.log("➡️", req.method, req.url);
  next();
});

app.use(
  cors({
    origin: LOCAL_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// ✅ handle preflight
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect DB
connectDB();

// Test route
app.get("/", (req, res) => {
  res.send("Backend running...");
});

// Routes
app.use("/api/user", userArticleRoutes);

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/admin/lawyers", require("./routes/adminLawyerRoutes"));
app.use("/api/admin/master", require("./routes/adminMasterRoutes"));

app.use("/api/lawyer", require("./routes/lawyerRoutes"));
app.use("/api/user", require("./routes/userRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/ocr", require("./routes/ocrRoutes"));

app.use("/api/master", require("./routes/masterRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));

// Chat Message APIs
app.use("/api/messages", require("./routes/messageRoutes"));

/* =========================
   ✅ ERROR LOGGER
   ========================= */
app.use((err, req, res, next) => {
  console.error("🔥 ERROR:", err.message);
  next(err);
});

// Error handler
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

/* =========================
   ✅ SOCKET.IO (LOCALHOST)
   ========================= */
const io = new Server(server, {
  cors: {
    origin: LOCAL_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("joinRoom", (userId) => {
    if (!userId) return;
    socket.join(userId);
    console.log("👤 Joined room:", userId);
  });

  socket.on("sendMessage", (data) => {
    if (!data?.receiverId) return;
    io.to(data.receiverId).emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
