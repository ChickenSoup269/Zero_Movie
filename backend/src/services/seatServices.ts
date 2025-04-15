import Seat, { ISeat } from '../models/seatModel';
import mongoose from 'mongoose';

export class SeatService {
  static async initializeSeatsForRoom(roomId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      throw new Error('Room ID không hợp lệ');
    }
    const existingSeats = await Seat.find({ roomId });
    if (existingSeats.length > 0) {
      throw new Error('Phòng đã có ghế');
    }
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    for (const row of rows) {
      for (let column = 1; column <= 18; column++) {
        seats.push({
          roomId: new mongoose.Types.ObjectId(roomId), // Chuyển thành ObjectId
          seatNumber: `${row}${column}`,
          row,
          column,
          type: 'standard',
        });
      }
    }
    try {
      const result = await Seat.insertMany(seats);
      console.log(`Inserted ${result.length} seats for roomId: ${roomId}`);
    } catch (error) {
      console.error(`Failed to insert seats for roomId: ${roomId}`, error);
      throw error;
    }
  }

  static async getSeatsByRoom(roomId: string): Promise<ISeat[]> {
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      throw new Error('Room ID không hợp lệ');
    }
    const seats = await Seat.find({ roomId });
    if (seats.length === 0) {
      throw new Error('Không tìm thấy ghế nào trong phòng này');
    }
    return seats;
  }
  // [GETBYID]
  static async getSeatById(id: string): Promise<ISeat> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Seat ID không hợp lệ');
    }
    const seat = await Seat.findById(id);
    if (!seat) {
      throw new Error('Không tìm thấy ghế');
    }
    return seat;
  }
  static async deleteSeat(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Seat ID không hợp lệ');
    }
    const seat = await Seat.findByIdAndDelete(id);
    if (!seat) {
      throw new Error('Không tìm thấy ghế');
    }
  }
  
}