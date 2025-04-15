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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = void 0;
exports.register = register;
exports.login = login;
exports.refreshToken = refreshToken;
exports.logout = logout;
exports.createGuestSession = createGuestSession;
const authServices_1 = require("../services/authServices");
const lodash_1 = require("lodash");
function register(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { username, email, password, fullName } = req.body;
            const result = yield authServices_1.AuthService.register({
                username,
                email,
                password,
                fullName,
            });
            res
                .status(201)
                .json(Object.assign({ status: "OK", message: "Đăng ký thành công" }, result));
        }
        catch (error) {
            res.status(400).json({
                status: "ERR",
                message: error.message || "Lỗi khi đăng ký",
            });
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const result = yield authServices_1.AuthService.login({ email, password });
            res
                .status(200)
                .json(Object.assign({ status: "OK", message: "Đăng nhập thành công" }, result));
        }
        catch (error) {
            res.status(401).json({
                status: "ERR",
                message: error.message || "Lỗi khi đăng nhập",
            });
        }
    });
}
function refreshToken(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            const result = yield authServices_1.AuthService.refreshToken(refreshToken);
            res
                .status(200)
                .json(Object.assign({ status: "OK", message: "Làm mới token thành công" }, result));
        }
        catch (error) {
            res.status(401).json({
                status: "ERR",
                message: error.message || "Lỗi khi làm mới token",
            });
        }
    });
}
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { refreshToken } = req.body;
            yield authServices_1.AuthService.logout(refreshToken);
            res.status(200).json({ status: "OK", message: "Đăng xuất thành công" });
        }
        catch (error) {
            res.status(400).json({
                status: "ERR",
                message: error.message || "Lỗi khi đăng xuất",
            });
        }
    });
}
function createGuestSession(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield authServices_1.AuthService.createGuestSession();
            res
                .status(201)
                .json(Object.assign({ status: "OK", message: "Tạo phiên guest thành công" }, result));
        }
        catch (error) {
            res.status(400).json({
                status: "ERR",
                message: error.message || "Lỗi khi tạo phiên guest",
            });
        }
    });
}
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email)
            throw new Error("Thiếu email");
        const result = yield authServices_1.AuthService.forgotPassword(email);
        res.json(Object.assign({ status: "OK", message: "Mã OTP đã được tạo" }, (0, lodash_1.omit)(result, "message")));
    }
    catch (error) {
        res.status(400).json({
            status: "ERR",
            message: error.message || "Lỗi khi tạo mã OTP",
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword)
            throw new Error("Thiếu email, OTP hoặc mật khẩu mới");
        const result = yield authServices_1.AuthService.resetPassword({ email, otp, newPassword });
        res
            .status(200)
            .json(Object.assign(Object.assign({ status: "OK" }, result), { message: "Đặt lại mật khẩu thành công" }));
    }
    catch (error) {
        res.status(400).json({
            status: "ERR",
            message: error.message || "Lỗi khi đặt lại mật khẩu",
        });
    }
});
exports.resetPassword = resetPassword;
