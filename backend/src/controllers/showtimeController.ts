import { Request, Response } from 'express';
import { ShowtimeService } from '../services/showtimeServices';
import mongoose from 'mongoose';

export const createShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId, roomId, startTime, endTime, price } = req.body;
    // Kiểm tra dữ liệu đầu vào
    if (!movieId || !roomId || !startTime || !endTime || price === undefined) {
      res.status(400).json({ message: 'Thiếu movieId, roomId, startTime, endTime, hoặc price' });
      return;
    }
    if (typeof movieId !== 'number') {
      res.status(400).json({ message: 'movieId phải là số' });
      return;
    }
    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      res.status(400).json({ message: 'roomId không hợp lệ' });
      return;
    }
    if (isNaN(new Date(startTime).getTime()) || isNaN(new Date(endTime).getTime())) {
      res.status(400).json({ message: 'startTime hoặc endTime không hợp lệ' });
      return;
    }
    if (typeof price !== 'number' || price < 0) {
      res.status(400).json({ message: 'price phải là số không âm' });
      return;
    }

    const newShowtime = await ShowtimeService.createShowtime(movieId, roomId, startTime, endTime, price);
    res.status(201).json({
      message: 'Tạo suất chiếu thành công',
      showtime: {
        _id: newShowtime._id.toString(),
        movieId: newShowtime.movieId,
        roomId: newShowtime.roomId.toString(),
        startTime: newShowtime.startTime.toISOString(),
        endTime: newShowtime.endTime.toISOString(),
        price: newShowtime.price,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi tạo suất chiếu' });
  }
};

export const getAllShowtimes = async (req: Request, res: Response): Promise<void> => {
  try {
    const showtimes = await ShowtimeService.getAllShowtimes();
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
  } catch (error) {
    const message = (error as Error).message;
    res.status(500).json({ message: 'Lỗi khi lấy danh sách suất chiếu', error: message });
  }
};


export const getShowtimeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Showtime ID không hợp lệ' });
      return;
    }

    const showtime = await ShowtimeService.getShowtimeById(id);
    res.status(200).json({
      message: 'Lấy thông tin suất chiếu thành công',
      showtime: {
        _id: showtime._id.toString(),
        movieId: showtime.movieId,
        roomId: showtime.roomId,
        startTime: showtime.startTime.toISOString(),
        endTime: showtime.endTime.toISOString(),
        price: showtime.price,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi lấy suất chiếu' });
  }
};

export const deleteShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: 'Showtime ID không hợp lệ' });
      return;
    }

    const deletedShowtime = await ShowtimeService.deleteShowtime(id);
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
        price: deletedShowtime.price,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi xóa suất chiếu' });
  }
};