import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

export async function connectDB() {
  if (!MONGO_URI) {
    console.error("Không tìm thấy MONGO_URI trong .env!");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
    
    console.log("Kết nối MongoDB Atlas thành công!");
  } catch (error) {
    console.error("Lỗi kết nối MongoDB:", error);
    process.exit(1);
  }
}
