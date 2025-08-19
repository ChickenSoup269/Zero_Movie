import mongoose from "mongoose"
import Payment from "../models/paymentModel"
import { BookingService } from "./bookingServices"
import paypalClient from "../config/paypal"
import {
  OrdersCreateRequest,
  OrdersCaptureRequest,
} from "@paypal/checkout-server-sdk/lib/orders/lib"
import Booking from "../models/bookingModel"
import { Movie } from '../models/movieModel';

export class PaymentService {
  static async createPayment(bookingId: string, userId: string | null) {
    if (!mongoose.Types.ObjectId.isValid(bookingId))
      throw new Error("Booking ID không hợp lệ")

    // Truy vấn booking và populate showtimeId
    const booking = await Booking.findById(bookingId).populate('showtimeId');
    if (!booking || booking.status !== 'pending')
      throw new Error('Booking không hợp lệ hoặc đã được xử lý');

    // Kiểm tra thời hạn suất chiếu
    const showtime = booking.showtimeId as any; 
    if (!showtime)
      throw new Error('Không tìm thấy suất chiếu liên quan đến booking');
    const currentTime = new Date(); 
    if (currentTime > showtime.startTime)
      throw new Error('Suất chiếu đã qua thời hạn, không thể tạo thanh toán');

    // Kiểm tra expiresAt của booking
    if (booking.expiresAt && currentTime > booking.expiresAt)
      throw new Error('Booking đã hết hạn, không thể tạo thanh toán');

    // Kiểm tra trạng thái phim
    const movie = await Movie.findOne({ tmdbId: booking.movieId });
    if (!movie || movie.status !== 'nowPlaying')
      throw new Error('Phim không còn được chiếu, không thể tạo thanh toán');

    // Kiểm tra totalPrice
    const totalPrice = booking.totalPrice;
    if (!totalPrice || totalPrice <= 0) throw new Error('Tổng giá không hợp lệ');

    const payment = new Payment({
      bookingId,
      userId,
      amount: totalPrice,
      paymentMethod: "paypal",
      status: "pending",
    })
    await payment.save()

    const request = new OrdersCreateRequest()
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "AUD",
            value: (totalPrice / 16000).toFixed(2),
          },
          description: `Thanh toán vé xem phim - Booking ID: ${bookingId}`,
        },
      ],
      application_context: {
        return_url: "http://localhost:3001/api/payments/success", // Updated
        cancel_url: "http://localhost:3000/ticket?error=canceled",
      },
    })

    try {
      const order = await paypalClient.execute(request)
      console.log("PayPal order response:", order.result)
      payment.transactionId = order.result.id
      await payment.save()

      const approveLink = order.result.links.find(
        (link: any) => link.rel === "approve"
      )?.href
      if (!approveLink) throw new Error("Không tìm thấy approveUrl từ PayPal")

      return { payment, orderId: order.result.id, approveUrl: approveLink }
    } catch (error) {
      console.error("PayPal create error:", error)
      payment.status = "failed"
      await payment.save()
      throw new Error(`Tạo thanh toán thất bại: ${(error as Error).message}`)
    }
  }

  static async capturePaymentByOrderId(orderId: string) {
    const payment = await Payment.findOne({ transactionId: orderId })
    if (!payment || payment.status !== "pending")
      throw new Error("Payment không hợp lệ")

    const request = new OrdersCaptureRequest(orderId)
    try {
      const capture = await paypalClient.execute(request)
      console.log("PayPal capture response:", capture.result)
      if (capture.result.status !== "COMPLETED") {
        payment.status = "failed"
        await payment.save()
        throw new Error("Thanh toán PayPal không hoàn tất")
      }

      payment.status = "completed"
      payment.transactionId = capture.result.id
      await payment.save()

      await BookingService.confirmBooking(payment.bookingId.toString())
      return payment
    } catch (error) {
      console.error("PayPal capture error:", error)
      payment.status = "failed"
      await payment.save()
      throw new Error(
        `Capture thanh toán thất bại: ${(error as Error).message}`
      )
    }
  }
}
