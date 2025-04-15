"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const roomSchema = new mongoose_1.Schema({
    cinemaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Cinema', required: true },
    roomNumber: { type: String, required: true },
    capacity: { type: Number, required: true },
}, {
    timestamps: true,
});
roomSchema.index({ cinemaId: 1, roomNumber: 1 }, { unique: true });
exports.default = (0, mongoose_1.model)('Room', roomSchema);
