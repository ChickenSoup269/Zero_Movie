import { Request, Response } from "express";
import {
  registerService,
  loginService,
  logoutService,
} from "../services/auth.service";

// Đăng ký
export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password, username } = req.body;
    const user = await registerService(email, password, username);
    res.status(201).json({ message: "Đăng ký thành công", user });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi đăng ký", error: (error as Error).message });
  }
};

// Đăng nhập
export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { token } = await loginService(email, password);
    res.status(200).json({ message: "Đăng nhập thành công", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi đăng nhập", error: (error as Error).message });
  }
};

// Đăng xuất
export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Không có token" });
      return;
    }

    await logoutService(token);
    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Lỗi khi đăng xuất", error: (error as Error).message });
  }
};
