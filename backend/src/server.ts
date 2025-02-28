import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import movieRoutes from "./routes/movies/movies.routes";
import authRoutes from "./routes/auth/auth.routes";
import usersRoutes from "./routes/users/users.routes";
import movieDetailsRoutes from "./routes/movies/movieDetails.routes";
import movieCreditsRoutes from "./routes/movies/movieCredits.routes";

dotenv.config();

const app = express();
app.use(express.json());

// Kết nối MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("Lỗi kết nối MongoDB Atlas:", err));

// Route
app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/movies", movieDetailsRoutes);
app.use("/api/movies", movieCreditsRoutes);

// PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
