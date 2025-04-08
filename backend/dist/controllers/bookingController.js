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
exports.getUserBookings = exports.createBooking = void 0;
const bookingServices_1 = require("../services/bookingServices");
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || null;
        const { movieId, showtimeId, seatIds } = req.body;
        const { booking, totalPrice } = yield bookingServices_1.BookingService.createBooking(userId, movieId, showtimeId, seatIds);
        res.status(201).json({ message: 'Đặt vé thành công', booking, totalPrice });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi đặt vé' });
    }
});
exports.createBooking = createBooking;
const getUserBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        const bookings = yield bookingServices_1.BookingService.getUserBookings(userId);
        res.status(200).json(bookings);
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Lỗi khi lấy danh sách vé' });
    }
});
exports.getUserBookings = getUserBookings;
