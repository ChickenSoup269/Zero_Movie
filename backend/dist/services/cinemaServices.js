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
exports.CinemaService = void 0;
const cinemaModel_1 = __importDefault(require("../models/cinemaModel"));
const roomModel_1 = __importDefault(require("../models/roomModel"));
const showtimeModel_1 = __importDefault(require("../models/showtimeModel"));
const seatModel_1 = __importDefault(require("../models/seatModel"));
const showtimeseatModel_1 = __importDefault(require("../models/showtimeseatModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class CinemaService {
    // GET ALL
    static getAllCinemas() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield cinemaModel_1.default.find();
        });
    }
    // GET BY ID
    static getCinemaById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('ID rạp không hợp lệ');
            }
            const cinema = yield cinemaModel_1.default.findById(id);
            if (!cinema) {
                throw new Error('Không tìm thấy rạp');
            }
            return cinema;
        });
    }
    // GET SHOWTIME BY CINEMA 
    static getShowtimesByCinemaId(id, date, movieId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('ID rạp không hợp lệ');
            }
            const cinema = yield cinemaModel_1.default.findById(id);
            if (!cinema) {
                throw new Error('Không tìm thấy rạp');
            }
            const rooms = yield roomModel_1.default.find({ cinemaId: id });
            const roomIds = rooms.map(room => room._id.toString());
            const query = { roomId: { $in: roomIds } };
            if (date) {
                const startOfDay = new Date(date);
                if (isNaN(startOfDay.getTime())) {
                    throw new Error('Định dạng ngày không hợp lệ (dùng YYYY-MM-DD)');
                }
                const endOfDay = new Date(startOfDay);
                endOfDay.setDate(endOfDay.getDate() + 1);
                query.startTime = { $gte: startOfDay, $lt: endOfDay };
            }
            if (movieId) {
                query.movieId = Number(movieId);
            }
            const showtimes = yield showtimeModel_1.default.find(query).populate('roomId');
            const formattedShowtimes = yield Promise.all(showtimes.map((showtime) => __awaiter(this, void 0, void 0, function* () {
                const room = showtime.roomId;
                const movie = yield mongoose_1.default.model('Movie').findOne({ tmdbId: showtime.movieId });
                return {
                    _id: showtime._id.toString(),
                    movieId: showtime.movieId,
                    movieTitle: movie === null || movie === void 0 ? void 0 : movie.title,
                    roomId: room._id.toString(),
                    roomNumber: room.roomNumber,
                    startTime: showtime.startTime.toISOString(),
                    endTime: showtime.endTime.toISOString(),
                };
            })));
            return {
                cinema: {
                    _id: cinema._id.toString(),
                    name: cinema.name,
                    address: cinema.address,
                    createdAt: (_a = cinema.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                    updatedAt: (_b = cinema.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
                },
                showtimes: formattedShowtimes,
            };
        });
    }
    // CREATE
    static createCinema(name, address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name || !address) {
                throw new Error('Tên rạp và địa chỉ là bắt buộc');
            }
            try {
                const newCinema = yield cinemaModel_1.default.create({ name, address });
                return newCinema;
            }
            catch (error) {
                if (error.code === 11000) {
                    throw new Error('Địa chỉ rạp đã tồn tại');
                }
                throw error;
            }
        });
    }
    // UPDATE
    static updateCinema(id, name, address) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('ID rạp không hợp lệ');
            }
            if (!name && !address) {
                throw new Error('Cần cung cấp ít nhất một trường để cập nhật (name hoặc address)');
            }
            const updatedCinema = yield cinemaModel_1.default.findByIdAndUpdate(id, { name, address }, { new: true, runValidators: true });
            if (!updatedCinema) {
                throw new Error('Không tìm thấy rạp để cập nhật');
            }
            return updatedCinema;
        });
    }
    // DELETE
    static deleteCinema(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('ID rạp không hợp lệ');
            }
            const deletedCinema = yield cinemaModel_1.default.findByIdAndDelete(id);
            if (!deletedCinema) {
                throw new Error('Không tìm thấy rạp để xóa');
            }
            const rooms = yield roomModel_1.default.find({ cinemaId: id });
            const roomIds = rooms.map(room => room._id.toString());
            yield roomModel_1.default.deleteMany({ cinemaId: id });
            yield seatModel_1.default.deleteMany({ roomId: { $in: roomIds } });
            const showtimes = yield showtimeModel_1.default.find({ roomId: { $in: roomIds } });
            const showtimeIds = showtimes.map(showtime => showtime._id.toString());
            yield showtimeModel_1.default.deleteMany({ roomId: { $in: roomIds } });
            yield showtimeseatModel_1.default.deleteMany({ showtimeId: { $in: showtimeIds } });
            return deletedCinema;
        });
    }
}
exports.CinemaService = CinemaService;
