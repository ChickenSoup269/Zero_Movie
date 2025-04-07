import { Router } from 'express';
import { createShowtime, getAllShowtimes, getShowtimeById, deleteShowtime } from '../controllers/showtimeController';

const router = Router();

router.post('/', createShowtime);         
router.get('/', getAllShowtimes);        
router.get('/:id', getShowtimeById);      
router.delete('/:id', deleteShowtime); 

export default router;