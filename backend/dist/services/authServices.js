"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const userModel_1 = __importDefault(require("../models/userModel"));
const sessionModel_1 = __importDefault(require("../models/Auth/sessionModel"));
const guestsessionModel_1 = __importDefault(require("../models/Auth/guestsessionModel"));
class AuthService {
    static register(_a) {
        return __awaiter(this, arguments, void 0, function* ({ username, email, password, fullName, }) {
            const existingUser = yield userModel_1.default.findOne({ $or: [{ email }, { username }] });
            if (existingUser)
                throw new Error("Email hoặc username đã tồn tại");
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = new userModel_1.default({
                username,
                email,
                password: hashedPassword,
                fullName,
                role: "user",
                points: 0,
                avatar: "",
                backgroundImage: "",
            });
            yield user.save();
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
            yield sessionModel_1.default.create({
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
                    backgroundImage: user.backgroundImage,
                },
                accessToken,
                refreshToken,
            };
        });
    }
    static login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield userModel_1.default.findOne({ email }).select("+password");
            if (!user)
                throw new Error("Email không đúng");
            console.log("Login attempt for email:", email);
            console.log("Password entered (plain):", password);
            console.log("Stored hashed password:", user.password);
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            console.log("Password match:", isMatch);
            if (!isMatch)
                throw new Error("Mật khẩu không đúng");
            const entry = {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role,
                    avatar: user.avatar,
                    backgroundImage: user.backgroundImage,
                },
                accessToken: jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" }),
                refreshToken: jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" }),
            };
            yield sessionModel_1.default.create({
                userId: user._id,
                refreshToken: entry.refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            return entry;
        });
    }
    static refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield sessionModel_1.default.findOne({ refreshToken });
            if (!session || session.expiresAt < new Date())
                throw new Error("Refresh token không hợp lệ hoặc đã hết hạn");
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = yield userModel_1.default.findById(decoded.id);
            if (!user)
                throw new Error("Không tìm thấy người dùng");
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return { accessToken };
        });
    }
    static logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedSession = yield sessionModel_1.default.findOneAndDelete({ refreshToken });
            if (!deletedSession)
                throw new Error("Không tìm thấy session để đăng xuất");
        });
    }
    static createGuestSession() {
        return __awaiter(this, void 0, void 0, function* () {
            const guestSessionId = (0, uuid_1.v4)();
            const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
            yield guestsessionModel_1.default.create({
                guestSessionId,
                expiresAt,
            });
            return { guestSessionId, expiresAt };
        });
    }
    static forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findOne({ email });
            if (!user)
                throw new Error("Không tìm thấy email này");
            const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            user.resetPasswordCode = resetCode;
            user.resetPasswordExpires = expiresAt;
            yield user.save();
            console.log("Generated OTP for email:", email, "OTP:", resetCode);
            return { message: "Mã OTP đã được tạo", resetCode };
        });
    }
    static resetPassword(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, otp, newPassword, }) {
            const user = yield userModel_1.default.findOne({
                email,
                resetPasswordCode: otp,
                resetPasswordExpires: { $gt: new Date() },
            }).select("+password");
            if (!user)
                throw new Error("Mã OTP không hợp lệ hoặc đã hết hạn");
            if (newPassword.length < 8) {
                throw new Error("Mật khẩu mới phải có ít nhất 8 ký tự");
            }
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            console.log("Resetting password for email:", email);
            console.log("New password (plain):", newPassword);
            console.log("Hashed password:", hashedPassword);
            user.password = hashedPassword;
            user.resetPasswordCode = undefined;
            user.resetPasswordExpires = undefined;
            yield user.save();
            console.log("User after save:", yield userModel_1.default.findOne({ email }).select("+password"));
            yield sessionModel_1.default.deleteMany({ userId: user._id });
            return { message: "Đặt lại mật khẩu thành công" };
        });
    }
}
exports.AuthService = AuthService;
