import { Request, Response } from "express";
import {
  getUserProfileService,
  updateUserProfileService,
} from "../../services/users/users.service";

// Lấy thông tin người dùng
export const getUserProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Không có token" });
      return;
    }

    const user = await getUserProfileService(token);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi lấy thông tin người dùng",
      error: (error as Error).message,
    });
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Không có token" });
      return;
    }

    const { username, email } = req.body;
    const updatedUser = await updateUserProfileService(token, username, email);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      message: "Lỗi khi cập nhật thông tin người dùng",
      error: (error as Error).message,
    });
  }
};
