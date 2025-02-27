import express from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import moviesRoutes from "./movies.routes";
// import tvShowsRoutes from "./tvshows.routes";
// import ratingsRoutes from "./ratings.routes";
// import reviewsRoutes from "./reviews.routes";
// import listsRoutes from "./lists.routes";
// import peopleRoutes from "./people.routes";
// import searchRoutes from "./search.routes";
// import discoverRoutes from "./discover.routes";
// import watchProvidersRoutes from "./watchProviders.routes";
// import networksRoutes from "./networks.routes";
// import companiesRoutes from "./companies.routes";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/movies", moviesRoutes);
// router.use("/tvshows", tvShowsRoutes);
// router.use("/ratings", ratingsRoutes);
// router.use("/reviews", reviewsRoutes);
// router.use("/lists", listsRoutes);
// router.use("/people", peopleRoutes);
// router.use("/search", searchRoutes);
// router.use("/discover", discoverRoutes);
// router.use("/watch-providers", watchProvidersRoutes);
// router.use("/networks", networksRoutes);
// router.use("/companies", companiesRoutes);

export default router;
