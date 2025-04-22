import { Router } from "express";
import { MovieController } from "../controllers/movieController";

const router = Router();

router.get("/", MovieController.getAllMovies);
router.get("/:tmdbId", MovieController.getMovieById);
router.get("/search", MovieController.searchMovies);
router.post("/", MovieController.addMovie);
router.put("/:tmdbId", MovieController.updateMovie);
router.delete("/:tmdbId", MovieController.deleteMovie);
router.get("/recommend/:userId", MovieController.getRecommendations);

export default router;
