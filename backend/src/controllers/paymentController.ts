import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentServices';

export const createPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { bookingId } = req.body;

    if (!bookingId) {
      res.status(400).json({ message: 'Thiếu bookingId' });
      return;
    }

    const { payment, orderId, approveUrl } = await PaymentService.createPayment(bookingId, userId);
    res.status(201).json({
      message: 'Yêu cầu thanh toán đã được tạo',
      payment: {
        _id: payment._id.toString(),
        bookingId: payment.bookingId.toString(),
        userId: payment.userId?.toString(),
        amount: payment.amount,
        status: payment.status,
      },
      orderId,
      approveUrl,
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi tạo thanh toán' });
  }
};

export const capturePayment = async (req: Request, res: Response): Promise<void> => {
  console.log('PayPal redirect query:', req.query); 
  try {
    const { token } = req.query; // PayPal gửi token thay vì orderId
    if (!token) {
      res.status(400).json({ message: 'Thiếu token từ PayPal' });
      return;
    }

    // Tìm payment trong DB bằng transactionId (orderId ban đầu)
    const payment = await PaymentService.capturePaymentByOrderId(token as string);
    res.status(200).json({
      message: 'Thanh toán thành công',
      payment: {
        _id: payment._id.toString(),
        bookingId: payment.bookingId.toString(),
        userId: payment.userId?.toString(),
        amount: payment.amount,
        status: payment.status,
        transactionId: payment.transactionId,
      },
    });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message || 'Lỗi khi xác nhận thanh toán' });
  }
  
};
export const getPaymentHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id; // Lấy userId từ token

    const payments = await PaymentService.getPaymentHistory(userId);

    res.status(200).json({
      message: payments.length ? 'Lấy lịch sử thanh toán thành công' : 'Không có lịch sử thanh toán',
      payments,
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message || 'Lỗi khi lấy lịch sử thanh toán' });
  }
};
