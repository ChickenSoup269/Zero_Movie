import mongoose from 'mongoose';
import Payment from '../models/paymentModel';
import { BookingService } from './bookingServices';
import paypalClient from '../config/paypal';
import { OrdersCreateRequest, OrdersCaptureRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';
import Booking from '../models/bookingModel';

export class PaymentService {
  static async createPayment(bookingId: string, userId: string | null) {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) throw new Error('Booking ID không hợp lệ');

    const booking = await Booking.findById(bookingId);
    if (!booking || booking.status !== 'pending') throw new Error('Booking không hợp lệ');
    const totalPrice = booking.totalPrice;
    if (!totalPrice || totalPrice <= 0) throw new Error('Tổng giá không hợp lệ');

    const payment = new Payment({
      bookingId,
      userId,
      amount: totalPrice,
      paymentMethod: 'paypal',
      status: 'pending',
    });
    await payment.save();

    const request = new OrdersCreateRequest();
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'AUD',
          value: (totalPrice / 16000).toFixed(2),
        },
        description: `Thanh toán vé xem phim - Booking ID: ${bookingId}`,
      }],
      application_context: {
        return_url: 'http://localhost:3001/api/payments/success',
        cancel_url: 'http://localhost:3001/api/payments/cancel',
      },
    });

    try {
      const order = await paypalClient.execute(request);
      payment.transactionId = order.result.id;
      await payment.save();

      const approveLink = order.result.links.find((link: any) => link.rel === 'approve')?.href;
      if (!approveLink) throw new Error('Không tìm thấy approveUrl từ PayPal');

      return { payment, orderId: order.result.id, approveUrl: approveLink };
    } catch (error) {
      payment.status = 'failed';
      await payment.save();
      throw new Error(`Tạo thanh toán thất bại: ${(error as Error).message}`);
    }
  }

  static async capturePayment(bookingId: string, orderId: string) {
    if (!mongoose.Types.ObjectId.isValid(bookingId)) throw new Error('Booking ID không hợp lệ');

    const payment = await Payment.findOne({ bookingId, transactionId: orderId });
    if (!payment || payment.status !== 'pending') throw new Error('Payment không hợp lệ');

    const request = new OrdersCaptureRequest(orderId);
    try {
      const capture = await paypalClient.execute(request);
      if (capture.result.status !== 'COMPLETED') {
        payment.status = 'failed';
        await payment.save();
        throw new Error('Thanh toán PayPal không hoàn tất');
      }

      payment.status = 'completed';
      payment.transactionId = capture.result.id;
      await payment.save();

      await BookingService.confirmBooking(bookingId);
      return payment;
    } catch (error) {
      payment.status = 'failed';
      await payment.save();
      throw new Error(`Capture thanh toán thất bại: ${(error as Error).message}`);
    }
  }

  static async capturePaymentByOrderId(orderId: string) {
    const payment = await Payment.findOne({ transactionId: orderId });
    if (!payment || payment.status !== 'pending') throw new Error('Payment không hợp lệ');

    const request = new OrdersCaptureRequest(orderId);
    try {
      const capture = await paypalClient.execute(request);
      if (capture.result.status !== 'COMPLETED') {
        payment.status = 'failed';
        await payment.save();
        throw new Error('Thanh toán PayPal không hoàn tất');
      }

      payment.status = 'completed';
      payment.transactionId = capture.result.id;
      await payment.save();

      await BookingService.confirmBooking(payment.bookingId.toString());
      return payment;
    } catch (error) {
      payment.status = 'failed';
      await payment.save();
      throw new Error(`Capture thanh toán thất bại: ${(error as Error).message}`);
    }
  }
  static async getPaymentHistory(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) throw new Error('User ID không hợp lệ');

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo, mới nhất trước
      .lean();

    if (!payments.length) {
      return [];
    }

    return payments.map(payment => ({
      _id: payment._id.toString(),
      bookingId: payment.bookingId.toString(),
      amount: payment.amount,
      status: payment.status,
      transactionId: payment.transactionId || null,
      paymentMethod: payment.paymentMethod,
      createdAt: payment.createdAt,
    }));
  }
}