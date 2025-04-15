"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const showtimeSchema = new mongoose_1.Schema({
    movieId: { type: Number, required: true },
    roomId: { type: String, ref: 'Room', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
}, {
    timestamps: true,
});
showtimeSchema.index({ roomId: 1, startTime: 1 }); // Index để kiểm tra xung đột nhanh
exports.default = (0, mongoose_1.model)('Showtime', showtimeSchema);
