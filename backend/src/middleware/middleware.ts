import User from "../models/User";

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
