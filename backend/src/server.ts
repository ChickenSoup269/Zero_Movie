import express from "express";
<<<<<<< HEAD
import cors from "cors";
import dotenv from "dotenv";
import setupRoutes from './routes/appRoutes'
import morgan from 'morgan';
import { connectDB } from "./config/db";
import { fetchMoviesFromTMDB } from "./services/fetchmovieServices";
import { fetchAndStoreGenres } from "./services/fetchgenresServices";
// import {seedCinemas} from "./services/seedData"
import { startCronJobs } from './utils/cronUtils';


=======
import mongoose from "mongoose";
import dotenv from "dotenv";
import movieRoutes from "./routes/movies/movies.routes";
import authRoutes from "./routes/auth/auth.routes";
import usersRoutes from "./routes/users/users.routes";
import movieCreditsRoutes from "./routes/movies/movieCredits.routes";
>>>>>>> main

dotenv.config();

const app = express();
<<<<<<< HEAD
const PORT = 3001;

app.use(cors());
=======
>>>>>>> main
app.use(express.json());
app.use(morgan("combined"))

<<<<<<< HEAD
connectDB().then(async () => {
  console.log("Kết nối MongoDB thành công!");
  await fetchMoviesFromTMDB();
  await fetchAndStoreGenres();
  // await seedCinemas();
  startCronJobs();
});

setupRoutes(app);
// Start server
=======
// Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("Lỗi kết nối MongoDB Atlas:", err));

// Route
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/movies", movieCreditsRoutes);

// PORT
const PORT = process.env.PORT || 5000;
>>>>>>> main
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
