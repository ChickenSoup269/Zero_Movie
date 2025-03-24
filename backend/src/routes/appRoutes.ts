import { Application } from "express";
import moviesRoutes from "./moviesRoutes";
import genresRoutes from "./genresRoutes";
import cinemaRoutes from "./cinemaRoutes"
import roomRoutes from "./roomRoutes"
import seatRoutes from "./seatRoutes"
import showtimeRoutes from "./showtimeRoutes"
import showtimeseatRoutes from "./showtimeseatRoutes"
import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
export default function setupRoutes(app: Application) {
  app.use("/api/auth", authRoutes);      
  app.use("/api/users", userRoutes);
  app.use("/api/cinemas", cinemaRoutes);
  app.use("/api/movies", moviesRoutes);
  app.use("/api/genres", genresRoutes)
  app.use("/api/room", roomRoutes)
  app.use("/api/seats", seatRoutes)
  app.use("/api/showtime", showtimeRoutes)
  app.use("/api/showtimeseat", showtimeseatRoutes)
}
