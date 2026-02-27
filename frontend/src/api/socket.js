import { io } from "socket.io-client";

// Connect automatically when imported
const socket = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
  autoConnect: true, // Enable auto connect
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Log connection status
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("Socket connection error:", error);
});

export default socket;
