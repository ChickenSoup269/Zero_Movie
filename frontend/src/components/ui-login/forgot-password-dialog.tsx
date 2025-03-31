import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import OTPDialog from "./OTP-dialog"
import { useState, useEffect } from "react"

interface ForgotPasswordDialogProps {
  open: boolean // Thêm prop open để kiểm soát trạng thái dialog
  setOpenDialog: (value: boolean) => void
}

const ForgotPasswordDialog = ({
  open,
  setOpenDialog,
}: ForgotPasswordDialogProps) => {
  const [forgotEmail, setForgotEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [showEmailTooltip, setShowEmailTooltip] = useState(false)
  const [openOTPDialog, setOpenOTPDialog] = useState(false)

  // Hàm kiểm tra email hợp lệ
  const validateEmail = () => {
    if (!forgotEmail) {
      setEmailError("This field cannot be empty.")
      return false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      setEmailError("Email is invalid.")
      return false
    }
    setEmailError("")
    return true
  }

  // Xử lý khi email thay đổi
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value
    setForgotEmail(email)
    if (isSubmitted) {
      validateEmail()
    }
  }

  // Xử lý sự kiện onInput để bắt autofill và copy-paste
  const handleInput = () => {
    if (isSubmitted) {
      validateEmail()
    }
  }

  // Hiển thị Tooltip khi có lỗi email không hợp lệ
  useEffect(() => {
    if (
      isSubmitted &&
      emailError &&
      forgotEmail &&
      emailError !== "This field cannot be empty."
    ) {
      setShowEmailTooltip(true)
      const timer = setTimeout(() => {
        setShowEmailTooltip(false)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShowEmailTooltip(false)
    }
  }, [isSubmitted, emailError, forgotEmail])

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    const isValid = validateEmail()
    if (isValid) {
      setOpenOTPDialog(true)
    }
  }

  const handleOTPSubmit = (otp: string) => {
    console.log("Forgot password email:", forgotEmail, "OTP:", otp)
    setOpenDialog(false)
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white border-black">
          <DialogHeader>
            <DialogTitle className="text-black">Reset Password</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgotEmail" className="text-black">
                Email
              </Label>
              <Tooltip open={showEmailTooltip}>
                <TooltipTrigger asChild>
                  <Input
                    id="forgotEmail"
                    type="email"
                    placeholder={
                      isSubmitted && emailError && !forgotEmail
                        ? emailError
                        : "Enter your email"
                    }
                    value={forgotEmail}
                    onChange={handleEmailChange}
                    onInput={handleInput}
                    className={`border ${
                      isSubmitted && emailError
                        ? "border-red-500 placeholder:text-red-500"
                        : forgotEmail && !emailError
                        ? "border-green-500"
                        : "border-gray-300"
                    } text-black bg-white placeholder-gray-400 transition-all duration-300 rounded-md focus:ring-0 focus:border-gray-500`}
                  />
                </TooltipTrigger>
                {isSubmitted &&
                  emailError &&
                  forgotEmail &&
                  emailError !== "This field cannot be empty." && (
                    <TooltipContent side="bottom">
                      <p className="text-red-500 text-xs">{emailError}</p>
                    </TooltipContent>
                  )}
              </Tooltip>
            </div>
            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
        <OTPDialog
          open={openOTPDialog}
          setOpen={setOpenOTPDialog}
          onSubmit={handleOTPSubmit}
          title="Verify OTP for Password Reset"
        />
      </Dialog>
      <OTPDialog
        open={openOTPDialog}
        setOpen={setOpenOTPDialog}
        onSubmit={handleOTPSubmit}
        title="Verify OTP for Password Reset"
      />
    </TooltipProvider>
  )
}

export default ForgotPasswordDialog
