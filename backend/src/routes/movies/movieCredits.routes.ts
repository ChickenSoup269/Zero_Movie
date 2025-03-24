import express from "express";
import { getMovieCreditsController } from "../../controllers/movies/movieCredits.controller";

const router = express.Router();

router.get("/:id/credits", getMovieCreditsController);

export default router;
