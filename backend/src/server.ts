import express from "express";
import cors from "cors";
import moviesRouter from "./routes/movies";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/movies", moviesRouter);

app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
