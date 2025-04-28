import { Request, Response } from "express"
import { PaymentService } from "../services/paymentServices"

export const createPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.id
    const { bookingId } = req.body

    if (!bookingId) {
      res.status(400).json({ message: "Thiếu bookingId" })
      return
    }

    const { payment, orderId, approveUrl } = await PaymentService.createPayment(
      bookingId,
      userId
    )
    res.status(201).json({
      message: "Yêu cầu thanh toán đã được tạo",
      payment: {
        _id: payment._id.toString(),
        bookingId: payment.bookingId.toString(),
        userId: payment.userId?.toString(),
        amount: payment.amount,
        status: payment.status,
      },
      orderId,
      approveUrl,
    })
  } catch (error) {
    res
      .status(400)
      .json({ message: (error as Error).message || "Lỗi khi tạo thanh toán" })
  }
}

export const capturePayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  console.log("PayPal redirect query:", req.query)
  try {
    const { token } = req.query
    if (!token) {
      res.status(400).json({ message: "Thiếu token từ PayPal" })
      return
    }

    const payment = await PaymentService.capturePaymentByOrderId(
      token as string
    )
    res.redirect(`http://localhost:3000/ticket?token=${token}`)
  } catch (error) {
    console.error("Capture payment error:", error)
    res.redirect(
      `http://localhost:3000/ticket?error=${encodeURIComponent(
        (error as Error).message
      )}`
    )
  }
}
