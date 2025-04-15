"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: { type: String, required: true, select: false }, // Không trả về password trong query mặc định
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    points: { type: Number, default: 0, min: 0 },
    resetPasswordCode: { type: String, default: undefined },
    resetPasswordExpires: { type: Date, default: undefined },
    avatar: { type: String, default: "" },
    backgroundImage: { type: String, default: "" },
}, { timestamps: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ username: 1 }, { unique: true }); // Thêm index cho username
exports.default = (0, mongoose_1.model)("User", userSchema);
