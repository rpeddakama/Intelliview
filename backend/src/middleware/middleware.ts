import User from "../models/User";
import rateLimit from "express-rate-limit";
import appConfig from "../config/config";

export const checkAudioSubmissionLimit = async (
  userId: string
): Promise<boolean> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const limit = user.isPremium
    ? appConfig.limits.premiumUser.audioSubmissions
    : appConfig.limits.freeUser.audioSubmissions;

  return user.audioSubmissionsCount < limit;
};

export const checkChatMessageLimit = async (
  userId: string
): Promise<boolean> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const limit = user.isPremium
    ? appConfig.limits.premiumUser.chatMessages
    : appConfig.limits.freeUser.chatMessages;

  return user.totalChatMessagesCount < limit;
};

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
