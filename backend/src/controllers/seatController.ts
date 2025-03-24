import { Request, Response } from 'express';
import { SeatService } from '../services/seatServices';

export class SeatController {
  // [GET] Seat by Room
  static async getSeatsByRoom(req: Request, res: Response): Promise<void> {
    try {
      const { roomId } = req.params;
      const seats = await SeatService.getSeatsByRoom(roomId);
      res.status(200).json({
        message: 'Lấy danh sách ghế thành công',
        seats: seats.map(seat => ({
          _id: seat._id.toString(),
          roomId: seat.roomId,
          seatNumber: seat.seatNumber,
          row: seat.row,
          column: seat.column,
          type: seat.type,
        })),
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message: 'Lỗi khi lấy danh sách ghế', error: message });
      }
    }
  }
  // [GET] by id
  static async getSeatById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const seat = await SeatService.getSeatById(id);
      res.status(200).json({
        message: 'Lấy thông tin ghế thành công',
        seat: {
          _id: seat._id.toString(),
          roomId: seat.roomId,
          seatNumber: seat.seatNumber,
          row: seat.row,
          column: seat.column,
          type: seat.type,
        },
      });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message: 'Lỗi khi lấy thông tin ghế', error: message });
      }
    }
  }
  // [DELETE]
  static async deleteSeat(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await SeatService.deleteSeat(id);
      res.status(200).json({ message: 'Xóa ghế thành công' });
    } catch (error) {
      const message = (error as Error).message;
      if (message.includes('không hợp lệ') || message.includes('Không tìm thấy')) {
        res.status(400).json({ message });
      } else {
        res.status(500).json({ message: 'Lỗi khi xóa ghế', error: message });
      }
    }
  }
  
}