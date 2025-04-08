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
exports.updateSeatStatus = exports.getSeatsByShowtime = void 0;
const showtimeseatServices_1 = require("../services/showtimeseatServices");
const getSeatsByShowtime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { showtimeId } = req.params;
        const seats = yield showtimeseatServices_1.ShowtimeSeatService.getSeatsByShowtime(showtimeId);
        res.status(200).json({
            message: 'Lấy danh sách ghế thành công',
            seats: seats.map(seat => ({
                _id: seat._id.toString(),
                showtimeId: seat.showtimeId,
                seatId: seat.seatId._id.toString(), // Giờ seatId là ISeat, có _id
                seatNumber: seat.seatId.seatNumber, // Truy cập seatNumber từ ISeat
                status: seat.status,
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
exports.getSeatsByShowtime = getSeatsByShowtime;
const updateSeatStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { showtimeId, seatId } = req.params;
        const { status } = req.body;
        const updatedSeat = yield showtimeseatServices_1.ShowtimeSeatService.updateSeatStatus(showtimeId, seatId, status);
        if (!updatedSeat) {
            res.status(404).json({ message: 'Không tìm thấy ghế' });
            return;
        }
        res.status(200).json({
            message: 'Cập nhật trạng thái ghế thành công',
            seat: {
                _id: updatedSeat._id.toString(),
                showtimeId: updatedSeat.showtimeId,
                seatId: updatedSeat.seatId,
                status: updatedSeat.status,
            },
        });
    }
    catch (error) {
        const message = error.message;
        if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
            res.status(400).json({ message });
        }
        else {
            res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái ghế', error: message });
        }
    }
});
exports.updateSeatStatus = updateSeatStatus;
