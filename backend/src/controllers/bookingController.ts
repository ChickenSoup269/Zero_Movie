import { Request, Response } from 'express';
import { BookingService } from '../services/bookingServices';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || null;
    const { movieId, showtimeId, seatIds } = req.body;
    const { booking, totalPrice } = await BookingService.createBooking(userId, movieId, showtimeId, seatIds);
    res.status(201).json({ message: 'Đặt vé thành công', booking, totalPrice });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi đặt vé' });
  }
};

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const bookings = await BookingService.getUserBookings(userId);
    res.status(200).json(bookings);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi lấy danh sách vé' });
  }
};

