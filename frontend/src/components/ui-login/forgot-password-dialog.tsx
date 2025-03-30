import { motion } from "framer-motion" // Thêm framer-motion
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react"

// Variants cho animation của ô OTP
const otpVariants = {
  hidden: { opacity: 0, y: 20 }, // Bắt đầu mờ và dịch xuống dưới
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

interface ForgotPasswordDialogProps {
  setOpenDialog: (value: boolean) => void
}

const ForgotPasswordDialog = ({ setOpenDialog }: ForgotPasswordDialogProps) => {
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isEmailValid, setIsEmailValid] = useState(false) // Theo dõi trạng thái email hợp lệ

  // Hàm kiểm tra email hợp lệ
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regex kiểm tra email
    return emailRegex.test(email)
  }

  // Xử lý khi email thay đổi
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setForgotEmail(email)
    setIsEmailValid(validateEmail(email)) // Cập nhật trạng thái email hợp lệ
  }

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Forgot password email:", forgotEmail, "OTP:", otp)
    setOpenDialog(false)
  }

  return (
    <Dialog onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <a href="#" className="text-sm text-black hover:underline">
          Forgotten Password?
        </a>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white border-black">
        <DialogHeader>
          <DialogTitle className="text-black">Reset Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="forgotEmail" className="text-black">
              Email
            </Label>
            <Input
              id="forgotEmail"
              type="email"
              placeholder="Enter your email"
              value={forgotEmail}
              onChange={handleEmailChange}
              required
              className="border-black text-black bg-white placeholder-gray-400"
            />
          </div>
          {/* Hiển thị ô OTP nếu email hợp lệ */}
          {isEmailValid && (
            <motion.div
              variants={otpVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              <Label htmlFor="otp" className="text-black">
                OTP
              </Label>
              <InputOTP id="otp" maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </motion.div>
          )}
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={!isEmailValid || (isEmailValid && otp.length !== 6)} // Chỉ cho phép submit khi email hợp lệ và OTP đủ 6 ký tự
          >
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ForgotPasswordDialog
