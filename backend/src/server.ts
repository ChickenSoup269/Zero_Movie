import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import setupRoutes from "./routes/appRoutes"
import morgan from "morgan"
import path from "path"
import { connectDB } from "./config/db"
import { startMovieStatusCron } from "./utils/cronUtils"

dotenv.config()

const app = express()
const PORT = 3001

// Cấu hình CORS
app.use(
  cors({
    origin: [
      "http://localhost:3000", 
      "https://zero-movie-fe-v2.onrender.com", 
    ],
    credentials: true, 
  })
);app.use(express.json())
app.use(morgan("combined"))

// Cấu hình phục vụ file tĩnh
const uploadPath = path.join(__dirname, "..", "uploads") // Chữ hoa để khớp với Multer
console.log("Express static uploadPath:", uploadPath)
app.use("/uploads", express.static(uploadPath)) // Sử dụng uploadPath

connectDB().then(async () => {
  console.log("Kết nối MongoDB thành công!")
  startMovieStatusCron()
  console.log("Cron jobs đã được khởi động")
})

setupRoutes(app)

// Start server
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`)
})
