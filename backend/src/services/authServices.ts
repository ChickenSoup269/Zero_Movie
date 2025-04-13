import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/userModel';
import Session from '../models/Auth/sessionModel';
import GuestSession from '../models/Auth/guestsessionModel';
import nodemailer from 'nodemailer';

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

    return { user: { id: user._id, username, email, fullName, role: user.role }, accessToken, refreshToken };
  }

  static async login({ email, password }: { email: string; password: string }) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Email không đúng');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Mật khẩu không đúng');

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });

    await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { user: { 
      id: user._id, 
      username: user.username, 
      email: user.email, 
      fullName: user.fullName, 
      role: user.role,
      avatar: user.avatar, 
      backgroundImage: user.backgroundImage 
    }, accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string) {
    const session = await Session.findOne({ refreshToken });
    if (!session || session.expiresAt < new Date()) throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('Không tìm thấy người dùng');

    const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return { accessToken };
  }

  static async logout(refreshToken: string) {
    const deletedSession = await Session.findOneAndDelete({ refreshToken });
    if (!deletedSession) throw new Error('Không tìm thấy session để đăng xuất');
  }

  static async createGuestSession() {
    const guestSessionId = uuidv4();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await GuestSession.create({
      guestSessionId,
      expiresAt,
    });

    return { guestSessionId, expiresAt };
  }
  static async forgotPassword(email: string) {
    const user = await User.findOne({ email });
    if (!user) throw new Error('Không tìm thấy email này');

    // Tạo mã ngẫu nhiên 6 chữ số
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // Hết hạn sau 10 phút

    // Lưu mã và thời gian hết hạn vào user
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    // Gửi email bằng nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Mã đặt lại mật khẩu',
      text: `Mã đặt lại mật khẩu của bạn là: ${resetCode}. Mã này hết hạn sau 10 phút.`,
    };

    await transporter.sendMail(mailOptions);

    return { message: 'Mã đặt lại mật khẩu đã được gửi tới email của bạn' };
  }
  static async resetPassword(code: string, newPassword: string) {
    const user = await User.findOne({
      resetPasswordCode: code,
      resetPasswordExpires: { $gt: new Date() }, // Mã chưa hết hạn
    });

    if (!user) throw new Error('Mã không hợp lệ hoặc đã hết hạn');

    // Cập nhật mật khẩu mới
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordCode = undefined; // Xóa mã
    user.resetPasswordExpires = undefined; // Xóa thời gian hết hạn
    await user.save();

    return { message: 'Đặt lại mật khẩu thành công' };
  }
}