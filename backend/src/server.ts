// backend/src/server.ts
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import uploadRoutes from "./routes/upload";
var cors = require("cors");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

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
app.use("/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const connect = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
