import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserAccount from "../models/authentication/UserAccount";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret-key";

export const getUserProfileService = async (token: string) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  const user = await UserAccount.findById(decoded.userId).select("-password");
  if (!user) {
    throw new Error("Không tìm thấy người dùng");
  }
  return user;
};

export const updateUserProfileService = async (
  token: string,
  username?: string,
  email?: string
) => {
  const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
  const updatedUser = await UserAccount.findByIdAndUpdate(
    decoded.userId,
    { username, email },
    { new: true, runValidators: true }
  ).select("-password");
  if (!updatedUser) {
    throw new Error("Không tìm thấy người dùng để cập nhật");
  }
  return updatedUser;
};
