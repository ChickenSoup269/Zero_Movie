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
exports.BookingService = void 0;
const bookingModel_1 = __importDefault(require("../models/bookingModel"));
const showtimeModel_1 = __importDefault(require("../models/showtimeModel"));
const showtimeseatModel_1 = __importDefault(require("../models/showtimeseatModel"));
const movieModel_1 = require("../models/movieModel");
class BookingService {
    static createBooking(userId, movieId, showtimeId, seatIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const movie = yield movieModel_1.Movie.findOne({ tmdbId: movieId });
            if (!movie)
                throw new Error('Phim không tồn tại');
            const showtime = yield showtimeModel_1.default.findById(showtimeId);
            if (!showtime || showtime.movieId !== movieId)
                throw new Error('Suất chiếu không tồn tại hoặc không khớp với phim');
            const showtimeSeats = yield showtimeseatModel_1.default.find({ showtimeId, seatId: { $in: seatIds } });
            if (showtimeSeats.length !== seatIds.length)
                throw new Error('Một số ghế không tồn tại trong suất chiếu này');
            const unavailableSeats = showtimeSeats.filter(seat => seat.status !== 'available');
            if (unavailableSeats.length > 0)
                throw new Error('Một số ghế đã được đặt');
            const totalPrice = showtime.price * seatIds.length; // Tính tổng giá
            const booking = new bookingModel_1.default({
                userId: userId || null,
                movieId,
                showtimeId,
                seatIds,
                totalPrice,
                status: 'pending',
            });
            yield booking.save();
            return { booking, totalPrice }; // Trả về cả booking và totalPrice
        });
    }
    static getUserBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const bookings = yield bookingModel_1.default.find({ userId })
                .populate('movieId', 'title')
                .populate('showtimeId', 'startTime endTime price')
                .populate('seatIds', 'seatNumber row column');
            return bookings;
        });
    }
    static confirmBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const booking = yield bookingModel_1.default.findById(bookingId);
            if (!booking || booking.status !== 'pending')
                throw new Error('Booking không hợp lệ hoặc đã được xử lý');
            const updatedSeats = yield showtimeseatModel_1.default.updateMany({ showtimeId: booking.showtimeId, seatId: { $in: booking.seatIds }, status: 'available' }, { $set: { status: 'booked' } });
            if (updatedSeats.matchedCount !== booking.seatIds.length) {
                throw new Error('Một số ghế đã được đặt bởi người khác');
            }
            booking.status = 'confirmed';
            yield booking.save();
            return booking;
        });
    }
}
exports.BookingService = BookingService;
