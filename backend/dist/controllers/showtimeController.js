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
exports.deleteShowtime = exports.getShowtimeById = exports.getAllShowtimes = exports.createShowtime = void 0;
const showtimeServices_1 = require("../services/showtimeServices");
const createShowtime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { movieId, roomId, startTime, endTime, price } = req.body;
        const newShowtime = yield showtimeServices_1.ShowtimeService.createShowtime(movieId, roomId, startTime, endTime, price);
        res.status(201).json({
            message: 'Tạo suất chiếu thành công',
            showtime: {
                _id: newShowtime._id.toString(),
                movieId: newShowtime.movieId,
                roomId: newShowtime.roomId,
                startTime: newShowtime.startTime.toISOString(),
                endTime: newShowtime.endTime.toISOString(),
                price: newShowtime.price,
            },
        });
    }
    catch (error) {
        const message = error.message;
        res.status(400).json({ message });
    }
});
exports.createShowtime = createShowtime;
const getAllShowtimes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const showtimes = yield showtimeServices_1.ShowtimeService.getAllShowtimes();
        res.status(200).json({
            message: 'Lấy danh sách suất chiếu thành công',
            showtimes: showtimes.map(showtime => ({
                _id: showtime._id.toString(),
                movieId: showtime.movieId,
                roomId: showtime.roomId,
                startTime: showtime.startTime.toISOString(),
                endTime: showtime.endTime.toISOString(),
                price: showtime.price, // Thêm price
            })),
        });
    }
    catch (error) {
        const message = error.message;
        res.status(500).json({ message: 'Lỗi khi lấy danh sách suất chiếu', error: message });
    }
});
exports.getAllShowtimes = getAllShowtimes;
const getShowtimeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const showtime = yield showtimeServices_1.ShowtimeService.getShowtimeById(id);
        res.status(200).json({
            message: 'Lấy thông tin suất chiếu thành công',
            showtime: {
                _id: showtime._id.toString(),
                movieId: showtime.movieId,
                roomId: showtime.roomId,
                startTime: showtime.startTime.toISOString(),
                endTime: showtime.endTime.toISOString(),
                price: showtime.price, // Thêm price
            },
        });
    }
    catch (error) {
        const message = error.message;
        res.status(400).json({ message });
    }
});
exports.getShowtimeById = getShowtimeById;
const deleteShowtime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedShowtime = yield showtimeServices_1.ShowtimeService.deleteShowtime(id);
        if (!deletedShowtime) {
            res.status(404).json({ message: 'Không tìm thấy suất chiếu' });
            return;
        }
        res.status(200).json({
            message: 'Xóa suất chiếu thành công',
            showtime: {
                _id: deletedShowtime._id.toString(),
                movieId: deletedShowtime.movieId,
                roomId: deletedShowtime.roomId,
                startTime: deletedShowtime.startTime.toISOString(),
                endTime: deletedShowtime.endTime.toISOString(),
                price: deletedShowtime.price, // Thêm price
            },
        });
    }
    catch (error) {
        const message = error.message;
        res.status(400).json({ message });
    }
});
exports.deleteShowtime = deleteShowtime;
