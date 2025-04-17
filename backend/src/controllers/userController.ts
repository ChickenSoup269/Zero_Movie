import { Request, Response } from 'express';
import { UserService } from '../services/userServices';
import { upload } from '../config/multer'; // Import từ config

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await UserService.getUserProfile(userId);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: (error as Error).message || 'Lỗi khi lấy thông tin' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  upload(req, res, async (err) => {
    try {
      if (err) throw new Error(err.message || 'Lỗi khi upload file');

      const userId = (req as any).user.id;
      const { username, email, fullName } = req.body;
      const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

      const updateData: {
        username?: string;
        email?: string;
        fullName?: string;
        avatar?: string | null; // Cho phép null
        backgroundImage?: string | null; // Cho phép null
      } = { username, email, fullName };

      // Nếu không gửi file avatar, đặt avatar thành null
      updateData.avatar = files && files['avatar'] ? `/uploads/${files['avatar'][0].filename}` : null;

      // Nếu không gửi file backgroundImage, đặt backgroundImage thành null
      updateData.backgroundImage = files && files['backgroundImage'] ? `/uploads/${files['backgroundImage'][0].filename}` : null;

      const updatedUser = await UserService.updateUserProfile(userId, updateData);
      res.status(200).json({ message: 'Cập nhật thông tin thành công', user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message || 'Lỗi khi cập nhật' });
    }
  });
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.id;
    if (req.user!.role !== 'admin' && req.user!.id !== userId) {
      res.status(403).json({ message: 'Chỉ admin hoặc chính user đó mới có quyền xóa' });
      return;
    }
    const result = await UserService.deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi xóa người dùng' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Chỉ admin mới có quyền xem danh sách users' });
      return;
    }
    const users = await UserService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi lấy danh sách users' });
  }
};

export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ message: 'Chỉ admin mới có quyền tìm kiếm users' });
      return;
    }
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      res.status(400).json({ message: 'Vui lòng cung cấp từ khóa tìm kiếm' });
      return;
    }
    const users = await UserService.searchUsers(q);
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi tìm kiếm users' });
  }
};