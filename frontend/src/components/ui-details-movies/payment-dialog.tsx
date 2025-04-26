"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Lock, QrCode } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import Image from "next/image"
import { format } from "date-fns"

interface PaymentDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (
    method: string,
    cardDetails?: {
      holderName: string
      cardNumber: string
      expiry: string
      cvv: string
    }
  ) => void
  originalPrice: number
  savings: number
  totalAmount: number
  movieTitle?: string
  theaterName?: string
  selectedSeats?: string[]
  selectedTime?: string
  selectedDate?: Date
  selectedRoom?: string
}

const PaymentDialog = ({
  isOpen,
  onClose,
  onConfirm,
  originalPrice,
  savings,
  totalAmount,
  movieTitle,
  theaterName,
  selectedSeats,
  selectedTime,
  selectedDate,
  selectedRoom,
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card" | "qr">(
    "paypal"
  )
  const [showQR, setShowQR] = useState(false)
  const [holderName, setHolderName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [error, setError] = useState<string | null>(null)

  const generateQRData = () => {
    // Giả lập VietQR hoặc MoMo
    return `payment:${movieTitle}:${totalAmount}:${Date.now()}`
  }

  const validateExpiryDate = (expiry: string) => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false
    const [month, year] = expiry.split("/").map(Number)
    if (month < 1 || month > 12) return false
    const currentYear = new Date().getFullYear() % 100 // Last 2 digits
    const currentMonth = new Date().getMonth() + 1
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
      return false
    }
    return true
  }

  const handleConfirm = () => {
    console.log("handleConfirm called with:", {
      paymentMethod,
      holderName,
      cardNumber,
      expiry,
      cvv,
    })
    setError(null)
    if (paymentMethod === "card") {
      if (!holderName || !cardNumber || !expiry || !cvv) {
        setError("Vui lòng điền đầy đủ thông tin thẻ!")
        return
      }
      if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber)) {
        setError("Số thẻ không hợp lệ (16 chữ số)!")
        return
      }
      if (!validateExpiryDate(expiry)) {
        setError("Ngày hết hạn không hợp lệ (MM/YY, phải trong tương lai)!")
        return
      }
      if (!/^\d{3}$/.test(cvv)) {
        setError("CVV không hợp lệ (3 chữ số)!")
        return
      }
      onConfirm("card", { holderName, cardNumber, expiry, cvv })
    } else if (paymentMethod === "paypal") {
      onConfirm("paypal")
    } else if (paymentMethod === "qr") {
      onConfirm("qr")
    }
    setHolderName("")
    setCardNumber("")
    setExpiry("")
    setCvv("")
    setShowQR(false)
    onClose()
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const formatted = cleaned
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19)
    return formatted
  }

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const formatted = cleaned
      .replace(/(\d{2})(\d{0,2})/, "$1/$2")
      .trim()
      .slice(0, 5)
    return formatted
  }

  const formatCvv = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    return cleaned.slice(0, 3)
  }

  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dialogVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-bold">
                  Xác nhận thanh toán
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Thông tin đơn hàng</h4>
                  <p>
                    <strong>Phim:</strong> {movieTitle || "N/A"}
                  </p>
                  <p>
                    <strong>Rạp:</strong> {theaterName || "N/A"}
                  </p>
                  <p>
                    <strong>Phòng:</strong> {selectedRoom || "N/A"}
                  </p>
                  <p>
                    <strong>Thời gian:</strong> {selectedTime} -{" "}
                    {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "N/A"}
                  </p>
                  <p>
                    <strong>Ghế:</strong>{" "}
                    {selectedSeats?.join(", ") || "Chưa chọn ghế"}
                  </p>
                </div>
                <Button
                  onClick={() => {
                    setPaymentMethod("paypal")
                    setShowQR(false)
                  }}
                  className={`w-full flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 ${
                    paymentMethod === "paypal" && !showQR
                      ? "bg-[#4599e3] text-white"
                      : "bg-gray-700 text-white"
                  } hover:bg-[#4599e3]`}
                >
                  <AnimatePresence mode="wait">
                    {paymentMethod === "paypal" && !showQR ? (
                      <motion.div
                        key="paypal-selected"
                        variants={iconVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src="https://www.edigitalagency.com.au/wp-content/uploads/PayPal-icon-white-png-vertical.png"
                          alt="PayPal Selected Icon"
                          width={20}
                          height={20}
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="paypal-default"
                        variants={iconVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                      >
                        <Image
                          src="https://cdn-icons-png.flaticon.com/512/174/174861.png"
                          alt="PayPal Icon"
                          width={20}
                          height={20}
                          style={{ maxWidth: "100%", height: "auto" }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span>PayPal</span>
                </Button>
                <Button
                  onClick={() => {
                    setPaymentMethod("card")
                    setShowQR(false)
                  }}
                  className={`w-full flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 ${
                    paymentMethod === "card" && !showQR
                      ? "bg-[#4599e3] text-white"
                      : "bg-gray-700 text-white"
                  } hover:bg-[#4599e3]`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Thẻ tín dụng</span>
                </Button>
                <Button
                  onClick={() => {
                    setPaymentMethod("qr")
                    setShowQR(true)
                  }}
                  className={`w-full flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 ${
                    paymentMethod === "qr" && showQR
                      ? "bg-[#4599e3] text-white"
                      : "bg-gray-700 text-white"
                  } hover:bg-[#4599e3]`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>Mã QR</span>
                </Button>
                {error && <div className="text-red-500 text-sm">{error}</div>}
                <AnimatePresence mode="wait">
                  {paymentMethod === "card" && !showQR && (
                    <motion.div
                      key="card-form"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div>
                        <Label htmlFor="holder-name">Tên chủ thẻ</Label>
                        <Input
                          id="holder-name"
                          placeholder="Nhập tên đầy đủ"
                          value={holderName}
                          onChange={(e) => setHolderName(e.target.value)}
                          className="mt-1 bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-number">Số thẻ</Label>
                        <Input
                          id="card-number"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(formatCardNumber(e.target.value))
                          }
                          className="mt-1 bg-gray-700 text-white border-gray-600"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <Label htmlFor="expiry">Ngày hết hạn</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={expiry}
                            onChange={(e) =>
                              setExpiry(formatExpiry(e.target.value))
                            }
                            className="mt-1 bg-gray-700 text-white border-gray-600"
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(formatCvv(e.target.value))}
                            className="mt-1 bg-gray-700 text-white border-gray-600"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {paymentMethod === "qr" && showQR && (
                    <motion.div
                      key="qr-code"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="flex flex-col items-center"
                    >
                      <Image
                        src="/qr.jpg"
                        alt="Zero Movies Logo"
                        width={120}
                        height={80}
                        className="cursor-pointer transition-transform duration-300 hover:scale-105 rounded-sm"
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                      <p className="text-sm text-gray-400 mt-2 text-center">
                        Quét mã QR bằng ứng dụng thanh toán (VietQR, MoMo, v.v.)
                        rồi nhấn "Thanh toán" để xác nhận.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="text-center space-y-1">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Giá gốc</span>
                    <span>{originalPrice.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-500">
                    <span>Tiết kiệm</span>
                    <span>-{savings.toLocaleString()}đ</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Tổng cộng</span>
                    <span>{totalAmount.toLocaleString()}đ</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="bg-gray-700 text-white hover:bg-gray-600"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-[#4599e3] text-white hover:bg-[#3a82c2] flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  Thanh toán
                </Button>
              </DialogFooter>
            </DialogContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  )
}

export default PaymentDialog
