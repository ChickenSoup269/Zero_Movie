import mongoose from "mongoose"
import Booking, { IBooking } from "../models/bookingModel" // Import cả IBooking
import Showtime from "../models/showtimeModel"
import ShowtimeSeat from "../models/showtimeseatModel"
import { Movie } from "../models/movieModel"
import Room from "../models/roomModel"
import Cinema from "../models/cinemaModel"
import Seat from "../models/seatModel"

export class BookingService {
  static async createBooking(
    userId: string | null,
    showtimeId: string,
    seatIds: string[]
  ): Promise<{
    booking: IBooking
    totalPrice: number
    details: {
      movie: { title: string }
      cinema: { name: string; address: string }
      room: { roomNumber: string }
      seats: { seatNumber: string; row: string; column: number }[]
      showtime: { startTime: Date; endTime: Date }
    }
  }> {
    // Parse showtimeId
    const parsedShowtimeId = showtimeId.startsWith("{")
      ? JSON.parse(showtimeId)._id
      : showtimeId
    if (!mongoose.Types.ObjectId.isValid(parsedShowtimeId)) {
      throw new Error("Showtime ID không hợp lệ")
    }

    // Parse seatIds
    const parsedSeatIds = seatIds.map((id) =>
      id.startsWith("{") ? JSON.parse(id)._id : id
    )
    if (parsedSeatIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
      throw new Error("Seat ID không hợp lệ")
    }

    // Tìm suất chiếu
    const showtime = await Showtime.findById(parsedShowtimeId).populate(
      "roomId"
    )
    if (!showtime) throw new Error("Suất chiếu không tồn tại")

    // Lấy movieId từ showtime
    const movieId = showtime.movieId
    const movie = await Movie.findOne({ tmdbId: movieId })
    if (!movie) throw new Error("Phim không tồn tại")

    // Kiểm tra trạng thái phim
    if (movie.status !== "nowPlaying") {
      throw new Error('Chỉ phim có trạng thái "nowPlaying" mới được đặt vé')
    }

    // Kiểm tra ghế
    const showtimeSeats = await ShowtimeSeat.find({
      showtimeId: parsedShowtimeId,
      _id: { $in: parsedSeatIds },
    })
    if (showtimeSeats.length !== parsedSeatIds.length)
      throw new Error("Ghế không tồn tại")
    if (showtimeSeats.some((seat) => seat.status !== "available"))
      throw new Error("Ghế đã được đặt")

    // Lấy phòng và rạp
    const room = await Room.findById(showtime.roomId).populate("cinemaId")
    if (!room) throw new Error("Phòng chiếu không tồn tại")
    const cinema = await Cinema.findById(room.cinemaId)
    if (!cinema) throw new Error("Rạp không tồn tại")

    // Lấy thông tin ghế
    const seats = await Seat.find({
      _id: { $in: showtimeSeats.map((s) => s.seatId) },
    })
    if (seats.length !== parsedSeatIds.length)
      throw new Error("Không tìm thấy ghế")

    // Tính tổng giá
    const totalPrice = showtime.price * parsedSeatIds.length
    // Tạo booking với expiresAt (2 tiếng sau)
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
    // Tạo booking
    const booking = new Booking({
      userId: userId || null,
      movieId,
      showtimeId: parsedShowtimeId,
      seatIds: parsedSeatIds,
      totalPrice,
      status: "pending",
      expiresAt,
    })
    await booking.save()

    const details = {
      movie: { title: movie.title },
      cinema: { name: cinema.name, address: cinema.address },
      room: { roomNumber: room.roomNumber },
      seats: seats.map((seat) => ({
        seatNumber: seat.seatNumber,
        row: seat.row,
        column: seat.column,
      })),
      showtime: {
        startTime: showtime.startTime,
        endTime: showtime.endTime,
      },
    }

    return { booking, totalPrice, details }
  }

  static async getUserBookings(userId: string): Promise<IBooking[]> {
    if (!userId) throw new Error("User ID không hợp lệ")

    const bookings = await Booking.find({ userId })
      .populate({
        path: "showtimeId",
        select: "startTime endTime price movieId roomId",
        populate: {
          path: "roomId",
          select: "roomNumber cinemaId",
          populate: {
            path: "cinemaId",
            select: "name address",
          },
        },
      })
      .populate({
        path: "seatIds",
        populate: {
          path: "seatId",
          model: "Seat",
          select: "seatNumber row column",
        },
      })

    // Lấy thông tin phim
    for (const booking of bookings) {
      const movie = await Movie.findOne({ tmdbId: booking.movieId })
      ;(booking as any).movieTitle = movie ? movie.title : "Unknown"
    }

    return bookings
  }

  static async confirmBooking(bookingId: string): Promise<IBooking> {
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new Error("Booking ID không hợp lệ")

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const booking = await Booking.findById(bookingId).session(session)
      if (!booking || booking.status !== "pending")
        throw new Error("Booking không hợp lệ hoặc đã được xử lý")

      const updatedSeats = await ShowtimeSeat.updateMany(
        {
          showtimeId: booking.showtimeId,
          _id: { $in: booking.seatIds },
          status: "available",
        },
        { $set: { status: "booked" } },
        { session }
      )

      if (updatedSeats.matchedCount !== booking.seatIds.length) {
        throw new Error("Một số ghế đã được đặt bởi người khác")
      }

      booking.status = "confirmed"
      booking.expiresAt = undefined
      await booking.save({ session })

      await session.commitTransaction()
      return booking
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  static async cancelBooking(bookingId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new Error("Booking ID không hợp lệ")
    const booking = await Booking.findById(bookingId)
    if (!booking || booking.status !== "pending") return
    booking.status = "cancelled"
    booking.expiresAt = undefined
    await booking.save()
  }
  static async deleteBooking(
    bookingId: string,
    userId: string,
    role: string
  ): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new Error("Booking ID không hợp lệ")

    // Tìm và xóa booking, chỉ cho phép chủ booking hoặc admin xóa
    const query =
      role === "admin" ? { _id: bookingId } : { _id: bookingId, userId }
    const result = await Booking.deleteOne(query)

    if (result.deletedCount === 0) {
      throw new Error("Không tìm thấy booking hoặc bạn không có quyền xóa")
    }
  }
}
