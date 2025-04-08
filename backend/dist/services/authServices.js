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
        return __awaiter(this, arguments, void 0, function* ({ username, email, password, fullName }) {
            const existingUser = yield userModel_1.default.findOne({ $or: [{ email }, { username }] });
            if (existingUser)
                throw new Error('Email hoặc username đã tồn tại');
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = new userModel_1.default({
                username,
                email,
                password: hashedPassword,
                fullName,
                role: 'user',
                points: 0,
            });
            yield user.save();
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
            yield sessionModel_1.default.create({
                userId: user._id,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            return { user: { id: user._id, username, email, fullName, role: user.role }, accessToken, refreshToken };
        });
    }
    static login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            const user = yield userModel_1.default.findOne({ email });
            if (!user)
                throw new Error('Email không đúng');
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch)
                throw new Error('Mật khẩu không đúng');
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
            yield sessionModel_1.default.create({
                userId: user._id,
                refreshToken,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            return { user: { id: user._id, username: user.username, email: user.email, fullName: user.fullName, role: user.role }, accessToken, refreshToken };
        });
    }
    static refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield sessionModel_1.default.findOne({ refreshToken });
            if (!session || session.expiresAt < new Date())
                throw new Error('Refresh token không hợp lệ hoặc đã hết hạn');
            const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
            const user = yield userModel_1.default.findById(decoded.id);
            if (!user)
                throw new Error('Không tìm thấy người dùng');
            const accessToken = jsonwebtoken_1.default.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return { accessToken };
        });
    }
    static logout(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedSession = yield sessionModel_1.default.findOneAndDelete({ refreshToken });
            if (!deletedSession)
                throw new Error('Không tìm thấy session để đăng xuất');
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
}
exports.AuthService = AuthService;
