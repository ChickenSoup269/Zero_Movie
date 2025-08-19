import Cinema, { ICinema } from "../models/cinemaModel"
import Room from "../models/roomModel"
import Showtime from "../models/showtimeModel"
import Seat from "../models/seatModel"
import ShowtimeSeat from "../models/showtimeseatModel"
import mongoose from "mongoose"

export class CinemaService {
  // GET ALL
  static async getAllCinemas(): Promise<ICinema[]> {
    return await Cinema.find()
  }

  // GET BY ID
  static async getCinemaById(id: string): Promise<ICinema | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID rạp không hợp lệ")
    }
    const cinema = await Cinema.findById(id)
    if (!cinema) {
      throw new Error("Không tìm thấy rạp")
    }
    return cinema
  }

  // GET SHOWTIME BY CINEMA
  static async getShowtimesByCinemaId(
    id: string,
    date?: string,
    movieId?: string,
    includePast: boolean = false //Optione: Admin
  ): Promise<any> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('ID rạp không hợp lệ');
    }

    const cinema = await Cinema.findById(id);
    if (!cinema) {
      throw new Error('Không tìm thấy rạp');
    }

    const rooms = await Room.find({ cinemaId: id });
    const roomIds = rooms.map((room) => room._id.toString());

    const query: any = { roomId: { $in: roomIds } };

    // Lọc theo ngày nếu có
    if (date) {
      const startOfDay = new Date(date);
      if (isNaN(startOfDay.getTime())) {
        throw new Error('Định dạng ngày không hợp lệ (dùng YYYY-MM-DD)');
      }
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      query.startTime = { $gte: startOfDay, $lt: endOfDay };
    }
    if (movieId) {
      query.movieId = Number(movieId);
    }

    // Lọc thời hạn suất chiếu: chỉ suất chưa qua (mặc định)
    const currentTime = new Date();
    if (!includePast) {
      if (query.startTime) {
        query.startTime.$gte = new Date(Math.max(query.startTime.$gte.getTime(), currentTime.getTime()));
      } else {
        query.startTime = { $gte: currentTime };
      }
    }

    const showtimes = await Showtime.find(query).populate('roomId');
    const formattedShowtimes = await Promise.all(
      showtimes.map(async (showtime) => {
        const room = showtime.roomId as any;
        const movie = await mongoose
          .model('Movie')
          .findOne({ tmdbId: showtime.movieId });
        return {
          _id: showtime._id.toString(),
          movieId: showtime.movieId,
          movieTitle: movie?.title,
          roomId: room._id.toString(),
          roomNumber: room.roomNumber,
          startTime: showtime.startTime.toISOString(),
          endTime: showtime.endTime.toISOString(),
          price: showtime.price, 
        };
      })
    );

    return {
      cinema: {
        _id: cinema._id.toString(),
        name: cinema.name,
        address: cinema.address,
        createdAt: cinema.createdAt?.toISOString(),
        updatedAt: cinema.updatedAt?.toISOString(),
      },
      showtimes: formattedShowtimes,
    };
  }

  // CREATE
  static async createCinema(name: string, address: string): Promise<ICinema> {
    if (!name || !address) {
      throw new Error("Tên rạp và địa chỉ là bắt buộc")
    }
    try {
      const newCinema = await Cinema.create({ name, address })
      return newCinema
    } catch (error) {
      if ((error as any).code === 11000) {
        throw new Error("Địa chỉ rạp đã tồn tại")
      }
      throw error
    }
  }

  // UPDATE
  static async updateCinema(
    id: string,
    name?: string,
    address?: string
  ): Promise<ICinema | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID rạp không hợp lệ")
    }
    if (!name && !address) {
      throw new Error(
        "Cần cung cấp ít nhất một trường để cập nhật (name hoặc address)"
      )
    }

    const updatedCinema = await Cinema.findByIdAndUpdate(
      id,
      { name, address },
      { new: true, runValidators: true }
    )
    if (!updatedCinema) {
      throw new Error("Không tìm thấy rạp để cập nhật")
    }
    return updatedCinema
  }

  // DELETE
  static async deleteCinema(id: string): Promise<ICinema | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error("ID rạp không hợp lệ")
    }

    const deletedCinema = await Cinema.findByIdAndDelete(id)
    if (!deletedCinema) {
      throw new Error("Không tìm thấy rạp để xóa")
    }
    const rooms = await Room.find({ cinemaId: id })
    const roomIds = rooms.map((room) => room._id.toString())
    await Room.deleteMany({ cinemaId: id })
    await Seat.deleteMany({ roomId: { $in: roomIds } })
    const showtimes = await Showtime.find({ roomId: { $in: roomIds } })
    const showtimeIds = showtimes.map((showtime) => showtime._id.toString())
    await Showtime.deleteMany({ roomId: { $in: roomIds } })
    await ShowtimeSeat.deleteMany({ showtimeId: { $in: showtimeIds } })

    return deletedCinema
  }
}
