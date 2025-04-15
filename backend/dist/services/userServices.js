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
exports.UserService = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
class UserService {
    static getUserProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findById(userId).select("-password");
            if (!user)
                throw new Error("Không tìm thấy người dùng");
            return user;
        });
    }
    static updateUserProfile(userId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedUser = yield userModel_1.default.findByIdAndUpdate(userId, {
                username: updateData.username,
                email: updateData.email,
                fullName: updateData.fullName,
                avatar: updateData.avatar,
                backgroundImage: updateData.backgroundImage,
            }, { new: true, runValidators: true }).select("-password");
            if (!updatedUser)
                throw new Error("Không tìm thấy người dùng để cập nhật");
            return updatedUser;
        });
    }
    static deleteUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userModel_1.default.findByIdAndDelete(userId);
            if (!user)
                throw new Error("Không tìm thấy người dùng để xóa");
            return { message: "Xóa người dùng thành công" };
        });
    }
    static getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.default.find().select("-password");
            return users;
        });
    }
    static searchUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield userModel_1.default.find({
                $or: [
                    { username: { $regex: query, $options: "i" } },
                    { email: { $regex: query, $options: "i" } },
                ],
            }).select("-password");
            return users;
        });
    }
}
exports.UserService = UserService;
