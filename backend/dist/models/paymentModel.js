"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const paymentSchema = new mongoose_1.Schema({
    bookingId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Booking', required: true },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: null },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: { type: String, enum: ['paypal'], required: true },
    transactionId: { type: String },
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Payment', paymentSchema);
