import { Application } from "express"
import moviesRoutes from "./moviesRoutes"
import genresRoutes from "./genresRoutes"
import cinemaRoutes from "./cinemaRoutes"
import roomRoutes from "./roomRoutes"
import seatRoutes from "./seatRoutes"
import showtimeRoutes from "./showtimeRoutes"
import showtimeseatRoutes from "./showtimeseatRoutes"
import userRoutes from "./userRoutes"
import authRoutes from "./authRoutes"
import bookingRoutes from "./bookingRoutes"
import paymentRoutes from "./paymentRoutes"
import commentRoutes from "./commentRoutes"

export default function setupRoutes(app: Application) {
  app.use("/api/auth", authRoutes)
  app.use("/api/users", userRoutes)
  app.use("/api/bookings", bookingRoutes)
  app.use("/api/payments", paymentRoutes)
  app.use("/api/cinemas", cinemaRoutes)
  app.use("/api/movies", moviesRoutes)
  app.use("/api/genres", genresRoutes)
  app.use("/api/comments", commentRoutes)
  app.use("/api/rooms", roomRoutes)
  app.use("/api/seats", seatRoutes)
  app.use("/api/showtimeseat", showtimeseatRoutes)
  app.use("/api/showtime", showtimeRoutes)
}
