import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

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
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decoded.exp < Date.now() / 1000) {
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

export default authenticateToken;
