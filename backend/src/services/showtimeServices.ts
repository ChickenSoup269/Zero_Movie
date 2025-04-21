import Showtime, { IShowtime } from '../models/showtimeModel';
import Room from '../models/roomModel';
import { ShowtimeSeatService } from './showtimeseatServices';
import { Movie } from '../models/movieModel';
import mongoose from 'mongoose';

export class ShowtimeService {
  static async createShowtime(movieId: number, roomId: string, startTime: string, endTime: string, price: number): Promise<IShowtime> {
    // Kiểm tra dữ liệu đầu vào
    if (!movieId || !roomId || !startTime || !endTime || price === undefined) {
      throw new Error('movieId, roomId, startTime, endTime, và price là bắt buộc');
    }

    // Kiểm tra roomId là ObjectId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      throw new Error('Room ID không hợp lệ');
    }

    // Kiểm tra phòng tồn tại
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Không tìm thấy phòng');
    }

    // Kiểm tra phim và trạng thái
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) {
      throw new Error('Không tìm thấy phim');
    }
    if (movie.status !== 'nowPlaying') {
      throw new Error('Chỉ phim có trạng thái nowPlaying mới được tạo suất chiếu');
    }

    // Kiểm tra thời gian
    const start = new Date(startTime);
    const end = new Date(endTime);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      throw new Error('Thời gian không hợp lệ');
    }

    // Kiểm tra xung đột suất chiếu
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
    const newShowtime = new Showtime({
      movieId,
      roomId,
      startTime: start,
      endTime: end,
      price,
    });

    try {
      await newShowtime.save(); // Lưu Showtime
      await ShowtimeSeatService.initializeSeats(newShowtime._id.toString(), roomId); // Tạo ghế
      return newShowtime;
    } catch (error) {
      await Showtime.findByIdAndDelete(newShowtime._id); // Rollback nếu lỗi
      throw error;
    }
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