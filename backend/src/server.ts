import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import setupRoutes from './routes/appRoutes'
import morgan from 'morgan';
import path from 'path';
import { connectDB } from "./config/db";
// import { fetchMoviesFromTMDB } from "./services/fetchmovieServices";
// import { fetchAndStoreGenres } from "./services/fetchgenresServices";
// import {seedCinemas} from "./services/seedData"
import { startCronJobs } from './utils/cronUtils';



dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(morgan("combined"))
const uploadPath = path.join(__dirname, '..', 'uploads'); // Lên một cấp từ src đến backend
console.log('Express static uploadPath:', uploadPath);
app.use('/uploads', express.static(uploadPath));
connectDB().then(async () => {
  console.log("Kết nối MongoDB thành công!");
  // await fetchMoviesFromTMDB();
  // await fetchAndStoreGenres();
  // await seedCinemas();
  startCronJobs();
});

setupRoutes(app);
// Start server
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
