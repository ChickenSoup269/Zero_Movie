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
exports.guestMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const sessionModel_1 = __importDefault(require("../models/Auth/sessionModel"));
const guestsessionModel_1 = __importDefault(require("../models/Auth/guestsessionModel"));
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Không có token" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const session = yield sessionModel_1.default.findOne({
            userId: decoded.id,
            refreshToken: { $exists: true },
        });
        if (!session)
            throw new Error("Phiên không hợp lệ");
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (error) {
        res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
});
exports.authMiddleware = authMiddleware;
const guestMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const guestSessionId = req.headers["x-guest-session-id"];
    if (!guestSessionId) {
        res.status(401).json({ message: "Không có guest session ID" });
        return;
    }
    const session = yield guestsessionModel_1.default.findOne({ guestSessionId });
    if (!session || session.expiresAt < new Date()) {
        res
            .status(401)
            .json({ message: "Guest session không hợp lệ hoặc đã hết hạn" });
        return;
    }
    req.guestSessionId = guestSessionId;
    next();
});
exports.guestMiddleware = guestMiddleware;
