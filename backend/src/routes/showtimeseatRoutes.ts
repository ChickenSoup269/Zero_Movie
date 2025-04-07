import { Router } from 'express';
import { getSeatsByShowtime, updateSeatStatus } from '../controllers/showtimeseatController';

const router = Router();

// Lấy danh sách ghế theo suất chiếu
router.get('/showtime/:showtimeId', getSeatsByShowtime);
router.put('/showtime/:showtimeId/seat/:seatId', updateSeatStatus);

export default router;