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
exports.searchUsers = exports.getAllUsers = exports.deleteUser = exports.updateProfile = exports.getProfile = void 0;
const userServices_1 = require("../services/userServices");
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const user = yield userServices_1.UserService.getUserProfile(userId);
        res.status(200).json(user);
    }
    catch (error) {
        res.status(404).json({ message: error.message || 'Lỗi khi lấy thông tin' });
    }
});
exports.getProfile = getProfile;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const { username, email, fullName } = req.body;
        const user = yield userServices_1.UserService.updateUserProfile(userId, { username, email, fullName });
        res.status(200).json({ message: 'Cập nhật thông tin thành công', user });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi cập nhật' });
    }
});
exports.updateProfile = updateProfile;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        if (req.user.role !== 'admin' && req.user.id !== userId) {
            res.status(403).json({ message: 'Chỉ admin hoặc chính user đó mới có quyền xóa' });
            return;
        }
        const result = yield userServices_1.UserService.deleteUser(userId);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi xóa người dùng' });
    }
});
exports.deleteUser = deleteUser;
// 
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== 'admin') {
            res.status(403).json({ message: 'Chỉ admin mới có quyền xem danh sách users' });
            return;
        }
        const users = yield userServices_1.UserService.getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi lấy danh sách users' });
    }
});
exports.getAllUsers = getAllUsers;
//
const searchUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.user.role !== 'admin') {
            res.status(403).json({ message: 'Chỉ admin mới có quyền tìm kiếm users' });
            return;
        }
        const { q } = req.query; // Query param 'q' để tìm kiếm
        if (!q || typeof q !== 'string') {
            res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm' });
            return;
        }
        const users = yield userServices_1.UserService.searchUsers(q);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi tìm kiếm users' });
    }
});
exports.searchUsers = searchUsers;
