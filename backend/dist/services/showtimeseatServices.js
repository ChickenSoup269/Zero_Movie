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
exports.ShowtimeSeatService = void 0;
const showtimeseatModel_1 = __importDefault(require("../models/showtimeseatModel"));
const seatModel_1 = __importDefault(require("../models/seatModel"));
const showtimeModel_1 = __importDefault(require("../models/showtimeModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class ShowtimeSeatService {
    // Khởi tạo 144 ghế cho suất chiếu
    static initializeSeats(showtimeId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(showtimeId) || !mongoose_1.default.Types.ObjectId.isValid(roomId)) {
                throw new Error('Showtime ID hoặc Room ID không hợp lệ');
            }
            const showtime = yield showtimeModel_1.default.findById(showtimeId);
            if (!showtime) {
                throw new Error('Không tìm thấy suất chiếu');
            }
            const seats = yield seatModel_1.default.find({ roomId });
            if (seats.length !== 144) {
                throw new Error('Phòng không có đủ 144 ghế');
            }
            const showtimeSeats = seats.map(seat => ({
                showtimeId,
                seatId: seat._id.toString(),
                status: 'available',
            }));
            yield showtimeseatModel_1.default.insertMany(showtimeSeats);
        });
    }
    // [GET] seatbyshowtime
    static getSeatsByShowtime(showtimeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(showtimeId)) {
                throw new Error('Showtime ID không hợp lệ');
            }
            const showtime = yield showtimeModel_1.default.findById(showtimeId);
            if (!showtime) {
                throw new Error('Không tìm thấy suất chiếu');
            }
            // Sửa lỗi bằng cách ép kiểu qua unknown
            const seats = yield showtimeseatModel_1.default.find({ showtimeId }).populate('seatId');
            return seats;
        });
    }
    // [Delete] when showtime expired
    static cleanUpExpiredShowtimes() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const expiredShowtimes = yield showtimeModel_1.default.find({ endTime: { $lt: now } });
            for (const showtime of expiredShowtimes) {
                const deletedCount = yield showtimeseatModel_1.default.deleteMany({ showtimeId: showtime._id.toString() });
                console.log(`Đã xóa ${deletedCount.deletedCount} ShowtimeSeat cho showtime ${showtime._id}`);
            }
        });
    }
    // UPDATE
    static updateSeatStatus(showtimeId, seatId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(showtimeId) || !mongoose_1.default.Types.ObjectId.isValid(seatId)) {
                throw new Error('Showtime ID hoặc Seat ID không hợp lệ');
            }
            const showtimeSeat = yield showtimeseatModel_1.default.findOne({ showtimeId, seatId });
            if (!showtimeSeat) {
                throw new Error('Không tìm thấy trạng thái ghế cho suất chiếu này');
            }
            showtimeSeat.status = status;
            return yield showtimeSeat.save();
        });
    }
    //DELETE
    static deleteSeatsByShowtime(showtimeId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(showtimeId)) {
                throw new Error('Showtime ID không hợp lệ');
            }
            yield showtimeseatModel_1.default.deleteMany({ showtimeId });
        });
    }
}
exports.ShowtimeSeatService = ShowtimeSeatService;
