// src/seedData.ts
import Cinema ,{ ICinema } from '../models/cinemaModel';
import mongoose from 'mongoose';
import Room, { IRoom } from '../models/roomModel';
import Showtime from '../models/showtimeModel';
import  {Movie} from '../models/movieModel';
import {connectDB} from '../config/db';

export async function seedCinemas (){
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
};
