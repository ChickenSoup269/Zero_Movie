"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const cinemaSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true, unique: true },
}, {
    timestamps: true,
});
exports.default = (0, mongoose_1.model)('Cinema', cinemaSchema);
