import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserAccount from "../models/authentication/UserAccount";
import Session from "../models/authentication/Session";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const registerService = async (
  email: string,
  password: string,
  username: string
) => {
  const existingUser = await UserAccount.findOne({ email });
  if (existingUser) {
    throw new Error("Email đã tồn tại");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserAccount({
    email,
    password: hashedPassword,
    username,
  });
  await newUser.save();
  return newUser;
};

export const loginService = async (email: string, password: string) => {
  const user = await UserAccount.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Email hoặc mật khẩu không đúng");
  }

  const token = jwt.sign(
    { userId: (user._id as mongoose.Types.ObjectId).toString() },
    JWT_SECRET!,
    {
      expiresIn: "1h",
    }
  );
  const expiresAt = new Date(Date.now() + 3600000);

  const session = new Session({ userId: user._id, token, expiresAt });
  await session.save();
  return { token };
};

export const logoutService = async (token: string) => {
  const deletedSession = await Session.findOneAndDelete({ token });
  if (!deletedSession) {
    throw new Error("Không tìm thấy session để đăng xuất");
  }
};
