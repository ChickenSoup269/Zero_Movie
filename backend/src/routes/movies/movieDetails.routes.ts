import express from "express";
import { getMovieDetailsController } from "../../controllers/movies/movieDetails.controller";

const router = express.Router();

router.get("/:id/details", getMovieDetailsController);

export default router;
