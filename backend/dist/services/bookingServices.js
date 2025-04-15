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
const mongoose_1 = __importDefault(require("mongoose"));
const bookingModel_1 = __importDefault(require("../models/bookingModel")); // Import cả IBooking
const showtimeModel_1 = __importDefault(require("../models/showtimeModel"));
const showtimeseatModel_1 = __importDefault(require("../models/showtimeseatModel"));
const movieModel_1 = require("../models/movieModel");
class BookingService {
    static createBooking(userId, movieId, showtimeId, seatIds) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(showtimeId) || seatIds.some(id => !mongoose_1.default.Types.ObjectId.isValid(id))) {
                throw new Error('Showtime ID hoặc Seat ID không hợp lệ');
            }
            const movie = yield movieModel_1.Movie.findOne({ tmdbId: movieId });
            if (!movie)
                throw new Error('Phim không tồn tại');
            const showtime = yield showtimeModel_1.default.findById(showtimeId);
            if (!showtime || showtime.movieId !== movieId)
                throw new Error('Suất chiếu không tồn tại hoặc không khớp với phim');
            const showtimeSeats = yield showtimeseatModel_1.default.find({ showtimeId, _id: { $in: seatIds } });
            if (showtimeSeats.length !== seatIds.length)
                throw new Error('Một số ghế không tồn tại trong suất chiếu này');
            if (showtimeSeats.some(seat => seat.status !== 'available'))
                throw new Error('Một số ghế đã được đặt');
            const totalPrice = showtime.price * seatIds.length;
            const booking = new bookingModel_1.default({
                userId: userId || null,
                movieId,
                showtimeId,
                seatIds,
                totalPrice,
                status: 'pending',
            });
            yield booking.save();
            return { booking, totalPrice };
        });
    }
    static getUserBookings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId)
                throw new Error('User ID không hợp lệ');
            const bookings = yield bookingModel_1.default.find({ userId })
                .populate('movieId', 'title')
                .populate('showtimeId', 'startTime endTime price')
                .populate('seatIds', 'seatNumber row column');
            return bookings;
        });
    }
    // Các hàm khác nếu có (confirmBooking, cancelBooking)
    static confirmBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookingId))
                throw new Error('Booking ID không hợp lệ');
            const session = yield mongoose_1.default.startSession();
            session.startTransaction();
            try {
                const booking = yield bookingModel_1.default.findById(bookingId).session(session);
                if (!booking || booking.status !== 'pending')
                    throw new Error('Booking không hợp lệ hoặc đã được xử lý');
                const updatedSeats = yield showtimeseatModel_1.default.updateMany({ showtimeId: booking.showtimeId, _id: { $in: booking.seatIds }, status: 'available' }, { $set: { status: 'booked' } }, { session });
                if (updatedSeats.matchedCount !== booking.seatIds.length) {
                    throw new Error('Một số ghế đã được đặt bởi người khác');
                }
                booking.status = 'confirmed';
                yield booking.save({ session });
                yield session.commitTransaction();
                return booking;
            }
            catch (error) {
                yield session.abortTransaction();
                throw error;
            }
            finally {
                session.endSession();
            }
        });
    }
    static cancelBooking(bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(bookingId))
                throw new Error('Booking ID không hợp lệ');
            const booking = yield bookingModel_1.default.findById(bookingId);
            if (!booking || booking.status !== 'pending')
                return;
            booking.status = 'cancelled';
            yield booking.save();
        });
    }
}
exports.BookingService = BookingService;
