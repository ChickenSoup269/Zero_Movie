/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import emailjs from "@emailjs/browser"
import { EMAILJS_PUBLIC_KEY } from "@/api/key"
import PasswordInput from "./password-input"
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { ErrorToast } from "@/components/ui-notification/error-toast"

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
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [showResetForm, setShowResetForm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordError, setPasswordError] = useState("")

  // Khởi tạo SuccessToast và ErrorToast
  const successToast = SuccessToast({
    title: "Success!",
    description: "Your password has been reset successfully.",
    duration: 3000,
  })

  const errorToast = ErrorToast({
    title: "Error",
    description: "Invalid OTP. Please try again.",
    duration: 3000,
  })

  const generateOTP = () => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[digits[i], digits[j]] = [digits[j], digits[i]]
    }
    return digits.slice(0, 6).join("")
  }

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

  const sendOtpEmail = async (email: string, otp: string) => {
    const templateParams = {
      email: email,
      otp: otp,
      name: email.split("@")[0],
    }

    console.log("Sending email with params:", templateParams)

    try {
      const response = await emailjs.send(
        "service_rcd6nxv",
        "template_3ptxgn1",
        templateParams,
        EMAILJS_PUBLIC_KEY
      )
      console.log(
        "OTP email sent successfully!",
        response.status,
        response.text
      )
    } catch (error: any) {
      console.error("Failed to send OTP email:", error.text || error)
      setEmailError("Failed to send OTP. Please try again.")
    }
  }

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    const isValid = validateEmail()
    if (isValid) {
      const newOtp = generateOTP()
      setGeneratedOtp(newOtp)
      console.log("Generated OTP:", newOtp)
      await sendOtpEmail(forgotEmail, newOtp)
      setIsEmailValid(true)
    }
  }

  const handleOTPSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length === 6 && otp === generatedOtp) {
      console.log("OTP verified successfully for email:", forgotEmail)
      setShowResetForm(true)
    } else {
      console.log("Invalid OTP")
      setOtp("")
      errorToast.showToast() // Gọi ErrorToast khi OTP sai
    }
  }

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.")
      return
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.")
      return
    }
    setPasswordError("")
    console.log("New password set successfully:", newPassword)

    successToast.showToast() // Gọi SuccessToast khi reset thành công

    setOpenDialog(false)
    setForgotEmail("")
    setOtp("")
    setIsEmailValid(false)
    setIsSubmitted(false)
    setGeneratedOtp("")
    setShowResetForm(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white border-black">
          <DialogHeader>
            <DialogTitle className="text-black">
              {showResetForm ? "Reset Your Password" : "Reset Password"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={
              showResetForm
                ? handleResetPasswordSubmit
                : isEmailValid
                ? handleOTPSubmit
                : handleForgotPasswordSubmit
            }
            className="space-y-4"
          >
            {!showResetForm ? (
              <>
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
                    <InputOTP
                      id="otp"
                      maxLength={6}
                      value={otp}
                      onChange={setOtp}
                    >
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
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-black">
                    New Password
                  </Label>
                  <PasswordInput
                    id="newPassword"
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    showPassword={showNewPassword}
                    setShowPassword={setShowNewPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-black">
                    Confirm Password
                  </Label>
                  <PasswordInput
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    showPassword={showConfirmPassword}
                    setShowPassword={setShowConfirmPassword}
                    isConfirmPassword={true}
                  />
                </div>
                {passwordError && (
                  <p className="text-red-500 text-sm">{passwordError}</p>
                )}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-black text-white hover:bg-gray-800"
              disabled={
                (isEmailValid && !showResetForm && otp.length !== 6) ||
                (showResetForm && (!newPassword || !confirmPassword))
              }
            >
              {showResetForm
                ? "Reset Password"
                : isEmailValid
                ? "Verify OTP"
                : "Submit"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

export default ForgotPasswordDialog
