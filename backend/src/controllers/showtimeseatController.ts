import { Request, Response } from "express"
import { ShowtimeSeatService } from "../services/showtimeseatServices"

export const getSeatsByShowtime = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { showtimeId } = req.params
    const seats = await ShowtimeSeatService.getSeatsByShowtime(showtimeId)
    res.status(200).json({
      message: "Lấy danh sách ghế thành công",
      seats: seats.map((seat) => ({
        _id: seat._id.toString(),
        showtimeId: seat.showtimeId,
        seatId: seat.seatId._id.toString(),
        seatNumber: seat.seatId.seatNumber,
        status: seat.status,
      })),
    })
  } catch (error) {
    const message = (error as Error).message
    if (
      message.includes("không hợp lệ") ||
      message.includes("Không tìm thấy")
    ) {
      res.status(400).json({ message })
    } else {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy danh sách ghế", error: message })
    }
  }
}

export const updateSeatStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { showtimeId, seatId } = req.params
    const { status } = req.body
    const updatedSeat = await ShowtimeSeatService.updateSeatStatus(
      showtimeId,
      seatId,
      status
    )
    if (!updatedSeat) {
      res.status(404).json({ message: "Không tìm thấy ghế" })
      return
    }
    res.status(200).json({
      message: "Cập nhật trạng thái ghế thành công",
      seat: {
        _id: updatedSeat._id.toString(),
        showtimeId: updatedSeat.showtimeId,
        seatId: updatedSeat.seatId,
        status: updatedSeat.status,
      },
    })
  } catch (error) {
    const message = (error as Error).message
    if (
      message.includes("không hợp lệ") ||
      message.includes("Không tìm thấy")
    ) {
      res.status(400).json({ message })
    } else {
      res
        .status(500)
        .json({ message: "Lỗi khi cập nhật trạng thái ghế", error: message })
    }
  }
}
