import Payment from '../models/paymentModel';
import { BookingService } from './bookingServices';
import paypalClient from '../config/paypal';
import { OrdersCreateRequest, OrdersCaptureRequest } from '@paypal/checkout-server-sdk/lib/orders/lib';
import Booking from '../models/bookingModel';

export class PaymentService {
  static async createPayment(bookingId: string, userId: string | null) {
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
          currency_code: 'USD', // Đảm bảo dùng USD
          value: (totalPrice / 23000).toFixed(2), // Quy đổi từ VND sang USD
        },
        description: `Thanh toán vé xem phim - Booking ID: ${bookingId}`,
      }],
    });

    try {
      const order = await paypalClient.execute(request);
      console.log('PayPal Order Created:', JSON.stringify(order.result, null, 2)); // Log chi tiết order
      payment.transactionId = order.result.id;
      await payment.save();

      // Tìm link approve
      const approveLink = order.result.links.find((link: any) => link.rel === 'approve')?.href;
      if (!approveLink) throw new Error('Không tìm thấy approveUrl từ PayPal');

      return {
        payment,
        orderId: order.result.id,
        approveUrl: approveLink,
      };
    } catch (error) {
      payment.status = 'failed';
      await payment.save();
      console.error('Lỗi khi tạo thanh toán PayPal:', (error as Error).message);
      throw new Error('Không thể tạo thanh toán PayPal: ' + (error as Error).message);
    }
  }

  static async capturePayment(bookingId: string, orderId: string) {
    console.log('Capture Payment - Booking ID:', bookingId);
    console.log('Capture Payment - Order ID:', orderId);

    const payment = await Payment.findOne({ bookingId, transactionId: orderId });
    console.log('Capture Payment - Found Payment:', payment);
    if (!payment) throw new Error('Không tìm thấy Payment với bookingId hoặc orderId này');
    if (payment.status !== 'pending') throw new Error(`Payment đã ở trạng thái ${payment.status}`);

    const request = new OrdersCaptureRequest(orderId);

    try {
      const capture = await paypalClient.execute(request);
      console.log('Capture Payment - PayPal Response:', JSON.stringify(capture.result, null, 2)); // Log chi tiết capture

      // Kiểm tra trạng thái capture
      if (capture.result.status !== 'COMPLETED') {
        payment.status = 'failed';
        await payment.save();
        throw new Error('Thanh toán PayPal không hoàn tất, trạng thái: ' + capture.result.status);
      }

      payment.status = 'completed';
      payment.transactionId = capture.result.id;
      await payment.save();

      // Chuyển ghế sang booked
      await BookingService.confirmBooking(bookingId);
      console.log('Booking confirmed and seats booked for Booking ID:', bookingId);

      return payment;
    } catch (error) {
      payment.status = 'failed';
      await payment.save();
      console.error('Lỗi khi capture thanh toán PayPal:', (error as Error).message);
      throw new Error('Thanh toán PayPal thất bại: ' + (error as Error).message);
    }
  }
}