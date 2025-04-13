import Booking from '../models/bookingModel';
import Showtime from '../models/showtimeModel';
import ShowtimeSeat from '../models/showtimeseatModel';
import { Movie } from '../models/movieModel';

export class BookingService {
  static async createBooking(userId: string | null, movieId: number, showtimeId: string, seatIds: string[]) {
    const movie = await Movie.findOne({ tmdbId: movieId });
    if (!movie) throw new Error('Phim không tồn tại');

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime || showtime.movieId !== movieId) throw new Error('Suất chiếu không tồn tại hoặc không khớp với phim');

    const showtimeSeats = await ShowtimeSeat.find({ showtimeId, seatId: { $in: seatIds } });
    if (showtimeSeats.length !== seatIds.length) throw new Error('Một số ghế không tồn tại trong suất chiếu này');
    const unavailableSeats = showtimeSeats.filter(seat => seat.status !== 'available');
    if (unavailableSeats.length > 0) throw new Error('Một số ghế đã được đặt');

    const totalPrice = showtime.price * seatIds.length; // Tính tổng giá

    const booking = new Booking({
      userId: userId || null,
      movieId,
      showtimeId,
      seatIds,
      totalPrice,
      status: 'pending',
    });
    await booking.save();

    return { booking, totalPrice }; // Trả về cả booking và totalPrice
  }

  static async getUserBookings(userId: string) {
    const bookings = await Booking.find({ userId })
      .populate('movieId', 'title')
      .populate('showtimeId', 'startTime endTime price')
      .populate('seatIds', 'seatNumber row column');
    return bookings;
  }

  static async confirmBooking(bookingId: string) {
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'pending') throw new Error('Booking không hợp lệ hoặc đã được xử lý');

    const updatedSeats = await ShowtimeSeat.updateMany(
      { showtimeId: booking.showtimeId, seatId: { $in: booking.seatIds }, status: 'available' },
      { $set: { status: 'booked' } }
    );

    if (updatedSeats.matchedCount !== booking.seatIds.length) {
      throw new Error('Một số ghế đã được đặt bởi người khác');
    }

    booking.status = 'confirmed';
    await booking.save();

    return booking;
  }
}