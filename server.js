const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

// Handle uncaught exceptions and rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  process.exit(1);
});

// Load environment variables
dotenv.config();

// Debug environment variables
console.log("Environment Variables:", {
  MONGO_URI: process.env.MONGO_URI,
  PORT: process.env.PORT
});

const app = express();
app.use(express.json());
app.use(cors());

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to Bites API!");
});

// MongoDB connection (updated for Mongoose 7+)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000 // Fail fast if no connection
})
.then(() => console.log("MongoDB Connected"))
.catch((err) => {
  console.error("MONGODB CONNECTION FAILED:", err.message);
  process.exit(1);
});

// Connection event listeners
mongoose.connection.on("connecting", () => {
  console.log("🔄 Connecting to MongoDB...");
});

mongoose.connection.on("connected", () => {
  console.log("✅ Successfully connected to MongoDB!");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("🚨 Server Error:", err.stack);
  res.status(500).send("Internal Server Error");
});

// Start server
const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Live at: http://localhost:${PORT}`);
});