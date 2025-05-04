import { Router } from "express"
import {
  createBooking,
  getUserBookings,
  deleteBooking,
  getAllBookings,
} from "../controllers/bookingController"
import { authMiddleware } from "../middlewares/auth"

const router = Router()

router.post("/", authMiddleware, createBooking)
router.get("/", authMiddleware, getAllBookings)
router.get("/my-bookings", authMiddleware, getUserBookings)
router.delete("/:bookingId", authMiddleware, deleteBooking)
export default router
