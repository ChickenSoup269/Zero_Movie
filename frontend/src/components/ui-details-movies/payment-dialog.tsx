"use client"

import { useState, useEffect } from "react"
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
import Image from "next/image"
import { format } from "date-fns"
import { QRCodeSVG } from "qrcode.react"
import UserService from "@/services/userService" // Giả định đường dẫn tới UserService

// Định nghĩa interface cho Ticket
interface Theater {
  id: number
  name: string
  address: string
}

interface MovieInfo {
  type: string
  movieTitle: string
  director: string
}

interface TicketProps {
  theater: Theater
  movieInfo: MovieInfo
  selectedSeats: string[]
  selectedTime: string
  selectedDate: Date | undefined
  ticketId: string
  selectedRoom: string
  username: string // Thêm username vào props
}

// Component Ticket (thay CUSTOMER bằng username, bỏ TYPE)
const Ticket = ({
  theater,
  movieInfo,
  selectedSeats,
  selectedTime,
  selectedDate,
  ticketId,
  selectedRoom,
  username,
}: TicketProps) => {
  const qrCodeContent = JSON.stringify({
    cinema: theater.name,
    movie: movieInfo.movieTitle,
    director: movieInfo.director,
    name: username || "Guest", // Sử dụng username, mặc định là "Guest" nếu không có
    seats: selectedSeats.join(", ") || "None",
    time: selectedTime,
    ticketId: ticketId || "None",
    date: selectedDate ? format(selectedDate, "dd/MM/yyyy") : "12/07/2022",
    room: selectedRoom,
  })

  return (
    <div className="bg-white text-black flex flex-col sm:flex-row overflow-hidden rounded-md">
      <div className="w-full sm:w-2/3 p-3 sm:p-4 border-b-2 sm:border-b-0 sm:border-r-2 border-dotted border-black shadow-lg shadow-blue-500/50">
        <h4 className="text-base sm:text-lg font-bold text-[#4599e3]">
          {theater.name}
        </h4>
        <p className="text-xs text-gray-500">{theater.address}</p>
        <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">MOVIE</span>
            <p className="font-semibold text-sm sm:text-base">
              {movieInfo.movieTitle}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">CUSTOMER</span>
            <p className="font-semibold text-sm sm:text-base">
              {username || "Guest"}
            </p>
          </div>
          {/* Bỏ phần TYPE */}
        </div>
        <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">SEAT</span>
            <p className="font-semibold text-sm sm:text-base">
              {selectedSeats.join(", ") || "None"}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">TIME</span>
            <p className="font-semibold text-sm sm:text-base">{selectedTime}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">DATE</span>
            <p className="font-semibold text-sm sm:text-base">
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "12/07/2022"}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-1/3 p-3 sm:p-4 bg-[#4599e3] shadow-lg shadow-blue-500/50 text-white flex flex-col items-center justify-between rounded-b-md sm:rounded-b-none sm:rounded-r-md">
        <div className="text-center">
          <p className="text-2xl sm:text-4xl font-bold">{selectedRoom}</p>
          <p className="text-xs sm:text-sm">ROOM</p>
          <p className="text-[10px] mt-1">Ticket ID: {ticketId || "None"}</p>
        </div>
        <div className="bg-white p-1 rounded">
          <QRCodeSVG
            value={qrCodeContent}
            size={60}
            className="sm:w-[80px] sm:h-[80px]"
          />
        </div>
      </div>
    </div>
  )
}

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
  ) => Promise<{ approveUrl?: string; error?: string } | void>
  originalPrice: number
  savings: number
  totalAmount: number
  movieTitle?: string
  theaterName?: string
  theaterAddress?: string
  selectedSeats?: string[]
  selectedTime?: string
  selectedDate?: Date
  selectedRoom?: string
  isLoading?: boolean
  ticketId?: string
  movieType?: string
  director?: string
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
  theaterAddress,
  selectedSeats,
  selectedTime,
  selectedDate,
  selectedRoom,
  isLoading,
  ticketId,
  movieType,
  director,
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
  const [approveUrl, setApproveUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [username, setUsername] = useState<string>("") // State để lưu username

  // Gọi API để lấy username
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserService.getProfile()
        const userProfile = response.data // Giả định response.data chứa thông tin profile
        setUsername(userProfile.username || "Guest")
      } catch (err) {
        console.error("Failed to fetch user profile:", err)
        setUsername("Guest") // Mặc định nếu lỗi
      }
    }
    if (isOpen) {
      fetchProfile()
    }
  }, [isOpen])

  const generateQRData = () =>
    `payment:${movieTitle}:${totalAmount}:${Date.now()}`

  const validateExpiryDate = (value: string) => {
    if (!/^\d{2}\/\d{2}$/.test(value)) return false
    const [month, year] = value.split("/").map(Number)
    if (month < 1 || month > 12) return false
    const currentYear = new Date().getFullYear() % 100
    const currentMonth = new Date().getMonth() + 1
    return !(
      year < currentYear ||
      (year === currentYear && month < currentMonth)
    )
  }

  const handleConfirm = async () => {
    setError(null)
    setIsProcessing(true)
    try {
      if (paymentMethod === "card") {
        if (!holderName || !cardNumber || !expiry || !cvv)
          throw new Error("Vui lòng điền đầy đủ thông tin thẻ!")
        if (!/^\d{4} \d{4} \d{4} \d{4}$/.test(cardNumber))
          throw new Error("Số thẻ không hợp lệ (16 chữ số)!")
        if (!validateExpiryDate(expiry))
          throw new Error(
            "Ngày hết hạn không hợp lệ (MM/YY, phải trong tương lai)!"
          )
        if (!/^\d{3}$/.test(cvv))
          throw new Error("CVV không hợp lệ (3 chữ số)!")
        await onConfirm("card", { holderName, cardNumber, expiry, cvv })
        setHolderName("")
        setCardNumber("")
        setExpiry("")
        setCvv("")
        setShowQR(false)
        onClose()
      } else if (paymentMethod === "paypal") {
        const result = await onConfirm("paypal")
        if (result?.error) throw new Error(result.error)
        if (result?.approveUrl) setApproveUrl(result.approveUrl)
        else throw new Error("Không nhận được link thanh toán PayPal.")
      } else if (paymentMethod === "qr") {
        await onConfirm("qr")
        setHolderName("")
        setCardNumber("")
        setExpiry("")
        setCvv("")
        setShowQR(false)
        onClose()
      }
    } catch (err: any) {
      setError(err.message || "Lỗi khi xử lý thanh toán.")
    } finally {
      setIsProcessing(false)
    }
  }

  const formatCardNumber = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim()
      .slice(0, 19)
  const formatExpiry = (value: string) =>
    value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d{0,2})/, "$1/$2")
      .trim()
      .slice(0, 5)
  const formatCvv = (value: string) => value.replace(/\D/g, "").slice(0, 3)

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

  const ticketProps: TicketProps = {
    theater: {
      id: 1,
      name: theaterName || "N/A",
      address: theaterAddress || "Unknown Address",
    },
    movieInfo: {
      type: movieType || "N/A",
      movieTitle: movieTitle || "N/A",
      director: director || "Unknown Director",
    },
    selectedSeats: selectedSeats || [],
    selectedTime: selectedTime || "N/A",
    selectedDate,
    ticketId: ticketId || "N/A",
    selectedRoom: selectedRoom || "N/A",
    username, // Truyền username vào Ticket
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
            <DialogContent className="sm:max-w-[600px] bg-gray-800 text-white">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-bold">
                  Xác nhận thanh toán
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <h4 className="font-semibold">Thông tin vé</h4>
                  <Ticket {...ticketProps} />
                </div>
                <Button
                  onClick={() => {
                    setPaymentMethod("paypal")
                    setShowQR(false)
                    setApproveUrl(null)
                    setError(null)
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
                    setApproveUrl(null)
                    setError(null)
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
                    setApproveUrl(null)
                    setError(null)
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
                  {paymentMethod === "paypal" && !showQR && approveUrl && (
                    <motion.div
                      key="paypal-link"
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.3 }}
                      className="space-y-2 text-center"
                    >
                      <p className="text-sm text-gray-400">
                        Click link để thanh toán qua PayPal:
                      </p>
                      <a
                        href={approveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 bg-[#0070BA] text-white rounded-lg hover:bg-[#005EA6] transition-colors"
                      >
                        Thanh toán qua PayPal
                      </a>
                    </motion.div>
                  )}
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
                        style={{ maxWidth: "100%", height: "auto" }}
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
                  onClick={() => {
                    setApproveUrl(null)
                    setError(null)
                    setHolderName("")
                    setCardNumber("")
                    setExpiry("")
                    setCvv("")
                    setShowQR(false)
                    onClose()
                  }}
                  className="bg-gray-700 text-white hover:bg-gray-600"
                  disabled={isProcessing || isLoading}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-[#4599e3] text-white hover:bg-[#3a82c2] flex items-center gap-2"
                  disabled={isProcessing || isLoading || !!approveUrl}
                >
                  <Lock className="w-4 h-4" />
                  {isProcessing || isLoading ? "Đang xử lý..." : "Thanh toán"}
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
