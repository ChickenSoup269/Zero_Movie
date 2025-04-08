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
exports.ShowtimeService = void 0;
const showtimeModel_1 = __importDefault(require("../models/showtimeModel"));
const roomModel_1 = __importDefault(require("../models/roomModel"));
const showtimeseatServices_1 = require("./showtimeseatServices");
const mongoose_1 = __importDefault(require("mongoose"));
class ShowtimeService {
    static createShowtime(movieId, roomId, startTime, endTime, price) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!movieId || !roomId || !startTime || !endTime || price === undefined) {
                throw new Error('movieId, roomId, startTime, endTime, và price là bắt buộc');
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(roomId)) {
                throw new Error('Room ID không hợp lệ');
            }
            const room = yield roomModel_1.default.findById(roomId);
            if (!room) {
                throw new Error('Không tìm thấy phòng');
            }
            const start = new Date(startTime);
            const end = new Date(endTime);
            if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
                throw new Error('Thời gian không hợp lệ');
            }
            const conflictingShowtime = yield showtimeModel_1.default.findOne({
                roomId,
                $or: [
                    { startTime: { $lt: end, $gte: start } },
                    { endTime: { $gt: start, $lte: end } },
                    { startTime: { $lte: start }, endTime: { $gte: end } },
                ],
            });
            if (conflictingShowtime) {
                throw new Error('Phòng đã được đặt trong khoảng thời gian này');
            }
            const newShowtime = new showtimeModel_1.default({
                movieId,
                roomId,
                startTime: start,
                endTime: end,
                price,
            });
            try {
                yield newShowtime.save(); // Lưu Showtime trước
                yield showtimeseatServices_1.ShowtimeSeatService.initializeSeats(newShowtime._id.toString(), roomId); // Tạo ghế
                return newShowtime;
            }
            catch (error) {
                yield showtimeModel_1.default.findByIdAndDelete(newShowtime._id); // Rollback nếu lỗi
                throw error; // Ném lỗi lên controller
            }
        });
    }
    static getAllShowtimes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield showtimeModel_1.default.find().populate('roomId');
        });
    }
    static getShowtimeById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Showtime ID không hợp lệ');
            }
            const showtime = yield showtimeModel_1.default.findById(id).populate('roomId');
            if (!showtime) {
                throw new Error('Không tìm thấy suất chiếu');
            }
            return showtime;
        });
    }
    static deleteShowtime(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Showtime ID không hợp lệ');
            }
            const showtime = yield showtimeModel_1.default.findById(id);
            if (!showtime) {
                throw new Error('Không tìm thấy suất chiếu');
            }
            yield showtimeseatServices_1.ShowtimeSeatService.deleteSeatsByShowtime(id);
            return yield showtimeModel_1.default.findByIdAndDelete(id);
        });
    }
}
exports.ShowtimeService = ShowtimeService;
