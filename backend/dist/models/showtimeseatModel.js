"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const showtimeSeatSchema = new mongoose_1.Schema({
    showtimeId: { type: String, ref: 'Showtime', required: true },
    seatId: { type: String, ref: 'Seat', required: true },
    status: {
        type: String,
        enum: ['available', 'booked', 'reserved'],
        default: 'available',
    },
}, {
    timestamps: true,
});
showtimeSeatSchema.index({ showtimeId: 1, seatId: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('ShowtimeSeat', showtimeSeatSchema);
