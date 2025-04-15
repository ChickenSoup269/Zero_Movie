import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentServices';

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id || null;
    const { bookingId } = req.body;
    const { payment, orderId, approveUrl } = await PaymentService.createPayment(bookingId, userId);
    res.status(200).json({
      message: 'Yêu cầu thanh toán đã được tạo',
      payment,
      orderId,
      approveUrl, // Trả về link approve
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi tạo thanh toán' });
  }
};

export const capturePayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookingId, orderId } = req.body;
    const payment = await PaymentService.capturePayment(bookingId, orderId);
    res.status(200).json({ message: 'Thanh toán thành công', payment });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi xác nhận thanh toán' });
  }
};