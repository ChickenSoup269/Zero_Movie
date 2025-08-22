import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { v4 as uuidv4 } from "uuid"
import User from "../models/userModel"
import Session from "../models/Auth/sessionModel"
import GuestSession from "../models/Auth/guestsessionModel"

export class AuthService {
  static async register({ username, email, password, fullName }: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  }) {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) throw new Error('Email hoặc username đã tồn tại');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      role: 'user', 
      points: 0,
    });
    await user.save();

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { 
      user: { 
        id: user._id, 
        username, 
        email, 
        fullName, 
        role: user.role,
        avatar: user.avatar, 
        backgroundImage: user.backgroundImage 
      }, 
      accessToken, 
      refreshToken 
    };
  }

  static async login({ email, password }: { email: string; password: string }) {
    const user = await User.findOne({ email }).lean();
    if (!user) throw new Error("Email không đúng")

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error("Mật khẩu không đúng")

     const [accessToken, refreshToken] = await Promise.all([
      jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      }),
      jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, {
        expiresIn: "7d",
      }),
    ]);

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
      },
      accessToken,
      refreshToken,
    }
  }

  static async refreshToken(refreshToken: string) {
    const session = await Session.findOne({ refreshToken })
    if (!session || session.expiresAt < new Date())
      throw new Error("Refresh token không hợp lệ hoặc đã hết hạn")

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string }
    const user = await User.findById(decoded.id)
    if (!user) throw new Error("Không tìm thấy người dùng")

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    )
    return { accessToken }
  }

  static async logout(refreshToken: string) {
    const deletedSession = await Session.findOneAndDelete({ refreshToken })
    if (!deletedSession) throw new Error("Không tìm thấy session để đăng xuất")
  }

  static async createGuestSession() {
    const guestSessionId = uuidv4()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    await GuestSession.create({
      guestSessionId,
      expiresAt,
    })

    return { guestSessionId, expiresAt }
  }

  static async forgotPassword(email: string) {
    const user = await User.findOne({ email })
    if (!user) throw new Error("Không tìm thấy email này")

    const resetCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)

    user.resetPasswordCode = resetCode
    user.resetPasswordExpires = expiresAt
    await user.save()

    console.log("Generated OTP for email:", email, "OTP:", resetCode)

    return { message: "Mã OTP đã được tạo", resetCode }
  }

  static async resetPassword({
    email,
    otp,
    newPassword,
  }: {
    email: string
    otp: string
    newPassword: string
  }) {
    const user = await User.findOne({
      email,
      resetPasswordCode: otp,
      resetPasswordExpires: { $gt: new Date() },
    }).select("+password")

    if (!user) throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn")

    if (newPassword.length < 8) {
      throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    console.log("Resetting password for email:", email)
    console.log("New password (plain):", newPassword)
    console.log("Hashed password:", hashedPassword)

    user.password = hashedPassword
    user.resetPasswordCode = undefined
    user.resetPasswordExpires = undefined
    await user.save()

    console.log(
      "User after save:",
      await User.findOne({ email }).select("+password")
    )

    await Session.deleteMany({ userId: user._id })

    return { message: "Đặt lại mật khẩu thành công" }
  }
}
