import { Router } from "express"; 
import {
  createCinema,
  getAllCinemas,
  getCinemaById,
  updateCinema,
  deleteCinema,
  getShowtimesByCinemaId, } from "../controllers/cinemaController";

const router = Router();

//routes
router.get('/', getAllCinemas); 
router.get('/:id', getCinemaById);
router.get('/:id/showtimes', getShowtimesByCinemaId); // showtime by cinema
router.post('/',createCinema)
router.put('/:id', updateCinema);
router.delete('/:id', deleteCinema);

export default router;