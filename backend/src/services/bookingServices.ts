import mongoose from 'mongoose';
import Booking, { IBooking } from '../models/bookingModel'; // Import cả IBooking
import Showtime from '../models/showtimeModel';
import ShowtimeSeat from '../models/showtimeseatModel';
import  {Movie} from '../models/movieModel';

export class BookingService {
  static async createBooking(
    userId: string | null,
    movieId: number,
    showtimeId: string,
    seatIds: string[]
  ): Promise<{ booking: IBooking; totalPrice: number }> {
    if (!mongoose.Types.ObjectId.isValid(showtimeId) || seatIds.some(id => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error('Showtime ID hoặc Seat ID không hợp lệ');
    }

    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) throw new Error('Phim không tồn tại');

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime || showtime.movieId !== movieId) throw new Error('Suất chiếu không tồn tại hoặc không khớp với phim');

    const showtimeSeats = await ShowtimeSeat.find({ showtimeId, _id: { $in: seatIds } });
    if (showtimeSeats.length !== seatIds.length) throw new Error('Một số ghế không tồn tại trong suất chiếu này');
    if (showtimeSeats.some(seat => seat.status !== 'available')) throw new Error('Một số ghế đã được đặt');

    const totalPrice = showtime.price * seatIds.length;

    const booking = new Booking({
      userId: userId || null,
      movieId,
      showtimeId,
      seatIds,
      totalPrice,
      status: 'pending',
    });
    await booking.save();

    return { booking, totalPrice };
  }

  static async getUserBookings(userId: string): Promise<IBooking[]> {
    if (!userId) throw new Error('User ID không hợp lệ');
    const bookings = await Booking.find({ userId })
      .populate('movieId', 'title')
      .populate('showtimeId', 'startTime endTime price')
      .populate('seatIds', 'seatNumber row column');
    return bookings;
  }

  // Các hàm khác nếu có (confirmBooking, cancelBooking)
  static async confirmBooking(bookingId: string): Promise<IBooking> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) throw new Error('Booking ID không hợp lệ');

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const booking = await Booking.findById(bookingId).session(session);
      if (!booking || booking.status !== 'pending') throw new Error('Booking không hợp lệ hoặc đã được xử lý');

      const updatedSeats = await ShowtimeSeat.updateMany(
        { showtimeId: booking.showtimeId, _id: { $in: booking.seatIds }, status: 'available' },
        { $set: { status: 'booked' } },
        { session }
      );

      if (updatedSeats.matchedCount !== booking.seatIds.length) {
        throw new Error('Một số ghế đã được đặt bởi người khác');
      }

      booking.status = 'confirmed';
      await booking.save({ session });

      await session.commitTransaction();
      return booking;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) throw new Error('Booking ID không hợp lệ');
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'pending') return;
    booking.status = 'cancelled';
    await booking.save();
  }
}