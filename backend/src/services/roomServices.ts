import Room, { IRoom } from '../models/roomModel';
import Showtime from '../models/showtimeModel';
import mongoose from 'mongoose';
import { SeatService } from './seatServices';

export class RoomService {
  static async createRoom(cinemaId: string, roomNumber: string): Promise<IRoom> {
    if (!cinemaId || !roomNumber) {
      throw new Error('cinemaId và roomNumber là bắt buộc');
    }
    if (!mongoose.Types.ObjectId.isValid(cinemaId)) {
      throw new Error('Cinema ID không hợp lệ');
    }

    const cinema = await mongoose.model('Cinema').findById(cinemaId);
    if (!cinema) {
      throw new Error('Không tìm thấy rạp');
    }

    const existingRoom = await Room.findOne({ cinemaId, roomNumber });
    if (existingRoom) {
      throw new Error('Phòng đã tồn tại trong rạp này');
    }

    const newRoom = await Room.create({ cinemaId, roomNumber, capacity: 144 });
    await SeatService.initializeSeatsForRoom(newRoom._id.toString()); // Tạo 144 ghế
    return newRoom;
  }

  static async getAllRooms(cinemaId?: string): Promise<IRoom[]> {
    const query: any = {};
    if (cinemaId) {
      if (!mongoose.Types.ObjectId.isValid(cinemaId)) {
        throw new Error('Cinema ID không hợp lệ');
      }
      query.cinemaId = cinemaId;
    }
    return await Room.find(query);
  }

  static async getRoomById(id: string): Promise<IRoom> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Room ID không hợp lệ');
    }
    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Không tìm thấy phòng');
    }
    return room;
  }

  static async updateRoom(id: string, roomNumber?: string): Promise<IRoom | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Room ID không hợp lệ');
    }
    if (!roomNumber) {
      throw new Error('Cần cung cấp roomNumber để cập nhật');
    }

    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Không tìm thấy phòng');
    }

    if (roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({ cinemaId: room.cinemaId, roomNumber });
      if (existingRoom) {
        throw new Error('Phòng với số này đã tồn tại trong rạp');
      }
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { roomNumber },
      { new: true, runValidators: true }
    );
    return updatedRoom;
  }

  static async deleteRoom(id: string): Promise<IRoom | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Room ID không hợp lệ');
    }

    const room = await Room.findById(id);
    if (!room) {
      throw new Error('Không tìm thấy phòng');
    }

    const showtimes = await Showtime.find({ roomId: id });
    if (showtimes.length > 0) {
      throw new Error('Không thể xóa phòng vì đã có suất chiếu liên quan');
    }

    await mongoose.model('Seat').deleteMany({ roomId: id }); // Xóa ghế
    const deletedRoom = await Room.findByIdAndDelete(id);
    return deletedRoom;
  }
}