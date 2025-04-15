import { Request, Response } from "express"
import { AuthService } from "../services/authServices"
import { omit } from "lodash"

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password, fullName } = req.body
    const result = await AuthService.register({
      username,
      email,
      password,
      fullName,
    })
    res
      .status(201)
      .json({ status: "OK", message: "Đăng ký thành công", ...result })
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: (error as Error).message || "Lỗi khi đăng ký",
    })
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body
    const result = await AuthService.login({ email, password })
    res
      .status(200)
      .json({ status: "OK", message: "Đăng nhập thành công", ...result })
  } catch (error) {
    res.status(401).json({
      status: "ERR",
      message: (error as Error).message || "Lỗi khi đăng nhập",
    })
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body
    const result = await AuthService.refreshToken(refreshToken)
    res
      .status(200)
      .json({ status: "OK", message: "Làm mới token thành công", ...result })
  } catch (error) {
    res.status(401).json({
      status: "ERR",
      message: (error as Error).message || "Lỗi khi làm mới token",
    })
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body
    await AuthService.logout(refreshToken)
    res.status(200).json({ status: "OK", message: "Đăng xuất thành công" })
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: (error as Error).message || "Lỗi khi đăng xuất",
    })
  }
}

export async function createGuestSession(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const result = await AuthService.createGuestSession()
    res
      .status(201)
      .json({ status: "OK", message: "Tạo phiên guest thành công", ...result })
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: (error as Error).message || "Lỗi khi tạo phiên guest",
    })
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    if (!email) throw new Error("Thiếu email")
    const result = await AuthService.forgotPassword(email)
    res.json({
      status: "OK",
      message: "Mã OTP đã được tạo",
      ...omit(result, "message"),
    })
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: (error as Error).message || "Lỗi khi tạo mã OTP",
    })
  }
}

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword)
      throw new Error("Thiếu email, OTP hoặc mật khẩu mới")
    const result = await AuthService.resetPassword({ email, otp, newPassword })
    res
      .status(200)
      .json({ status: "OK", ...result, message: "Đặt lại mật khẩu thành công" })
  } catch (error) {
    res.status(400).json({
      status: "ERR",
      message: (error as Error).message || "Lỗi khi đặt lại mật khẩu",
    })
  }
}
