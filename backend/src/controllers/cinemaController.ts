import { Request, Response } from "express"
import { CinemaService } from "../services/cinemaServices"

export const getAllCinemas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const cinemas = await CinemaService.getAllCinemas()
    res.status(200).json({
      message: "Lấy danh sách rạp thành công",
      cinemas: cinemas.map((cinema) => ({
        _id: cinema._id.toString(),
        name: cinema.name,
        address: cinema.address,
        createdAt: cinema.createdAt?.toISOString(),
        updatedAt: cinema.updatedAt?.toISOString(),
      })),
    })
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Lỗi khi lấy danh sách rạp",
        error: (error as Error).message,
      })
  }
}

export const getCinemaById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const cinema = await CinemaService.getCinemaById(id)
    if (!cinema) {
      res.status(404).json({ message: "Không tìm thấy rạp" })
      return
    }
    res.status(200).json({
      message: "Lấy thông tin rạp thành công",
      cinema: {
        _id: cinema._id.toString(),
        name: cinema.name,
        address: cinema.address,
        createdAt: cinema.createdAt?.toISOString(),
        updatedAt: cinema.updatedAt?.toISOString(),
      },
    })
  } catch (error) {
    const message = (error as Error).message
    if (message === "ID rạp không hợp lệ") {
      res.status(400).json({ message })
    } else if (message === "Không tìm thấy rạp") {
      res.status(404).json({ message })
    } else {
      res
        .status(500)
        .json({ message: "Lỗi khi lấy thông tin rạp", error: message })
    }
  }
}

export const getShowtimesByCinemaId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { date, movieId, includePast } = req.query;
    const result = await CinemaService.getShowtimesByCinemaId(
      id,
      date as string,
      movieId as string,
      includePast === 'true' 
    );
    res.status(200).json({
      message: 'Lấy danh sách suất chiếu theo rạp thành công',
      cinema: result.cinema,
      showtimes: result.showtimes,
    });
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'ID rạp không hợp lệ') {
      res.status(400).json({ message });
    } else if (message === 'Không tìm thấy rạp') {
      res.status(404).json({ message });
    } else if (message === 'Định dạng ngày không hợp lệ (dùng YYYY-MM-DD)') {
      res.status(400).json({ message });
    } else {
      res
        .status(500)
        .json({ message: 'Lỗi khi lấy danh sách suất chiếu', error: message });
    }
  }
};

export const createCinema = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, address } = req.body
    const newCinema = await CinemaService.createCinema(name, address)
    res.status(201).json({
      message: "Tạo rạp thành công",
      cinema: {
        _id: newCinema._id.toString(),
        name: newCinema.name,
        address: newCinema.address,
        createdAt: newCinema.createdAt?.toISOString(),
        updatedAt: newCinema.updatedAt?.toISOString(),
      },
    })
  } catch (error) {
    const message = (error as Error).message
    if (message === "Tên rạp và địa chỉ là bắt buộc") {
      res.status(400).json({ message })
    } else if (message === "Địa chỉ rạp đã tồn tại") {
      res.status(409).json({ message })
    } else {
      res.status(500).json({ message: "Lỗi khi tạo rạp", error: message })
    }
  }
}

export const updateCinema = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const { name, address } = req.body
    const updatedCinema = await CinemaService.updateCinema(id, name, address)
    if (!updatedCinema) {
      res.status(404).json({ message: "Không tìm thấy rạp để cập nhật" })
      return
    }
    res.status(200).json({
      message: "Cập nhật rạp thành công",
      cinema: {
        _id: updatedCinema._id.toString(),
        name: updatedCinema.name,
        address: updatedCinema.address,
        createdAt: updatedCinema.createdAt?.toISOString(),
        updatedAt: updatedCinema.updatedAt?.toISOString(),
      },
    })
  } catch (error) {
    const message = (error as Error).message
    if (message === "ID rạp không hợp lệ") {
      res.status(400).json({ message })
    } else if (
      message ===
      "Cần cung cấp ít nhất một trường để cập nhật (name hoặc address)"
    ) {
      res.status(400).json({ message })
    } else if (message === "Không tìm thấy rạp để cập nhật") {
      res.status(404).json({ message })
    } else if (message === "Địa chỉ rạp đã tồn tại") {
      res.status(409).json({ message })
    } else {
      res.status(500).json({ message: "Lỗi khi cập nhật rạp", error: message })
    }
  }
}

export const deleteCinema = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params
    const deletedCinema = await CinemaService.deleteCinema(id)
    if (!deletedCinema) {
      res.status(404).json({ message: "Không tìm thấy rạp để xóa" })
      return
    }
    res.status(200).json({
      message: "Xóa rạp và dữ liệu liên quan thành công",
      cinema: {
        _id: deletedCinema._id.toString(),
        name: deletedCinema.name,
        address: deletedCinema.address,
        createdAt: deletedCinema.createdAt?.toISOString(),
        updatedAt: deletedCinema.updatedAt?.toISOString(),
      },
    })
  } catch (error) {
    const message = (error as Error).message
    if (message === "ID rạp không hợp lệ") {
      res.status(400).json({ message })
    } else if (message === "Không tìm thấy rạp để xóa") {
      res.status(404).json({ message })
    } else {
      res.status(500).json({ message: "Lỗi khi xóa rạp", error: message })
    }
  }
}
