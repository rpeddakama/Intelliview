import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
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
