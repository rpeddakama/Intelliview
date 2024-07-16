import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiRoutes from "./routes/api";
import authRoutes from "./routes/auth";
import stripeRoutes from "./routes/stripe";
import path from "path";
import fs from "fs";
var cors = require("cors");
var cookieParser = require("cookie-parser");

dotenv.config();

const app = express();

// Raw body parsing for Stripe webhook
app.use("/stripe/stripe-webhook", express.raw({ type: "application/json" }));

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Mount routes
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/stripe", stripeRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");
    connect();
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

const connect = () => {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
