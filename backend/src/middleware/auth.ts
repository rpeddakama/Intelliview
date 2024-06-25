import exp from "constants";
import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.sendStatus(403);
    }
    (req as any).user = user;
    next();
  });
};

export default authenticateToken;
