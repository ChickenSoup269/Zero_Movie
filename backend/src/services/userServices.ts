import User from "../models/userModel"

export class UserService {
  static async getUserProfile(userId: string) {
    const user = await User.findById(userId).select("-password")
    if (!user) throw new Error("Không tìm thấy người dùng")
    return user
  }

  static async updateUserProfile(
    userId: string,
    updateData: {
      username?: string
      email?: string
      fullName?: string
      avatar?: string | null
      backgroundImage?: string | null
    }
  ) {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: updateData.username,
        email: updateData.email,
        fullName: updateData.fullName,
        avatar: updateData.avatar,
        backgroundImage: updateData.backgroundImage,
      },
      { new: true, runValidators: true }
    ).select("-password")
    if (!updatedUser) throw new Error("Không tìm thấy người dùng để cập nhật")
    return updatedUser
  }
  static async deleteUser(userId: string) {
    const user = await User.findByIdAndDelete(userId)
    if (!user) throw new Error("Không tìm thấy người dùng để xóa")
    return { message: "Xóa người dùng thành công" }
  }
  static async getAllUsers() {
    const users = await User.find().select("-password")
    return users
  }
  static async searchUsers(query: string) {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    }).select("-password")
    return users
  }
}
