import { Request, Response } from 'express';
import { ShowtimeService } from '../services/showtimeServices';

export const createShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { movieId, roomId, startTime, endTime } = req.body;
    const newShowtime = await ShowtimeService.createShowtime(movieId, roomId, startTime, endTime);
    res.status(201).json({
      message: 'Tạo suất chiếu thành công',
      showtime: {
        _id: newShowtime._id.toString(),
        movieId: newShowtime.movieId,
        roomId: newShowtime.roomId,
        startTime: newShowtime.startTime.toISOString(),
        endTime: newShowtime.endTime.toISOString(),
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(400).json({ message });
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
    const showtime = await ShowtimeService.getShowtimeById(id);
    res.status(200).json({
      message: 'Lấy thông tin suất chiếu thành công',
      showtime: {
        _id: showtime._id.toString(),
        movieId: showtime.movieId,
        roomId: showtime.roomId,
        startTime: showtime.startTime.toISOString(),
        endTime: showtime.endTime.toISOString(),
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(400).json({ message });
  }
};

export const deleteShowtime = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
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
      },
    });
  } catch (error) {
    const message = (error as Error).message;
    res.status(400).json({ message });
  }
};