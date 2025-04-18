import { Request, Response } from "express"
import { UserService } from "../services/userServices"
import multer from "multer"
import { upload } from "../config/multer" // Import từ config

// Lấy profile người dùng
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const user = await UserService.getUserProfile(userId)
    res.status(200).json(user)
  } catch (error) {
    res
      .status(404)
      .json({ message: (error as Error).message || "Lỗi khi lấy thông tin" })
  }
}

// Upload ảnh (endpoint mới)
export const uploadImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        console.error("Multer error:", err)
        throw new Error(err.message || "Lỗi khi upload file")
      }

      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined

      if (!files || (!files["avatar"] && !files["backgroundImage"])) {
        throw new Error("No file uploaded")
      }

      const fileUrls: { avatar?: string; backgroundImage?: string } = {}
      if (files["avatar"]) {
        fileUrls.avatar = `/uploads/${files["avatar"][0].filename}`
      }
      if (files["backgroundImage"]) {
        fileUrls.backgroundImage = `/uploads/${files["backgroundImage"][0].filename}`
      }

      res.status(200).json({ url: fileUrls.avatar || fileUrls.backgroundImage })
    } catch (error) {
      console.error("Upload image error:", error)
      res
        .status(400)
        .json({ message: (error as Error).message || "Lỗi khi upload ảnh" })
    }
  })
}

// Cập nhật profile
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        console.error("Multer error:", err)
        throw new Error(err.message || "Lỗi khi parse FormData")
      }

      const userId = req.user!.id
      const { username, email, fullName, avatar, backgroundImage } = req.body
      console.log("Received update data:", {
        username,
        email,
        fullName,
        avatar,
        backgroundImage,
      })

      const updateData: {
        username?: string
        email?: string
        fullName?: string
        avatar?: string | null
        backgroundImage?: string | null
      } = {}
      if (fullName !== undefined) updateData.fullName = fullName
      if (username !== undefined) updateData.username = username
      if (email !== undefined) updateData.email = email
      if (avatar !== undefined) updateData.avatar = avatar
      if (backgroundImage !== undefined)
        updateData.backgroundImage = backgroundImage

      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ message: "No valid fields provided for update" })
        return
      }

      const updatedUser = await UserService.updateUserProfile(
        userId,
        updateData
      )
      res
        .status(200)
        .json({ message: "Cập nhật thông tin thành công", user: updatedUser })
    } catch (error) {
      console.error("Update profile error:", error)
      res
        .status(400)
        .json({ message: (error as Error).message || "Lỗi khi cập nhật" })
    }
  })
}

// Xóa người dùng
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.params.id
    if (req.user!.role !== "admin" && req.user!.id !== userId) {
      res
        .status(403)
        .json({ message: "Chỉ admin hoặc chính user đó mới có quyền xóa" })
      return
    }
    const result = await UserService.deleteUser(userId)
    res.status(200).json(result)
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message || "Lỗi khi xóa người dùng" })
  }
}

// Lấy danh sách người dùng
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.user!.role !== "admin") {
      res
        .status(403)
        .json({ message: "Chỉ admin mới có quyền xem danh sách users" })
      return
    }
    const users = await UserService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    res.status(400).json({
      message: (error as Error).message || "Lỗi khi lấy danh sách users",
    })
  }
}

// Tìm kiếm người dùng
export const searchUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (req.user!.role !== "admin") {
      res.status(403).json({ message: "Chỉ admin mới có quyền tìm kiếm users" })
      return
    }
    const { q } = req.query
    if (!q || typeof q !== "string") {
      res.status(400).json({ message: "Vui lòng cung cấp từ khóa tìm kiếm" })
      return
    }
    const users = await UserService.searchUsers(q)
    res.status(200).json(users)
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message || "Lỗi khi tìm kiếm users" })
  }
}
