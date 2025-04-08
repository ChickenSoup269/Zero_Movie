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
exports.RoomService = void 0;
const roomModel_1 = __importDefault(require("../models/roomModel"));
const showtimeModel_1 = __importDefault(require("../models/showtimeModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const seatServices_1 = require("./seatServices");
class RoomService {
    static createRoom(cinemaId, roomNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!cinemaId || !roomNumber) {
                throw new Error('cinemaId và roomNumber là bắt buộc');
            }
            if (!mongoose_1.default.Types.ObjectId.isValid(cinemaId)) {
                throw new Error('Cinema ID không hợp lệ');
            }
            const cinema = yield mongoose_1.default.model('Cinema').findById(cinemaId);
            if (!cinema) {
                throw new Error('Không tìm thấy rạp');
            }
            const existingRoom = yield roomModel_1.default.findOne({ cinemaId, roomNumber });
            if (existingRoom) {
                throw new Error('Phòng đã tồn tại trong rạp này');
            }
            const newRoom = new roomModel_1.default({ cinemaId, roomNumber, capacity: 144 });
            try {
                yield newRoom.save(); // Lưu Room trước
                yield seatServices_1.SeatService.initializeSeatsForRoom(newRoom._id.toString()); // Tạo 144 ghế
                return newRoom;
            }
            catch (error) {
                yield roomModel_1.default.findByIdAndDelete(newRoom._id); // Rollback nếu lỗi
                throw new Error(`Tạo phòng thất bại: ${error.message}`);
            }
        });
    }
    static getAllRooms(cinemaId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (cinemaId) {
                if (!mongoose_1.default.Types.ObjectId.isValid(cinemaId)) {
                    throw new Error('Cinema ID không hợp lệ');
                }
                query.cinemaId = cinemaId;
            }
            return yield roomModel_1.default.find(query);
        });
    }
    static getRoomById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Room ID không hợp lệ');
            }
            const room = yield roomModel_1.default.findById(id);
            if (!room) {
                throw new Error('Không tìm thấy phòng');
            }
            return room;
        });
    }
    static updateRoom(id, roomNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Room ID không hợp lệ');
            }
            if (!roomNumber) {
                throw new Error('Cần cung cấp roomNumber để cập nhật');
            }
            const room = yield roomModel_1.default.findById(id);
            if (!room) {
                throw new Error('Không tìm thấy phòng');
            }
            if (roomNumber !== room.roomNumber) {
                const existingRoom = yield roomModel_1.default.findOne({ cinemaId: room.cinemaId, roomNumber });
                if (existingRoom) {
                    throw new Error('Phòng với số này đã tồn tại trong rạp');
                }
            }
            const updatedRoom = yield roomModel_1.default.findByIdAndUpdate(id, { roomNumber }, { new: true, runValidators: true });
            return updatedRoom;
        });
    }
    static deleteRoom(id) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
                throw new Error('Room ID không hợp lệ');
            }
            const room = yield roomModel_1.default.findById(id);
            if (!room) {
                throw new Error('Không tìm thấy phòng');
            }
            const showtimes = yield showtimeModel_1.default.find({ roomId: id });
            if (showtimes.length > 0) {
                throw new Error('Không thể xóa phòng vì đã có suất chiếu liên quan');
            }
            yield mongoose_1.default.model('Seat').deleteMany({ roomId: id }); // Xóa ghế
            const deletedRoom = yield roomModel_1.default.findByIdAndDelete(id);
            return deletedRoom;
        });
    }
}
exports.RoomService = RoomService;
