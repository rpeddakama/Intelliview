import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/User";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Utility function to generate tokens
const generateTokens = (user: IUser) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" } // Short-lived access token
  );

  const refreshToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" } // Long-lived refresh token
  );

  return { accessToken, refreshToken };
};

// Middleware to authenticate token
const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as jwt.JwtPayload;
    if (decoded.exp && decoded.exp < Date.now() / 1000) {
      console.log("Token expired");
      return res.sendStatus(403);
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      console.log("User not found");
      return res.sendStatus(403);
    }

    (req as any).user = user;
    next();
  } catch (err) {
    console.log("Token verification failed:", err);
    return res.sendStatus(403);
  }
};

// Register endpoint
router.post("/register", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Login endpoint
router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Refresh token endpoint
router.post("/refresh-token", async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string
    ) as jwt.JwtPayload;
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.sendStatus(403);
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" } // Short-lived access token
    );

    res.json({ accessToken });
  } catch (err) {
    console.log("Refresh token verification failed:", err);
    return res.sendStatus(403);
  }
});

// Profile access endpoint
router.get(
  "/profile",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      res.json(user);
    } catch (error) {
      console.error("Profile access error:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
