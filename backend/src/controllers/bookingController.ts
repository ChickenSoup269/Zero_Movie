import { Request, Response } from 'express';
import { BookingService } from '../services/bookingServices';
import { IBooking } from '../models/bookingModel'; // Thêm import này (tùy chọn)

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { movieId, showtimeId, seatIds } = req.body;
    if (!movieId || !showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      res.status(400).json({ message: 'Thiếu hoặc sai định dạng dữ liệu: movieId, showtimeId, seatIds' });
      return;
    }

    const { booking, totalPrice } = await BookingService.createBooking(userId, movieId, showtimeId, seatIds);
    res.status(201).json({
      message: 'Đặt vé thành công',
      booking: {
        _id: booking._id.toString(),
        userId: booking.userId?.toString(),
        movieId: booking.movieId,
        showtimeId: booking.showtimeId.toString(),
        seatIds: booking.seatIds.map(id => id.toString()),
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
      totalPrice,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi đặt vé' });
  }
};

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const bookings = await BookingService.getUserBookings(userId);

    res.status(200).json({
      message: 'Lấy danh sách vé thành công',
      bookings: bookings.map(booking => ({
        _id: booking._id.toString(),
        userId: booking.userId?.toString(),
        movieId: booking.movieId,
        showtimeId: booking.showtimeId.toString(),
        seatIds: booking.seatIds.map(id => id.toString()),
        totalPrice: booking.totalPrice,
        status: booking.status,
      })),
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi lấy danh sách vé' });
  }
};

export const cancelBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      res.status(400).json({ message: 'Thiếu bookingId' });
      return;
    }

    await BookingService.cancelBooking(bookingId);
    res.status(200).json({ message: 'Hủy booking thành công' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi hủy booking' });
  }
};