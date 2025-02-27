import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import movieRoutes from "./routes/movies.routes";
import authRoutes from "./routes/auth.routes";
import usersRoutes from "./routes/users.routes";

dotenv.config();

const app = express();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => console.log("Kết nối MongoDB Atlas thành công"))
  .catch((err) => console.error("Lỗi kết nối MongoDB Atlas", err));

app.use("/api/movies", movieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
