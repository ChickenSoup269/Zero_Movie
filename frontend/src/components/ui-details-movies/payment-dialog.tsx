/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { CreditCard, Lock, QrCode, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { QRCodeSVG } from "qrcode.react"
import { useToast } from "@/hooks/use-toast"
import UserService from "@/services/userService"
import emailjs from "@emailjs/browser"

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
  username: string
}

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
    name: username || "Guest",
    seats: selectedSeats.join(", ") || "None",
    time: selectedTime,
    ticketId: ticketId || "None",
    date: selectedDate ? format(selectedDate, "dd/MM/yyyy") : "12/07/2022",
    room: selectedRoom,
  })

  return (
    <div className="bg-white text-black flex flex-col sm:flex-row overflow-hidden rounded-md text-xs shadow-xl">
      <div className="w-full sm:w-2/3 p-2 sm:p-3 border-b-2 sm:border-b-0 sm:border-r-2 border-dotted border-black shadow-md shadow-blue-500/30">
        <h4 className="text-sm sm:text-base font-bold text-[#4599e3]">
          {theater.name}
        </h4>
        <p className="text-[0.65rem] text-gray-500">{theater.address}</p>
        <div className="mt-1 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
          <div>
            <span className="text-gray-500 text-[0.65rem]">MOVIE</span>
            <p className="font-semibold text-xs sm:text-sm">
              {movieInfo.movieTitle}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-[0.65rem]">CUSTOMER</span>
            <p className="font-semibold text-xs sm:text-sm">
              {username || "Guest"}
            </p>
          </div>
        </div>
        <div className="mt-1 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
          <div>
            <span className="text-gray-500 text-[0.65rem]">SEAT</span>
            <p className="font-semibold text-xs sm:text-sm">
              {selectedSeats.join(", ") || "None"}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-[0.65rem]">TIME</span>
            <p className="font-semibold text-xs sm:text-sm">{selectedTime}</p>
          </div>
          <div>
            <span className="text-gray-500 text-[0.65rem]">DATE</span>
            <p className="font-semibold text-xs sm:text-sm">
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "12/07/2022"}
            </p>
          </div>
        </div>
      </div>
      <div className="w-full sm:w-1/3 p-2 sm:p-3 bg-[#4599e3] shadow-md shadow-blue-500/30 text-white flex flex-col items-center justify-between rounded-b-md sm:rounded-b-none sm:rounded-r-md">
        <div className="text-center">
          <p className="text-xl sm:text-2xl font-bold">{selectedRoom}</p>
          <p className="text-[0.65rem]">ROOM</p>
          <p className="text-[0.5rem] mt-0.5">
            Ticket ID: {ticketId || "None"}
          </p>
        </div>
        <div className="bg-white p-0.5 rounded">
          <QRCodeSVG
            value={qrCodeContent}
            size={40}
            className="sm:w-[60px] sm:h-[60px]"
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
  const [username, setUsername] = useState<string>("")
  const [userEmail, setUserEmail] = useState<string>("")
  const [isTicketVisible, setIsTicketVisible] = useState(true)
  const { toast } = useToast()

  // Gọi API để lấy username và email
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await UserService.getProfile()
        const userProfile = response.data
        setUsername(userProfile.username || "Guest")
        setUserEmail(userProfile.email || "")
        if (!userProfile.email) {
          console.warn("No email found in user profile")
          toast({
            title: "Cảnh báo",
            description:
              "Không tìm thấy email trong hồ sơ người dùng. Vui lòng cập nhật email để nhận hóa đơn.",
            variant: "destructive",
          })
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err)
        setUsername("Guest")
        setUserEmail("")
        toast({
          title: "Lỗi",
          description: "Không thể lấy thông tin hồ sơ người dùng.",
          variant: "destructive",
        })
      }
    }
    if (isOpen) {
      fetchProfile()
    }
  }, [isOpen, toast])

  // Thông báo khi chọn card hoặc qr
  const handlePaymentMethodChange = (method: "paypal" | "card" | "qr") => {
    setPaymentMethod(method)
    setShowQR(method === "qr")
    setApproveUrl(null)
    setError(null)
    if (method === "card" || method === "qr") {
      toast({
        title: "Thông báo",
        description: "Tính năng thanh toán này hiện chưa được hỗ trợ.",
        variant: "destructive",
      })
    }
  }

  const handleConfirm = async () => {
    setError(null)
    setIsProcessing(true)
    try {
      if (paymentMethod === "card" || paymentMethod === "qr") {
        toast({
          title: "Thông báo",
          description: `Tính năng thanh toán bằng ${
            paymentMethod === "card" ? "thẻ" : "QR"
          } hiện chưa được hỗ trợ.`,
          variant: "destructive",
        })
      } else if (paymentMethod === "paypal") {
        // Step 1: Call onConfirm to get the PayPal approveUrl
        const result = await onConfirm("paypal")
        if (result?.error) throw new Error(result.error)
        if (!result?.approveUrl) {
          throw new Error("Không nhận được link thanh toán PayPal.")
        }

        const approveUrl = result.approveUrl
        setApproveUrl(approveUrl) // Still set the state to display the link in the dialog

        // Step 2: Save ticket notification
        const newNotification = {
          id: Date.now().toString(),
          movieTitle: movieTitle || "Unknown Movie",
          seats: selectedSeats?.join(", ") || "N/A",
          showtimeId: ticketId,
          createdAt: new Date().toISOString(),
        }
        const currentNotifications = JSON.parse(
          localStorage.getItem("ticketNotifications") || "[]"
        )
        localStorage.setItem(
          "ticketNotifications",
          JSON.stringify([...currentNotifications, newNotification])
        )

        // Step 3: Send email via EmailJS with the approveUrl
        if (!userEmail) {
          throw new Error("Không tìm thấy email người dùng để gửi hóa đơn.")
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(userEmail)) {
          throw new Error("Email người dùng không hợp lệ: " + userEmail)
        }

        const templateParams = {
          // Regular params matching your template
          name: username || "Guest",
          account_name: "ZeroMove",
          movie_title: movieTitle || "N/A",
          seats: selectedSeats?.join(", ") || "N/A",
          showtime: selectedTime || "N/A",
          room: selectedRoom || "N/A",
          date: selectedDate ? format(selectedDate, "dd/MM/yyyy") : "N/A",
          theater_name: theaterName || "N/A",
          theater_address: theaterAddress || "N/A",
          ticket_id: ticketId || "N/A",
          total: `${totalAmount.toLocaleString()}đ`,
          action_url: `${window.location.origin}/profile#tickets`,

          paypal_link: approveUrl, // Add the PayPal approveUrl
          user_email: userEmail,
          email: userEmail,
          to_email: userEmail,
          recipient: userEmail,
          to: userEmail,
          from_name: "MovieBooking System",
          reply_to: userEmail,
        }
        console.log("Sending email with params:", templateParams)

        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ORDER_MOVIE_ID!,
          templateParams,
          {
            publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!,
          }
        )

        toast({
          title: "Email đã được gửi!",
          description:
            "Vui lòng kiểm tra email để hoàn tất thanh toán qua PayPal.",
        })

        // Đóng dialog sau khi gửi email thành công
        onClose()
      }
    } catch (err: any) {
      console.error("Error in handleConfirm:", err)
      setError(err.message || "Lỗi khi xử lý thanh toán.")
      toast({
        title: "Lỗi",
        description: err.message || "Lỗi khi xử lý thanh toán.",
        variant: "destructive",
      })
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

  // Tạo mã QR ngẫu nhiên (dựa trên timestamp và một số ngẫu nhiên)
  const generateQRData = () => {
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000000)
    return `payment:${timestamp}:${randomNum}:${totalAmount}`
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
  const ticketVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
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
    username,
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
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="text-center text-lg font-bold">
                  Thông tin thanh toán
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    {isTicketVisible ? (
                      <p className="font-mono text-sm"></p>
                    ) : (
                      <p className="font-mono text-sm">Xem thông tin vé</p>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsTicketVisible(!isTicketVisible)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {isTicketVisible ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  <AnimatePresence>
                    {isTicketVisible && (
                      <motion.div
                        variants={ticketVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                      >
                        <Ticket {...ticketProps} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Button
                  onClick={() => handlePaymentMethodChange("paypal")}
                  className={`w-full flex items-center justify-center gap-2 h-12 rounded-lg ${
                    paymentMethod === "paypal" && !showQR
                      ? "bg-[#4599e3] text-white"
                      : "bg-white text-black"
                  } hover:bg-[#4599e3] hover:text-white`}
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
                  onClick={() => handlePaymentMethodChange("card")}
                  className={`w-full flex items-center justify-center gap-2 h-12 rounded-lg ${
                    paymentMethod === "card" && !showQR
                      ? "bg-[#4599e3] text-white"
                      : "bg-white text-black"
                  } hover:bg-[#4599e3] hover:text-white`}
                >
                  <CreditCard className="w-5 h-5" />
                  <span>Thẻ tín dụng</span>
                </Button>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <Button
                    onClick={() => handlePaymentMethodChange("qr")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 ${
                      paymentMethod === "qr" && showQR
                        ? "bg-[#4599e3] text-white"
                        : "bg-white text-black"
                    } hover:bg-[#4599e3] hover:text-white`}
                  >
                    <QrCode className="w-5 h-5" />
                    <span>Mã QR</span>
                  </Button>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
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
                          className="mt-1 text-white border-gray-600"
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
                          className="mt-1 text-white border-gray-600"
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
                            className="mt-1 text-white border-gray-600"
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="CVV"
                            value={cvv}
                            onChange={(e) => setCvv(formatCvv(e.target.value))}
                            className="mt-1 text-white border-gray-600"
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
                      <QRCodeSVG value={generateQRData()} size={150} />
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
                  className="border-gray-300 hover:bg-gray-500"
                  disabled={isProcessing || isLoading}
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-black dark:bg-blue-400 text-white hover:bg-gray-500 flex items-center gap-2"
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
