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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatService = void 0;
const seatModel_1 = __importDefault(require("../models/seatModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class SeatService {
    static initializeSeatsForRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
                throw new Error('Room ID không hợp lệ');
            }
            const existingSeats = yield seatModel_1.default.find({ roomId });
            if (existingSeats.length > 0) {
                throw new Error('Phòng đã có ghế');
            }
            const seats = [];
            const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
            for (const row of rows) {
                for (let column = 1; column <= 18; column++) {
                    seats.push({
                        roomId: new mongoose_1.default.Types.ObjectId(roomId), // Chuyển thành ObjectId
                        seatNumber: `${row}${column}`,
                        row,
                        column,
                        type: 'standard',
                    });
                }
            }
            try {
                const result = yield seatModel_1.default.insertMany(seats);
                console.log(`Inserted ${result.length} seats for roomId: ${roomId}`);
            }
            catch (error) {
                console.error(`Failed to insert seats for roomId: ${roomId}`, error);
                throw error;
            }
        });
    }
    static getSeatsByRoom(roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
                throw new Error('Room ID không hợp lệ');
            }
            const seats = yield seatModel_1.default.find({ roomId });
            if (seats.length === 0) {
                throw new Error('Không tìm thấy ghế nào trong phòng này');
            }
            return seats;
        });
    }
    // [GETBYID]
    static getSeatById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Seat ID không hợp lệ');
            }
            const seat = yield seatModel_1.default.findById(id);
            if (!seat) {
                throw new Error('Không tìm thấy ghế');
            }
            return seat;
        });
    }
    static deleteSeat(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Seat ID không hợp lệ');
            }
            const seat = yield seatModel_1.default.findByIdAndDelete(id);
            if (!seat) {
                throw new Error('Không tìm thấy ghế');
            }
        });
    }
}
exports.SeatService = SeatService;
