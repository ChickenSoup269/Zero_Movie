import express from "express"
import {
  getProfile,
  updateProfile,
  deleteUser,
  getAllUsers,
  searchUsers,
  uploadImage,
} from "../controllers/userController" // Controller của bạn
import { authMiddleware } from "../middlewares/auth"

const router = express.Router()

router.get("/profile", authMiddleware, getProfile)
router.put("/profile", authMiddleware, updateProfile)
router.delete("/:id", authMiddleware, deleteUser)
router.get("/", authMiddleware, getAllUsers)
router.get("/search", authMiddleware, searchUsers)
router.post("/upload", authMiddleware, uploadImage) // Endpoint upload

export default router
