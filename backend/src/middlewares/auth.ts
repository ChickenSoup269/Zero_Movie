import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Session from '../models/Auth/sessionModel';
import GuestSession from '../models/Auth/guestsessionModel';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; role: string };
      guestSessionId?: string;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Không có token' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    const session = await Session.findOne({ userId: decoded.id, refreshToken: { $exists: true } });
    if (!session) throw new Error('Phiên không hợp lệ');

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
  }
};

export const guestMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const guestSessionId = req.headers['x-guest-session-id'] as string;
  if (!guestSessionId) {
    res.status(401).json({ message: 'Không có guest session ID' });
    return;
  }

  const session = await GuestSession.findOne({ guestSessionId });
  if (!session || session.expiresAt < new Date()) {
    res.status(401).json({ message: 'Guest session không hợp lệ hoặc đã hết hạn' });
    return;
  }

  req.guestSessionId = guestSessionId;
  next();
};