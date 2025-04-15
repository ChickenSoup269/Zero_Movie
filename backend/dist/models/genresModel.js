"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Genre = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const genreSchema = new mongoose_1.default.Schema({
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true },
});
exports.Genre = mongoose_1.default.model('Genre', genreSchema);
