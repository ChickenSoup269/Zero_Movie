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
exports.deleteCinema = exports.updateCinema = exports.createCinema = exports.getShowtimesByCinemaId = exports.getCinemaById = exports.getAllCinemas = void 0;
const cinemaServices_1 = require("../services/cinemaServices");
const getAllCinemas = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cinemas = yield cinemaServices_1.CinemaService.getAllCinemas();
        res.status(200).json({
            message: 'Lấy danh sách rạp thành công',
            cinemas: cinemas.map(cinema => {
                var _a, _b;
                return ({
                    _id: cinema._id.toString(),
                    name: cinema.name,
                    address: cinema.address,
                    createdAt: (_a = cinema.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                    updatedAt: (_b = cinema.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
                });
            }),
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách rạp', error: error.message });
    }
});
exports.getAllCinemas = getAllCinemas;
const getCinemaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const cinema = yield cinemaServices_1.CinemaService.getCinemaById(id);
        if (!cinema) {
            res.status(404).json({ message: 'Không tìm thấy rạp' });
            return;
        }
        res.status(200).json({
            message: 'Lấy thông tin rạp thành công',
            cinema: {
                _id: cinema._id.toString(),
                name: cinema.name,
                address: cinema.address,
                createdAt: (_a = cinema.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = cinema.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            },
        });
    }
    catch (error) {
        const message = error.message;
        if (message === 'ID rạp không hợp lệ') {
            res.status(400).json({ message });
        }
        else if (message === 'Không tìm thấy rạp') {
            res.status(404).json({ message });
        }
        else {
            res.status(500).json({ message: 'Lỗi khi lấy thông tin rạp', error: message });
        }
    }
});
exports.getCinemaById = getCinemaById;
const getShowtimesByCinemaId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { date, movieId } = req.query;
        const result = yield cinemaServices_1.CinemaService.getShowtimesByCinemaId(id, date, movieId);
        res.status(200).json({
            message: 'Lấy danh sách suất chiếu theo rạp thành công',
            cinema: result.cinema,
            showtimes: result.showtimes,
        });
    }
    catch (error) {
        const message = error.message;
        if (message === 'ID rạp không hợp lệ') {
            res.status(400).json({ message });
        }
        else if (message === 'Không tìm thấy rạp') {
            res.status(404).json({ message });
        }
        else if (message === 'Định dạng ngày không hợp lệ (dùng YYYY-MM-DD)') {
            res.status(400).json({ message });
        }
        else {
            res.status(500).json({ message: 'Lỗi khi lấy danh sách suất chiếu', error: message });
        }
    }
});
exports.getShowtimesByCinemaId = getShowtimesByCinemaId;
const createCinema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { name, address } = req.body;
        const newCinema = yield cinemaServices_1.CinemaService.createCinema(name, address);
        res.status(201).json({
            message: 'Tạo rạp thành công',
            cinema: {
                _id: newCinema._id.toString(),
                name: newCinema.name,
                address: newCinema.address,
                createdAt: (_a = newCinema.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = newCinema.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            },
        });
    }
    catch (error) {
        const message = error.message;
        if (message === 'Tên rạp và địa chỉ là bắt buộc') {
            res.status(400).json({ message });
        }
        else if (message === 'Địa chỉ rạp đã tồn tại') {
            res.status(409).json({ message });
        }
        else {
            res.status(500).json({ message: 'Lỗi khi tạo rạp', error: message });
        }
    }
});
exports.createCinema = createCinema;
const updateCinema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const { name, address } = req.body;
        const updatedCinema = yield cinemaServices_1.CinemaService.updateCinema(id, name, address);
        if (!updatedCinema) {
            res.status(404).json({ message: 'Không tìm thấy rạp để cập nhật' });
            return;
        }
        res.status(200).json({
            message: 'Cập nhật rạp thành công',
            cinema: {
                _id: updatedCinema._id.toString(),
                name: updatedCinema.name,
                address: updatedCinema.address,
                createdAt: (_a = updatedCinema.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = updatedCinema.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            },
        });
    }
    catch (error) {
        const message = error.message;
        if (message === 'ID rạp không hợp lệ') {
            res.status(400).json({ message });
        }
        else if (message === 'Cần cung cấp ít nhất một trường để cập nhật (name hoặc address)') {
            res.status(400).json({ message });
        }
        else if (message === 'Không tìm thấy rạp để cập nhật') {
            res.status(404).json({ message });
        }
        else if (message === 'Địa chỉ rạp đã tồn tại') {
            res.status(409).json({ message });
        }
        else {
            res.status(500).json({ message: 'Lỗi khi cập nhật rạp', error: message });
        }
    }
});
exports.updateCinema = updateCinema;
const deleteCinema = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { id } = req.params;
        const deletedCinema = yield cinemaServices_1.CinemaService.deleteCinema(id);
        if (!deletedCinema) {
            res.status(404).json({ message: 'Không tìm thấy rạp để xóa' });
            return;
        }
        res.status(200).json({
            message: 'Xóa rạp và dữ liệu liên quan thành công',
            cinema: {
                _id: deletedCinema._id.toString(),
                name: deletedCinema.name,
                address: deletedCinema.address,
                createdAt: (_a = deletedCinema.createdAt) === null || _a === void 0 ? void 0 : _a.toISOString(),
                updatedAt: (_b = deletedCinema.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
            },
        });
    }
    catch (error) {
        const message = error.message;
        if (message === 'ID rạp không hợp lệ') {
            res.status(400).json({ message });
        }
        else if (message === 'Không tìm thấy rạp để xóa') {
            res.status(404).json({ message });
        }
        else {
            res.status(500).json({ message: 'Lỗi khi xóa rạp', error: message });
        }
    }
});
exports.deleteCinema = deleteCinema;
