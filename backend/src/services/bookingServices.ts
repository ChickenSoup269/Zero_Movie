import mongoose, { Document } from "mongoose"
import Booking, { IBooking } from "../models/bookingModel"
import Showtime from "../models/showtimeModel"
import ShowtimeSeat from "../models/showtimeseatModel"
import { Movie } from "../models/movieModel"
import Room from "../models/roomModel"
import Cinema from "../models/cinemaModel"
import Seat from "../models/seatModel"

// Define interface for seat details
interface SeatDetail {
  seatNumber: string
  row: string
  column: number
}

// Define interface for extended booking
interface ExtendedBooking extends IBooking {
  movieTitle?: string
  cinemaName?: string
  cinemaAddress?: string
  roomNumber?: string
  showtime?: {
    startTime: Date | null
    endTime: Date | null
    price: number
  }
  seats?: SeatDetail[]
}

export class BookingService {
  static async getAllBookings(): Promise<ExtendedBooking[]> {
    const bookings = await Booking.find({})
      .populate({
        path: "showtimeId",
        populate: {
          path: "roomId",
          populate: {
            path: "cinemaId",
            model: "Cinema",
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
      .lean()

    const processedBookings: ExtendedBooking[] = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const movie = await Movie.findOne({ tmdbId: booking.movieId })
          const showtime = booking.showtimeId as any
          const room = showtime?.roomId
          const cinema = room?.cinemaId

          const seatDetails: SeatDetail[] = (booking.seatIds || [])
            .filter((ss: any) => ss.seatId)
            .map((ss: any) => ({
              seatNumber: ss.seatId.seatNumber,
              row: ss.seatId.row,
              column: ss.seatId.column,
            }))

          return {
            ...booking,
            movieTitle: movie ? movie.title : "Unknown",
            showtime: showtime
              ? {
                  startTime: showtime.startTime,
                  endTime: showtime.endTime,
                  price: showtime.price,
                }
              : { startTime: null, endTime: null, price: 0 },
            cinemaName: cinema?.name || "N/A",
            cinemaAddress: cinema?.address || "N/A",
            roomNumber: room?.roomNumber || "N/A",
            seats: seatDetails,
          }
        } catch (error) {
          console.error(`Error processing booking ${booking._id}:`, error)
          return {
            ...booking,
            movieTitle: "Unknown",
            showtime: { startTime: null, endTime: null, price: 0 },
            cinemaName: "N/A",
            cinemaAddress: "N/A",
            roomNumber: "N/A",
            seats: [],
          }
        }
      })
    )

    return processedBookings
  }

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
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      // Parse and validate showtimeId
      const parsedShowtimeId = showtimeId.startsWith("{")
        ? JSON.parse(showtimeId)._id
        : showtimeId
      if (!mongoose.Types.ObjectId.isValid(parsedShowtimeId)) {
        throw new Error("Showtime ID không hợp lệ")
      }

      // Parse and validate seatIds
      const parsedSeatIds = seatIds.map((id) =>
        id.startsWith("{") ? JSON.parse(id)._id : id
      )
      if (parsedSeatIds.some((id) => !mongoose.Types.ObjectId.isValid(id))) {
        throw new Error("Seat ID không hợp lệ")
      }

      // Find showtime and validate
      const showtime = await Showtime.findById(parsedShowtimeId)
        .populate({
          path: "roomId",
          populate: { path: "cinemaId" },
        })
        .session(session)
      if (!showtime) throw new Error("Suất chiếu không tồn tại")
      if (!showtime.startTime || !showtime.endTime) {
        throw new Error("Suất chiếu không có thời gian hợp lệ")
      }
      if (showtime.price <= 0) {
        throw new Error("Giá vé không hợp lệ")
      }
      if (showtime.startTime < new Date()) {
        throw new Error("Không thể đặt vé cho suất chiếu đã qua")
      }

      // Find movie
      const movie = await Movie.findOne({ tmdbId: showtime.movieId }).session(
        session
      )
      if (!movie) throw new Error("Phim không tồn tại")
      if (movie.status !== "nowPlaying") {
        throw new Error('Chỉ phim có trạng thái "nowPlaying" mới được đặt vé')
      }

      // Validate seats
      const showtimeSeats = await ShowtimeSeat.find({
        showtimeId: parsedShowtimeId,
        _id: { $in: parsedSeatIds },
      }).session(session)
      if (showtimeSeats.length !== parsedSeatIds.length) {
        throw new Error("Một số ghế không tồn tại")
      }
      if (showtimeSeats.some((seat) => seat.status !== "available")) {
        throw new Error("Một số ghế đã được đặt")
      }

      // Update seat status to reserved
      await ShowtimeSeat.updateMany(
        {
          showtimeId: parsedShowtimeId,
          _id: { $in: parsedSeatIds },
          status: "available",
        },
        { $set: { status: "reserved" } },
        { session }
      )

      // Find room and cinema
      const room = await Room.findById(showtime.roomId).session(session)
      if (!room) throw new Error("Phòng chiếu không tồn tại")
      const cinema = await Cinema.findById(room.cinemaId).session(session)
      if (!cinema) throw new Error("Rạp không tồn tại")

      // Find seat details
      const seats = await Seat.find({
        _id: { $in: showtimeSeats.map((s) => s.seatId) },
      }).session(session)
      if (seats.length !== parsedSeatIds.length) {
        throw new Error("Không tìm thấy thông tin ghế")
      }

      // Calculate total price
      const totalPrice = showtime.price * parsedSeatIds.length

      // Create booking
      const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000)
      const booking = new Booking({
        userId: userId || null,
        movieId: showtime.movieId,
        showtimeId: parsedShowtimeId,
        seatIds: parsedSeatIds,
        totalPrice,
        status: "pending",
        expiresAt,
      })
      await booking.save({ session })

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

      await session.commitTransaction()
      return { booking, totalPrice, details }
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  static async getUserBookings(userId: string): Promise<ExtendedBooking[]> {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("User ID không hợp lệ")
    }

    const bookingsData = await Booking.find({ userId })
      .populate({
        path: "showtimeId",
        populate: {
          path: "roomId",
          populate: {
            path: "cinemaId",
            model: "Cinema",
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
      .lean()

    const processedBookings: ExtendedBooking[] = await Promise.all(
      bookingsData.map(async (booking) => {
        try {
          const showtime = booking.showtimeId as any
          const room = showtime?.roomId
          const cinema = room?.cinemaId

          const movie = await Movie.findOne({ tmdbId: booking.movieId })

          const seatDetails: SeatDetail[] = (booking.seatIds || [])
            .filter((ss: any) => ss.seatId)
            .map((ss: any) => ({
              seatNumber: ss.seatId.seatNumber,
              row: ss.seatId.row,
              column: ss.seatId.column,
            }))

          return {
            ...booking,
            movieTitle: movie ? movie.title : "Unknown",
            showtime: showtime
              ? {
                  startTime: showtime.startTime,
                  endTime: showtime.endTime,
                  price: showtime.price,
                }
              : { startTime: null, endTime: null, price: 0 },
            cinemaName: cinema?.name || "N/A",
            cinemaAddress: cinema?.address || "N/A",
            roomNumber: room?.roomNumber || "N/A",
            seats: seatDetails,
          }
        } catch (error) {
          console.error(`Error processing booking ${booking._id}:`, error)
          return {
            ...booking,
            movieTitle: "Unknown",
            showtime: { startTime: null, endTime: null, price: 0 },
            cinemaName: "N/A",
            cinemaAddress: "N/A",
            roomNumber: "N/A",
            seats: [],
          }
        }
      })
    )

    return processedBookings
  }

  static async confirmBooking(bookingId: string): Promise<IBooking> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Booking ID không hợp lệ")
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const booking = await Booking.findById(bookingId).session(session)
      if (!booking || booking.status !== "pending") {
        throw new Error("Booking không hợp lệ hoặc đã được xử lý")
      }

      const showtime = await Showtime.findById(booking.showtimeId).session(
        session
      )
      if (!showtime) throw new Error("Suất chiếu không tồn tại")

      const updatedSeats = await ShowtimeSeat.updateMany(
        {
          showtimeId: booking.showtimeId,
          _id: { $in: booking.seatIds },
          status: "reserved",
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
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Booking ID không hợp lệ")
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const booking = await Booking.findById(bookingId).session(session)
      if (!booking || booking.status !== "pending") {
        throw new Error("Booking không hợp lệ hoặc đã được xử lý")
      }

      await ShowtimeSeat.updateMany(
        {
          showtimeId: booking.showtimeId,
          _id: { $in: booking.seatIds },
          status: "reserved",
        },
        { $set: { status: "available" } },
        { session }
      )

      booking.status = "cancelled"
      booking.expiresAt = undefined
      await booking.save({ session })

      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }

  static async deleteBooking(
    bookingId: string,
    userId: string,
    role: string
  ): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
      throw new Error("Booking ID không hợp lệ")
    }

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const query =
        role === "admin" ? { _id: bookingId } : { _id: bookingId, userId }
      const booking = await Booking.findOne(query).session(session)
      if (!booking) {
        throw new Error("Không tìm thấy booking hoặc bạn không có quyền xóa")
      }

      if (booking.status === "pending") {
        await ShowtimeSeat.updateMany(
          {
            showtimeId: booking.showtimeId,
            _id: { $in: booking.seatIds },
            status: "reserved",
          },
          { $set: { status: "available" } },
          { session }
        )
      }

      await Booking.deleteOne({ _id: bookingId }, { session })
      await session.commitTransaction()
    } catch (error) {
      await session.abortTransaction()
      throw error
    } finally {
      session.endSession()
    }
  }
}
