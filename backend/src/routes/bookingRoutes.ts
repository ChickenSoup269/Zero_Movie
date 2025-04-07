import { Router } from 'express';
import { createBooking, getUserBookings } from '../controllers/bookingController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getUserBookings);
export default router;