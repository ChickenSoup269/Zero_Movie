import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState } from "react"

const otpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
}

interface OTPDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
  onSubmit: (otp: string) => void
  title: string
  countdown: number // Nhận countdown từ parent
  onResend: () => void // Nhận hàm gửi lại OTP
}

const OTPDialog = ({
  open,
  setOpen,
  onSubmit,
  title,
  countdown,
  onResend,
}: OTPDialogProps) => {
  const [otp, setOtp] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(otp)
    if (countdown > 0) {
      setOtp("") // Chỉ reset OTP khi chưa hết thời gian, không đóng dialog
    }
  }

  const handleResend = () => {
    onResend()
    setOtp("") // Reset OTP khi gửi lại
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] bg-white border-black">
        <DialogHeader>
          <DialogTitle className="text-black">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="text-sm text-gray-600">
              Time remaining: {Math.floor(countdown / 60)}:
              {(countdown % 60).toString().padStart(2, "0")}
            </div>
            {countdown === 0 && (
              <Button
                type="button"
                onClick={handleResend}
                className="w-full bg-gray-500 text-white hover:bg-gray-600"
              >
                Resend OTP
              </Button>
            )}
          </motion.div>
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800"
            disabled={otp.length !== 6 || countdown === 0}
          >
            Verify OTP
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default OTPDialog
