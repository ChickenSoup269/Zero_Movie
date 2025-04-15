"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const seatSchema = new mongoose_1.Schema({
    roomId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Room', required: true }, // Sửa thành ObjectId
    seatNumber: { type: String, required: true },
    row: { type: String, required: true, enum: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] },
    column: { type: Number, required: true, min: 1, max: 18 },
    type: { type: String, enum: ['standard'], default: 'standard' },
}, {
    timestamps: true,
});
seatSchema.index({ roomId: 1, seatNumber: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('Seat', seatSchema);
