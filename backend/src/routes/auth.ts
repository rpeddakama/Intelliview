import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Resend } from "resend";
import crypto from "crypto";
import User from "../models/User";
import { authenticateToken } from "../middleware/auth";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();
const resend = new Resend(process.env.RESEND_API_KEY);

const sendVerificationEmail = async (email: string, token: string) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  try {
    await resend.emails.send({
      from: "rishi@intelliview.io",
      to: email,
      subject: "Thanks for signing up to Intelliview! Please verify your email",
      html: `Please click this link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

router.get("/check", authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ message: "Token is valid", user: (req as any).user });
});

// Register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(20).toString("hex");
    const newUser = new User({
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false,
    });
    await newUser.save();

    await sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message:
        "User created successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// Login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (!user.isVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email before logging in" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );
    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET as string,
      { expiresIn: "7d" }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// Logout
router.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// Refresh Token
router.post("/refresh-token", async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as any;
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );
    res.json({ accessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

export const verifyEmail = async (req: Request, res: Response) => {
  console.log("Entering verifyEmail function");
  try {
    const { token } = req.query;
    console.log("Verification token received:", token);

    if (!token || typeof token !== "string") {
      console.log("Invalid token format");
      return res.status(400).json({ message: "Invalid token format" });
    }

    const user = await User.findOne({ verificationToken: token });
    console.log("User found:", user ? user.email : "No user found");

    if (!user) {
      console.log("No user found with the provided token");
      return res
        .status(400)
        .json({ message: "Invalid or expired verification token" });
    }

    if (user.isVerified) {
      console.log(`User ${user.email} is already verified`);
      return res.status(200).json({ message: "Email is already verified" });
    }

    // Update user only if not already verified
    user.isVerified = true;
    //user.verificationToken = null; // Clear the token after successful verification
    await user.save();

    console.log(`User ${user.email} successfully verified`);
    return res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error in email verification:", error);
    return res.status(500).json({ message: "Error verifying email" });
  }
};

// In your routes file:
router.get("/verify-email", verifyEmail);

// Protected route example
router.get("/protected", authenticateToken, (req: Request, res: Response) => {
  res.json({ message: "This is a protected route", user: (req as any).user });
});

export default router;
