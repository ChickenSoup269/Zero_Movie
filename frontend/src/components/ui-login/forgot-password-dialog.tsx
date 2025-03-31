import { motion } from "framer-motion"
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useState, useEffect } from "react"

interface ForgotPasswordDialogProps {
  open: boolean
  setOpenDialog: (value: boolean) => void
}

const ForgotPasswordDialog = ({
  open,
  setOpenDialog,
}: ForgotPasswordDialogProps) => {
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [showEmailTooltip, setShowEmailTooltip] = useState(false)
  const [isEmailValid, setIsEmailValid] = useState(false)

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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForgotEmail(e.target.value)
    if (isSubmitted) {
      const isValid = validateEmail()
      setIsEmailValid(isValid)
    }
  }

  const handleInput = () => {
    if (isSubmitted) {
      const isValid = validateEmail()
      setIsEmailValid(isValid)
    }
  }

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
    setIsEmailValid(isValid)
  }

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6) {
      console.log("Forgot password email:", forgotEmail, "OTP:", otp)
      setOpenDialog(false)
      setForgotEmail("")
      setOtp("")
      setIsEmailValid(false)
      setIsSubmitted(false)
    }
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white border-black">
          <DialogHeader>
            <DialogTitle className="text-black">Reset Password</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={
              isEmailValid ? handleOTPSubmit : handleForgotPasswordSubmit
            }
            className="space-y-4"
          >
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
                    disabled={isEmailValid}
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

            {isEmailValid && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
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
              disabled={isEmailValid && otp.length !== 6}
            >
              {isEmailValid ? "Verify OTP" : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

export default ForgotPasswordDialog
