import { Router } from "express";
import {
  getGenres,
  addGenre,
  updateGenre,
  deleteGenre,
  searchGenre,
  getMoviesByGenre,
} from "../controllers/genresController";

const router = Router();

router.get("/", getGenres);                    
router.post("/", addGenre);                    
router.put("/:id", updateGenre);
router.delete("/:id", deleteGenre);            
router.get("/search", searchGenre);            
router.get("/:genreName/movies", getMoviesByGenre); 

export default router;