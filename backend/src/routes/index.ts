import express from "express";
import authRoutes from "./auth/auth.routes";
import usersRoutes from "./users/users.routes";
import moviesRoutes from "./movies/movies.routes";
import movieDetailsRoutes from "./movies/movieDetails.routes";
import movieCreditsRoutes from "./movies/movieCredits.routes";
// import ratingsRoutes from "./ratings.routes";
// import reviewsRoutes from "./reviews.routes";
// import listsRoutes from "./lists.routes";
// import peopleRoutes from "./people.routes";
// import searchRoutes from "./search.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/movies", moviesRoutes);
router.use("/movies", movieDetailsRoutes);
router.use("/movies", movieCreditsRoutes);
// router.use("/ratings", ratingsRoutes);
// router.use("/reviews", reviewsRoutes);
// router.use("/lists", listsRoutes);
// router.use("/people", peopleRoutes);
// router.use("/search", searchRoutes);

export default router;
