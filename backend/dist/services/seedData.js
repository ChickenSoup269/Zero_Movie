"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedCinemas = seedCinemas;
function seedCinemas() {
    return __awaiter(this, void 0, void 0, function* () {
        // try {
        //   await connectDB();
        //   await Room.deleteMany({});
        //   await Showtime.deleteMany({});
        //   const cinemaIds = [
        //     new mongoose.Types.ObjectId('67d535b3c252a3da65d6e67d'),
        //     new mongoose.Types.ObjectId('67d535b3c252a3da65d6e680'),
        //   ];
        //   const cinemas: ICinema[] = await Cinema.find({ _id: { $in: cinemaIds } });
        //   if (cinemas.length !== cinemaIds.length) {
        //     throw new Error('Không tìm thấy một hoặc cả hai cinema với ID đã cho');
        //   }
        //   console.log('Cinemas hiện có:', cinemas);
        //   const movies = await Movie.find();
        //   if (movies.length === 0) {
        //     throw new Error('Không tìm thấy movie nào trong DB');
        //   }
        //   console.log('Số lượng movies:', movies.length);
        //   const allRooms: IRoom[] = [];
        //   for (const cinema of cinemas) {
        //     const rooms = [
        //       { cinemaId: cinema._id.toString(), roomNumber: 'Room 1', capacity: 144 }, 
        //       { cinemaId: cinema._id.toString(), roomNumber: 'Room 2', capacity: 144 },
        //       { cinemaId: cinema._id.toString(), roomNumber: 'Room 3', capacity: 144 },
        //     ];
        //     const createdRooms = await Room.insertMany(rooms);
        //     allRooms.push(...createdRooms);
        //     console.log(`Rooms added for ${cinema.name}:`, createdRooms);
        //   }
        //   const showtimes = movies.map((movie, index) => {
        //     const roomIndex = index % allRooms.length;
        //     return {
        //       movieId: movie.tmdbId,
        //       roomId: allRooms[roomIndex]._id.toString(), 
        //       startTime: new Date('2025-03-16T20:10:00'),
        //       endTime: new Date('2025-03-16T22:30:00'),
        //     };
        //   });
        //   const createdShowtimes = await Showtime.insertMany(showtimes);
        //   console.log('Showtimes added:', createdShowtimes);
        //   console.log('Dữ liệu mẫu đã được thêm thành công!');
        //   await mongoose.connection.close();
        // } catch (error) {
        //   console.error('Lỗi khi thêm dữ liệu:', error);
        // }
    });
}
;
