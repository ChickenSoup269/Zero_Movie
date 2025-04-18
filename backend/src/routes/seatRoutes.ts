import { Router } from 'express';
import { SeatController } from '../controllers/seatController';

const router = Router();

router.get('/room/:roomId', SeatController.getSeatsByRoom);
router.get('/:id', SeatController.getSeatById);
router.delete('/:id', SeatController.deleteSeat);
export default router;