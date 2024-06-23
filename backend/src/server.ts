// backend/src/server.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import path from "path";
import fs from "fs";

var cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from the uploads directory
app.use("/uploads", express.static(uploadsDir));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    connect();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const connect = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
