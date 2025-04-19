import { Request, Response } from 'express';
import { BookingService } from '../services/bookingServices';
import { IBooking } from '../models/bookingModel';
import mongoose from 'mongoose';

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { movieId, showtimeId, seatIds } = req.body;
    if (!movieId || !showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      res.status(400).json({ message: 'Thiếu hoặc sai định dạng dữ liệu: movieId, showtimeId, seatIds' });
      return;
    }

    const { booking, totalPrice, details } = await BookingService.createBooking(userId, movieId, showtimeId, seatIds);
    res.status(201).json({
      message: 'Đặt vé thành công',
      booking: {
        _id: booking._id.toString(),
        userId: booking.userId?.toString(),
        movieId: booking.movieId,
        showtimeId: booking.showtimeId.toString(), // Chỉ lấy _id
        seatIds: booking.seatIds.map(id => id.toString()), // Chỉ lấy _id của ShowtimeSeat
        totalPrice: booking.totalPrice,
        status: booking.status,
      },
      totalPrice,
      details: {
        movie: {
          title: details.movie.title,
        },
        cinema: {
          name: details.cinema.name,
          address: details.cinema.address,
        },
        room: {
          roomNumber: details.room.roomNumber,
        },
        seats: details.seats.map(seat => ({
          seatNumber: seat.seatNumber,
          row: seat.row,
          column: seat.column,
        })),
        showtime: {
          startTime: details.showtime.startTime,
          endTime: details.showtime.endTime,
        },
      },
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

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const { bookingId } = req.params;
    if (!bookingId) {
      res.status(400).json({ message: 'Thiếu bookingId' });
      return;
    }

    await BookingService.deleteBooking(bookingId, userId, role);
    res.status(200).json({ message: 'Xóa booking thành công' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi xóa booking' });
  }
};