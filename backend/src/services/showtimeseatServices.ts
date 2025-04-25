import ShowtimeSeat, { IShowtimeSeat } from "../models/showtimeseatModel"
import Seat, { ISeat } from "../models/seatModel"
import Showtime from "../models/showtimeModel"
import mongoose from "mongoose"

// Định nghĩa interface cho kết quả sau populate
export interface IPopulatedShowtimeSeat extends Omit<IShowtimeSeat, "seatId"> {
  seatId: ISeat
}

export class ShowtimeSeatService {
  // Khởi tạo 144 ghế cho suất chiếu
  static async initializeSeats(
    showtimeId: string,
    roomId: string
  ): Promise<void> {
    if (
      !mongoose.Types.ObjectId.isValid(showtimeId) ||
      !mongoose.Types.ObjectId.isValid(roomId)
    ) {
      throw new Error("Showtime ID hoặc Room ID không hợp lệ")
    }

    const showtime = await Showtime.findById(showtimeId)
    if (!showtime) {
      throw new Error("Không tìm thấy suất chiếu")
    }

    const seats = await Seat.find({ roomId })
    if (seats.length !== 144) {
      throw new Error("Phòng không có đủ 144 ghế")
    }

    const showtimeSeats = seats.map((seat) => ({
      showtimeId,
      seatId: seat._id.toString(),
      status: "available",
    }))
    await ShowtimeSeat.insertMany(showtimeSeats)
  }

  // [GET] seatbyshowtime
  static async getSeatsByShowtime(
    showtimeId: string
  ): Promise<IPopulatedShowtimeSeat[]> {
    if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
      throw new Error("Showtime ID không hợp lệ")
    }
    const showtime = await Showtime.findById(showtimeId)
    if (!showtime) {
      throw new Error("Không tìm thấy suất chiếu")
    }

    // Sửa lỗi bằng cách ép kiểu qua unknown
    const seats = await ShowtimeSeat.find({ showtimeId }).populate("seatId")
    return seats as unknown as IPopulatedShowtimeSeat[]
  }
  // [Delete] when showtime expired
  static async cleanUpExpiredShowtimes(): Promise<void> {
    const now = new Date()
    const expiredShowtimes = await Showtime.find({ endTime: { $lt: now } })
    for (const showtime of expiredShowtimes) {
      const deletedCount = await ShowtimeSeat.deleteMany({
        showtimeId: showtime._id.toString(),
      })
      console.log(
        `Đã xóa ${deletedCount.deletedCount} ShowtimeSeat cho showtime ${showtime._id}`
      )
    }
  }
  // UPDATE
  static async updateSeatStatus(
    showtimeId: string,
    seatId: string,
    status: "available" | "booked" | "reserved"
  ): Promise<IShowtimeSeat | null> {
    if (
      !mongoose.Types.ObjectId.isValid(showtimeId) ||
      !mongoose.Types.ObjectId.isValid(seatId)
    ) {
      throw new Error("Showtime ID hoặc Seat ID không hợp lệ")
    }

    const showtimeSeat = await ShowtimeSeat.findOne({ showtimeId, seatId })
    if (!showtimeSeat) {
      throw new Error("Không tìm thấy trạng thái ghế cho suất chiếu này")
    }

    showtimeSeat.status = status
    return await showtimeSeat.save()
  }

  //DELETE
  static async deleteSeatsByShowtime(showtimeId: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
      throw new Error("Showtime ID không hợp lệ")
    }
    await ShowtimeSeat.deleteMany({ showtimeId })
  }
}
