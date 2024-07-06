import User from "../models/User";
import rateLimit from "express-rate-limit";

export const checkAudioSubmissionLimit = async (
  userId: string
): Promise<boolean> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  return user.audioSubmissionsCount < 3;
};

export const checkChatMessageLimit = async (
  userId: string
): Promise<boolean> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  return user.totalChatMessagesCount < 10;
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
