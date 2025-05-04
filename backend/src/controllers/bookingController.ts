import { Request, Response } from "express"
import { BookingService } from "../services/bookingServices"
import { IBooking } from "../models/bookingModel"
import mongoose from "mongoose"

export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    let { showtimeId, seatIds } = req.body
    console.log("Input:", { showtimeId, seatIds, userId })

    // Parse showtimeId nếu là chuỗi JSON
    try {
      if (typeof showtimeId === "string" && showtimeId.startsWith("{")) {
        showtimeId = JSON.parse(showtimeId)._id
      }
    } catch (error) {
      res
        .status(400)
        .json({ message: "showtimeId không hợp lệ hoặc định dạng sai" })
      return
    }

    // Kiểm tra dữ liệu đầu vào
    if (!showtimeId || !Array.isArray(seatIds) || seatIds.length === 0) {
      res.status(400).json({
        message: "Thiếu hoặc sai định dạng dữ liệu: showtimeId, seatIds",
      })
      return
    }
    if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
      res.status(400).json({ message: "showtimeId không hợp lệ" })
      return
    }
    for (const seatId of seatIds) {
      try {
        const parsedSeatId = seatId.startsWith("{")
          ? JSON.parse(seatId)._id
          : seatId
        if (!mongoose.Types.ObjectId.isValid(parsedSeatId)) {
          res.status(400).json({ message: `seatId ${seatId} không hợp lệ` })
          return
        }
      } catch (error) {
        res
          .status(400)
          .json({ message: `seatId ${seatId} không hợp lệ hoặc định dạng sai` })
        return
      }
    }

    const { booking, totalPrice, details } = await BookingService.createBooking(
      userId,
      showtimeId,
      seatIds
    )
    res.status(201).json({
      message: "Đặt vé thành công",
      booking: {
        _id: booking._id.toString(),
        userId: booking.userId?.toString(),
        movieId: booking.movieId,
        showtimeId: booking.showtimeId.toString(),
        seatIds: booking.seatIds.map((id) => id.toString()),
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
        seats: details.seats.map((seat) => ({
          seatNumber: seat.seatNumber,
          row: seat.row,
          column: seat.column,
        })),
        showtime: {
          startTime: details.showtime.startTime,
          endTime: details.showtime.endTime,
        },
      },
    })
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message || "Lỗi khi đặt vé" })
  }
}

export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const role = req.user!.role
    if (role !== "admin") {
      res
        .status(403)
        .json({ message: "Chỉ admin được phép xem tất cả bookings" })
      return
    }

    const bookings = await BookingService.getAllBookings()

    res.status(200).json({
      message: "Lấy danh sách tất cả bookings thành công",
      bookings: bookings.map((booking) => ({
        _id: booking._id.toString(),
        userId: booking.userId?.toString() || null,
        movieId: booking.movieId,
        movieTitle: (booking as any).movieTitle || "Unknown",
        showtimeId: getIdString(booking.showtimeId),
        showtime: {
          startTime: (booking.showtimeId as any)?.startTime || null,
          endTime: (booking.showtimeId as any)?.endTime || null,
          price: (booking.showtimeId as any)?.price || 0,
        },
        seatIds: (booking.seatIds || [])
          .map((seat) => getIdString(seat))
          .filter(Boolean),
        seats: (booking.seatIds || [])
          .filter((seat) => seat && (seat as any).seatId)
          .map((seat) => ({
            seatId: seat._id.toString(),
            seatNumber: (seat as any).seatId?.seatNumber || "Unknown",
            row: (seat as any).seatId?.row || "Unknown",
            column: (seat as any).seatId?.column || 0,
          })),
        totalPrice: booking.totalPrice || 0,
        status: booking.status || "unknown",
      })),
    })
  } catch (error) {
    console.error("Error in getAllBookings:", error)
    res.status(400).json({
      message: (error as Error).message || "Lỗi khi lấy danh sách bookings",
    })
  }
}
// Hàm hỗ trợ lấy ID dạng chuỗi
function getIdString(input: any): string {
  if (!input) return ""
  if (typeof input === "string") {
    if (input.startsWith("{")) {
      try {
        return JSON.parse(input)._id?.toString() || input
      } catch {
        return input
      }
    }
    return input
  }
  return input._id?.toString() || input.toString() || ""
}

export const getUserBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const bookings = await BookingService.getUserBookings(userId)

    res.status(200).json({
      message: "Lấy danh sách vé thành công",
      bookings: bookings.map((booking) => {
        const showtime = booking.showtimeId as any // Temporarily use any until types are fully defined
        const room = showtime?.roomId as any
        const cinema = room?.cinemaId as any

        return {
          _id: booking._id.toString(),
          userId: booking.userId?.toString() || null,
          movieId: booking.movieId,
          movieTitle: (booking as any).movieTitle || "Unknown",
          showtimeId: booking.showtimeId?._id.toString() || "",
          showtime: {
            startTime: showtime?.startTime || null,
            endTime: showtime?.endTime || null,
            price: showtime?.price || 0,
          },
          cinemaName: cinema?.name || "N/A",
          cinemaAddress: cinema?.address || "N/A",
          roomNumber: room?.roomNumber || "N/A",
          seatIds: (booking.seatIds || [])
            .map((seat) => seat._id.toString())
            .filter(Boolean),
          seats: (booking.seatIds || [])
            .filter((seat) => seat && (seat as any).seatId)
            .map((seat) => ({
              seatId: seat._id.toString(),
              seatNumber: (seat as any).seatId?.seatNumber || "Unknown",
              row: (seat as any).seatId?.row || "Unknown",
              column: (seat as any).seatId?.column || 0,
            })),
          totalPrice: booking.totalPrice || 0,
          status: booking.status || "unknown",
        }
      }),
    })
  } catch (error) {
    console.error("Error in getUserBookings:", error)
    res
      .status(400)
      .json({ message: (error as Error).message || "Lỗi khi lấy danh sách vé" })
  }
}

export const cancelBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { bookingId } = req.params
    if (!bookingId) {
      res.status(400).json({ message: "Thiếu bookingId" })
      return
    }

    await BookingService.cancelBooking(bookingId)
    res.status(200).json({ message: "Hủy booking thành công" })
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message || "Lỗi khi hủy booking" })
  }
}

export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const role = req.user!.role
    const { bookingId } = req.params
    if (!bookingId) {
      res.status(400).json({ message: "Thiếu bookingId" })
      return
    }

    await BookingService.deleteBooking(bookingId, userId, role)
    res.status(200).json({ message: "Xóa booking thành công" })
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message || "Lỗi khi xóa booking" })
  }
}
