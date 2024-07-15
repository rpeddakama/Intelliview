import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import path from "path";
import fs from "fs";

var cors = require("cors");
var cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    connect();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

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
