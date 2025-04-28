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
}

const PaymentDialog = ({
  isOpen,
  onClose,
  onConfirm,
  originalPrice,
  savings,
  totalAmount,
}: PaymentDialogProps) => {
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "card">(
    "paypal"
  )
  const [showQR, setShowQR] = useState(false)
  const [holderName, setHolderName] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")

  // Tạo mã QR ngẫu nhiên (dựa trên timestamp và một số ngẫu nhiên)
  const generateQRData = () => {
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000000)
    return `payment:${timestamp}:${randomNum}:${totalAmount}`
  }

  const handleConfirm = () => {
    if (paymentMethod === "card") {
      if (!holderName || !cardNumber || !expiry || !cvv) {
        alert("Please fill in all card details!")
        return
      }
      onConfirm("card", { holderName, cardNumber, expiry, cvv })
    } else {
      onConfirm(paymentMethod)
    }
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

  // Variants cho form và QR Code
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  }

  // Variants cho icon
  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 },
  }

  // Variants cho dialog (hiệu ứng Windows 11)
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut", // Đường cong mượt mà khi mở
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: {
        duration: 0.2,
        ease: "easeIn", // Đường cong mượt mà khi đóng
      },
    },
  }

  return (
    <Dialog>
      <AnimatePresence>
        <motion.div
          variants={dialogVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <DialogContent className="sm:max-w-[425px] bg-white text-black">
            <DialogHeader>
              <DialogTitle className="text-center text-lg font-bold">
                Payment
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 space-y-4">
              {/* PayPal Button */}
              <Button
                onClick={() => {
                  setPaymentMethod("paypal")
                  setShowQR(false)
                }}
                className={`w-full flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 ${
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
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
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
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <span>PayPal</span>
              </Button>

              {/* Card Payment Option */}
              <Button
                onClick={() => {
                  setPaymentMethod("card")
                  setShowQR(false)
                }}
                className={`w-full flex items-center justify-center gap-2 h-12 rounded-lg border border-gray-300 ${
                  paymentMethod === "card" && !showQR
                    ? "bg-[#4599e3] text-white"
                    : "bg-white text-black"
                } hover:bg-[#4599e3] hover:text-white`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Pay with Card</span>
              </Button>

              {/* QR Code Option */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-300"></div>
                <Button
                  onClick={() => setShowQR(!showQR)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 ${
                    showQR ? "bg-[#4599e3] text-white" : "bg-white text-black"
                  } hover:bg-[#4599e3] hover:text-white`}
                >
                  <QrCode className="w-5 h-5" />
                  <span>QR Code</span>
                </Button>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Card Details Animation */}
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
                      <Label htmlFor="holder-name">Card Holder Name</Label>
                      <Input
                        id="holder-name"
                        placeholder="Enter your full name"
                        value={holderName}
                        onChange={(e) => setHolderName(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input
                        id="card-number"
                        placeholder="0000 0000 0000 0000"
                        value={cardNumber}
                        onChange={(e) =>
                          setCardNumber(formatCardNumber(e.target.value))
                        }
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          value={expiry}
                          onChange={(e) =>
                            setExpiry(formatExpiry(e.target.value))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="CVV"
                          value={cvv}
                          onChange={(e) => setCvv(formatCvv(e.target.value))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* QR Code with Animation */}
              <AnimatePresence mode="wait">
                {showQR && (
                  <motion.div
                    key="qr-code"
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.3 }}
                    className="flex justify-center"
                  >
                    <QRCodeSVG value={generateQRData()} size={150} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Total Amount with Original Price, Savings, and Total */}
              <div className="text-center space-y-1">
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Original Price</span>
                  {/* <span>${originalPrice.toFixed(2)}</span> */}
                </div>
                <div className="flex justify-between text-sm text-green-500">
                  <span>Savings</span>
                  {/* <span>-${savings.toFixed(2)}</span> */}
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  {/* <span>${totalAmount.toFixed(2)}</span> */}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
                disabled={showQR}
              >
                <Lock className="w-4 h-4" />
                Checkout
              </Button>
            </DialogFooter>
          </DialogContent>
        </motion.div>
      </AnimatePresence>
    </Dialog>
  )
}

export default PaymentDialog
