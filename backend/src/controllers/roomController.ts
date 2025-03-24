import { Request, Response } from 'express';
import { RoomService } from '../services/roomServices';

export class RoomController {
  static async createRoom(req: Request, res: Response): Promise<void> {
    try {
      const { cinemaId, roomNumber } = req.body;
      const room = await RoomService.createRoom(cinemaId, roomNumber);
      res.status(201).json({
        message: 'Tạo phòng chiếu thành công',
        room: {
          _id: room._id.toString(),
          cinemaId: room.cinemaId,
          roomNumber: room.roomNumber,
          capacity: room.capacity,
        },
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('không hợp lệ') || message.includes('đã tồn tại') || message.includes('Không tìm thấy')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message: 'Lỗi khi tạo phòng chiếu', error: message });
      }
    }
  }

  static async getAllRooms(req: Request, res: Response): Promise<void> {
    try {
      const { cinemaId } = req.query;
      const rooms = await RoomService.getAllRooms(cinemaId as string);
      res.status(200).json({
        message: 'Lấy danh sách phòng thành công',
        rooms: rooms.map(room => ({
          _id: room._id.toString(),
          cinemaId: room.cinemaId,
          roomNumber: room.roomNumber,
          capacity: room.capacity,
        })),
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('không hợp lệ')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách phòng', error: message });
      }
    }
  }

  static async getRoomById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const room = await RoomService.getRoomById(id);
      res.status(200).json({
        message: 'Lấy thông tin phòng thành công',
        room: {
          _id: room._id.toString(),
          cinemaId: room.cinemaId,
          roomNumber: room.roomNumber,
          capacity: room.capacity,
        },
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin phòng', error: message });
      }
    }
  }

  static async updateRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { roomNumber } = req.body;
      const updatedRoom = await RoomService.updateRoom(id, roomNumber);
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
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('không hợp lệ') || message.includes('đã tồn tại') || message.includes('Không tìm thấy')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message: 'Lỗi khi cập nhật phòng', error: message });
      }
    }
  }

  static async deleteRoom(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedRoom = await RoomService.deleteRoom(id);
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
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('không hợp lệ') || message.includes('Không tìm thấy') || message.includes('suất chiếu')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message: 'Lỗi khi xóa phòng', error: message });
      }
    }
  }
}