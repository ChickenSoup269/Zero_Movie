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
exports.RoomController = void 0;
const roomServices_1 = require("../services/roomServices");
class RoomController {
    static createRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cinemaId, roomNumber } = req.body;
                const room = yield roomServices_1.RoomService.createRoom(cinemaId, roomNumber);
                res.status(201).json({
                    message: 'Tạo phòng chiếu thành công',
                    room: {
                        _id: room._id.toString(),
                        cinemaId: room.cinemaId,
                        roomNumber: room.roomNumber,
                        capacity: room.capacity,
                    },
                });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('không hợp lệ') || message.includes('đã tồn tại') || message.includes('Không tìm thấy')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Lỗi khi tạo phòng chiếu', error: message });
                }
            }
        });
    }
    static getAllRooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { cinemaId } = req.query;
                const rooms = yield roomServices_1.RoomService.getAllRooms(cinemaId);
                res.status(200).json({
                    message: 'Lấy danh sách phòng thành công',
                    rooms: rooms.map(room => ({
                        _id: room._id.toString(),
                        cinemaId: room.cinemaId,
                        roomNumber: room.roomNumber,
                        capacity: room.capacity,
                    })),
                });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('không hợp lệ')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng', error: message });
                }
            }
        });
    }
    static getRoomById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const room = yield roomServices_1.RoomService.getRoomById(id);
                res.status(200).json({
                    message: 'Lấy thông tin phòng thành công',
                    room: {
                        _id: room._id.toString(),
                        cinemaId: room.cinemaId,
                        roomNumber: room.roomNumber,
                        capacity: room.capacity,
                    },
                });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Lỗi khi lấy thông tin phòng', error: message });
                }
            }
        });
    }
    static updateRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { roomNumber } = req.body;
                const updatedRoom = yield roomServices_1.RoomService.updateRoom(id, roomNumber);
                if (!updatedRoom) {
                    res.status(404).json({ message: 'Không tìm thấy phòng' });
                    return;
                }
                res.status(200).json({
                    message: 'Cập nhật phòng thành công',
                    room: {
                        _id: updatedRoom._id.toString(),
                        cinemaId: updatedRoom.cinemaId,
                        roomNumber: updatedRoom.roomNumber,
                        capacity: updatedRoom.capacity,
                    },
                });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('không hợp lệ') || message.includes('đã tồn tại') || message.includes('Không tìm thấy')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Lỗi khi cập nhật phòng', error: message });
                }
            }
        });
    }
    static deleteRoom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deletedRoom = yield roomServices_1.RoomService.deleteRoom(id);
                if (!deletedRoom) {
                    res.status(404).json({ message: 'Không tìm thấy phòng' });
                    return;
                }
                res.status(200).json({
                    message: 'Xóa phòng thành công',
                    room: {
                        _id: deletedRoom._id.toString(),
                        cinemaId: deletedRoom.cinemaId,
                        roomNumber: deletedRoom.roomNumber,
                        capacity: deletedRoom.capacity,
                    },
                });
            }
            catch (error) {
                const message = error.message;
                if (message.includes('không hợp lệ') || message.includes('Không tìm thấy') || message.includes('suất chiếu')) {
                    res.status(400).json({ message });
                }
                else {
                    res.status(500).json({ message: 'Lỗi khi xóa phòng', error: message });
                }
            }
        });
    }
}
exports.RoomController = RoomController;
