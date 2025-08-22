import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt"
import User from "../../../models/userModel";
import { connectDB } from "../../../config/db"
dotenv.config();
async function seedUsers() {
  try {
    await connectDB();
    console.log("Connected to DB");
    const salt = await bcrypt.genSalt(10);

    const users = [];
    for (let i = 1; i <= 1000; i++) {
      const hashedPassword = await bcrypt.hash("testpassword", salt);
      users.push({
        username: `testuser${i}`,
        email: `testuser${i}@example.com`,
        fullName: `Test User ${i}`,
        password: hashedPassword,
        role: "user",
        points: 0,
      });
    }

    await User.insertMany(users); 
    console.log("Seeded 1000 test users");
  } catch (error) {
    console.error("Seed error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
