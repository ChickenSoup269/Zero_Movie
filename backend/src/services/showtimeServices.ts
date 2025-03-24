import Showtime, { IShowtime } from '../models/showtimeModel';
import Room from '../models/roomModel';
import { ShowtimeSeatService } from './showtimeseatServices';
import mongoose from 'mongoose';

export class ShowtimeService {
  static async createShowtime(movieId: number, roomId: string, startTime: string, endTime: string): Promise<IShowtime> {
    // Kiểm tra đầu vào
    if (!movieId || !roomId || !startTime || !endTime) {
      throw new Error('movieId, roomId, startTime, endTime là bắt buộc');
    }

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      throw new Error('Room ID không hợp lệ');
    }

    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Không tìm thấy phòng');
    }

    // Kiểm tra thời gian
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      throw new Error('Thời gian không hợp lệ');
    }

    // Kiểm tra xung đột thời gian
    const conflictingShowtime = await Showtime.findOne({
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

    // Tạo suất chiếu
    const newShowtime = await Showtime.create({
      movieId,
      roomId,
      startTime: start,
      endTime: end,
    });

    // Khởi tạo 144 ghế trong ShowtimeSeat
    await ShowtimeSeatService.initializeSeats(newShowtime._id.toString(), roomId);

    return newShowtime;
  }

  static async getAllShowtimes(): Promise<IShowtime[]> {
    return await Showtime.find().populate('roomId');
  }
  

  static async getShowtimeById(id: string): Promise<IShowtime> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Showtime ID không hợp lệ');
    }
    const showtime = await Showtime.findById(id).populate('roomId');
    if (!showtime) {
      throw new Error('Không tìm thấy suất chiếu');
    }
    return showtime;
  }

  static async deleteShowtime(id: string): Promise<IShowtime | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Showtime ID không hợp lệ');
    }
    const showtime = await Showtime.findById(id);
    if (!showtime) {
      throw new Error('Không tìm thấy suất chiếu');
    }

    await ShowtimeSeatService.deleteSeatsByShowtime(id);
    return await Showtime.findByIdAndDelete(id);
  }
}