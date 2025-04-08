"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    movieId: { type: Number, required: true },
    showtimeId: { type: String, ref: 'Showtime', required: true },
    seatIds: [{ type: String, ref: 'Seat', required: true }],
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
    totalPrice: { type: Number, required: true, min: 0 },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Booking', bookingSchema);
