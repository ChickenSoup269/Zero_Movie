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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatController = void 0;
const seatServices_1 = require("../services/seatServices");
class SeatController {
    // [GET] Seat by Room
    static getSeatsByRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { roomId } = req.params;
                const seats = yield seatServices_1.SeatService.getSeatsByRoom(roomId);
                res.status(200).json({
                    message: 'Lấy danh sách ghế thành công',
                    seats: seats.map(seat => ({
                        _id: seat._id.toString(),
                        roomId: seat.roomId,
                        seatNumber: seat.seatNumber,
                        row: seat.row,
                        column: seat.column,
                        type: seat.type,
                    })),
                });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Lỗi khi lấy danh sách ghế', error: message });
                }
            }
        });
    }
    // [GET] by id
    static getSeatById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const seat = yield seatServices_1.SeatService.getSeatById(id);
                res.status(200).json({
                    message: 'Lấy thông tin ghế thành công',
                    seat: {
                        _id: seat._id.toString(),
                        roomId: seat.roomId,
                        seatNumber: seat.seatNumber,
                        row: seat.row,
                        column: seat.column,
                        type: seat.type,
                    },
                });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Lỗi khi lấy thông tin ghế', error: message });
                }
            }
        });
    }
    // [DELETE]
    static deleteSeat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                yield seatServices_1.SeatService.deleteSeat(id);
                res.status(200).json({ message: 'Xóa ghế thành công' });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Lỗi khi xóa ghế', error: message });
                }
            }
        });
    }
}
exports.SeatController = SeatController;
