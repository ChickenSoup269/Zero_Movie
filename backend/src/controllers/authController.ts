import { Request, Response } from 'express';
import { AuthService } from '../services/authServices';

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password, fullName } = req.body;
    const result = await AuthService.register({ username, email, password, fullName });
    res.status(201).json({ message: 'Đăng ký thành công', ...result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi đăng ký' });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    res.status(200).json({ message: 'Đăng nhập thành công', ...result });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message || 'Lỗi khi đăng nhập' });
  }
}

export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    const result = await AuthService.refreshToken(refreshToken);
    res.status(200).json({ message: 'Làm mới token thành công', ...result });
  } catch (error) {
    res.status(401).json({ message: (error as Error).message || 'Lỗi khi làm mới token' });
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;
    await AuthService.logout(refreshToken);
    res.status(200).json({ message: 'Đăng xuất thành công' });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi đăng xuất' });
  }
}

export async function createGuestSession(req: Request, res: Response): Promise<void> {
  try {
    const result = await AuthService.createGuestSession();
    res.status(201).json({ message: 'Tạo phiên guest thành công', ...result });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi tạo phiên guest' });
  }
}