/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion"
import {
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import PasswordInput from "./password-input"
import OTPDialog from "./OTP-dialog"
import { useState, useEffect } from "react"
import zxcvbn from "zxcvbn"
import emailjs from "@emailjs/browser"
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { ErrorToast } from "@/components/ui-notification/error-toast"
import { useRouter } from "next/navigation"
import { register } from "@/services/authService" // Import hàm register từ file API (thay đường dẫn theo đúng cấu trúc dự án của bạn)

const tabVariantsRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -40 },
}

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

interface RegisterFormProps {
  registerData: {
    email: string
    username: string
    password: string
    confirmPassword: string
    fullName?: string // Thêm fullName vào registerData
  }
  handleRegisterChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRegisterSubmit: (e: React.FormEvent) => void
  showRegisterPassword: boolean
  setShowRegisterPassword: (value: boolean) => void
  showConfirmPassword: boolean
  setShowConfirmPassword: (value: boolean) => void
}

const RegisterForm = ({
  registerData,
  handleRegisterChange,
  handleRegisterSubmit,
  showRegisterPassword,
  setShowRegisterPassword,
  showConfirmPassword,
  setShowConfirmPassword,
}: RegisterFormProps) => {
  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "", // Thêm lỗi cho fullName
    terms: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
    fullName: false, // Thêm touched cho fullName
  })
  const [showEmailTooltip, setShowEmailTooltip] = useState(false)
  const [showUsernameTooltip, setShowUsernameTooltip] = useState(false)
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false)
  const [showConfirmPasswordTooltip, setShowConfirmPasswordTooltip] =
    useState(false)
  const [showFullNameTooltip, setShowFullNameTooltip] = useState(false) // Thêm tooltip cho fullName
  const [openOTPDialog, setOpenOTPDialog] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false)
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [otpExpiry, setOtpExpiry] = useState<number | null>(null)
  const [countdown, setCountdown] = useState(90)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()

  useEffect(() => {
    const emailJsPublicKey = process.env.EMAILJS_PUBLIC_KEY ?? ""
    if (!emailJsPublicKey) {
      console.error(
        "EMAILJS_PUBLIC_KEY is not defined in the environment variables."
      )
      return
    }
    emailjs.init(emailJsPublicKey)
  }, [])

  useEffect(() => {
    if (openOTPDialog && otpExpiry) {
      const interval = setInterval(() => {
        const timeLeft = Math.max(
          0,
          Math.floor((otpExpiry - Date.now()) / 1000)
        )
        setCountdown(timeLeft)
        if (timeLeft === 0) {
          setGeneratedOtp("")
          clearInterval(interval)
        }
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [openOTPDialog, otpExpiry])

  const successOtpSentToast = SuccessToast({
    title: "OTP Sent!",
    description: "Check your email for the OTP.",
    duration: 3000,
  })

  const successRegisterToast = SuccessToast({
    title: "Success!",
    description: "Your account has been created successfully.",
    duration: 3000,
  })

  const errorToast = ErrorToast({
    title: "Error",
    description: "Invalid OTP. Please try again.",
    duration: 3000,
  })

  const errorEmailToast = ErrorToast({
    title: "Error",
    description: "Failed to send OTP. Please try again.",
    duration: 3000,
  })

  const errorRegisterToast = ErrorToast({
    title: "Registration Failed",
    description: "An error occurred during registration. Please try again.",
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

  const sendOtpEmail = async (email: string, otp: string) => {
    const templateParams = {
      email: email,
      otp: otp,
      name: registerData.username || email.split("@")[0],
    }

    try {
      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_PASSWORD_ID || "",
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ""
      )
      console.log(
        "OTP email sent successfully!",
        response.status,
        response.text
      )
      successOtpSentToast.showToast()
      setOtpExpiry(Date.now() + 90 * 1000)
      setCountdown(90)
    } catch (error: any) {
      console.error("Failed to send OTP email:", error.text || error)
      errorEmailToast.showToast({
        description: "Failed to send OTP. Please try again.",
      })
      throw error
    }
  }

  const validateForm = () => {
    const newErrors = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      terms: "",
    }

    if (!registerData.email) {
      newErrors.email = "This field cannot be empty."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = "Email is invalid."
    }

    if (!registerData.username) {
      newErrors.username = "This field cannot be empty."
    } else if (registerData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters."
    }

    if (!registerData.password) {
      newErrors.password = "This field cannot be empty."
    } else {
      const passwordStrength = zxcvbn(registerData.password)
      if (passwordStrength.score < 3) {
        newErrors.password =
          "Password is too weak. Use at least 8 characters, including uppercase, lowercase, numbers, and special characters."
      }
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "This field cannot be empty."
    } else if (registerData.confirmPassword !== registerData.password) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    if (!registerData.fullName) {
      newErrors.fullName = "This field cannot be empty."
    } else if (registerData.fullName.length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters."
    }

    if (!termsAgreed) {
      newErrors.terms = "You must agree to the terms."
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    const isValid = validateForm()
    if (isValid) {
      const newOtp = generateOTP()
      setGeneratedOtp(newOtp)
      try {
        await sendOtpEmail(registerData.email, newOtp)
        setOpenOTPDialog(true)
      } catch (error) {
        // Lỗi đã được xử lý bằng toast trong sendOtpEmail
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    handleRegisterChange(e)
    if (isSubmitted) {
      validateForm()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (isSubmitted) {
      validateForm()
    }
  }

  const handleTermsChange = (checked: boolean) => {
    setTermsAgreed(checked)
    if (isSubmitted) {
      validateForm()
    }
  }

  useEffect(() => {
    if (
      isSubmitted &&
      errors.email &&
      registerData.email &&
      errors.email !== "This field cannot be empty."
    ) {
      setShowEmailTooltip(true)
      const timer = setTimeout(() => setShowEmailTooltip(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowEmailTooltip(false)
    }

    if (
      isSubmitted &&
      errors.username &&
      registerData.username &&
      errors.username !== "This field cannot be empty."
    ) {
      setShowUsernameTooltip(true)
      const timer = setTimeout(() => setShowUsernameTooltip(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowUsernameTooltip(false)
    }

    if (
      isSubmitted &&
      errors.password &&
      registerData.password &&
      errors.password !== "This field cannot be empty."
    ) {
      setShowPasswordTooltip(true)
      const timer = setTimeout(() => setShowPasswordTooltip(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowPasswordTooltip(false)
    }

    if (
      isSubmitted &&
      errors.confirmPassword &&
      registerData.confirmPassword &&
      errors.confirmPassword !== "This field cannot be empty."
    ) {
      setShowConfirmPasswordTooltip(true)
      const timer = setTimeout(() => setShowConfirmPasswordTooltip(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowConfirmPasswordTooltip(false)
    }

    if (
      isSubmitted &&
      errors.fullName &&
      registerData.fullName &&
      errors.fullName !== "This field cannot be empty."
    ) {
      setShowFullNameTooltip(true)
      const timer = setTimeout(() => setShowFullNameTooltip(false), 3000)
      return () => clearTimeout(timer)
    } else {
      setShowFullNameTooltip(false)
    }
  }, [
    isSubmitted,
    errors.email,
    errors.username,
    errors.password,
    errors.confirmPassword,
    errors.fullName,
    registerData.email,
    registerData.username,
    registerData.password,
    registerData.confirmPassword,
    registerData.fullName,
  ])

  const handleOTPSubmit = async (otp: string) => {
    if (countdown === 0) {
      errorToast.showToast({
        description: "OTP has expired. Please request a new one.",
      })
      return
    }
    if (otp === generatedOtp) {
      setIsLoading(true)
      try {
        // Gọi API đăng ký
        const response = await register({
          email: registerData.email,
          username: registerData.username,
          password: registerData.password,
          fullName: registerData.fullName || "", // Đảm bảo fullName không undefined
        })
        console.log("Registration successful! API Response:", response)

        // Lưu access_token nếu API trả về
        if (response.access_token) {
          localStorage.setItem("access_token", response.access_token)
        }

        successRegisterToast.showToast()
        setOpenOTPDialog(false)
        handleRegisterSubmit({ preventDefault: () => {} } as React.FormEvent)

        // Chuyển hướng đến trang đăng nhập
        router.push("/login")
      } catch (error: any) {
        console.error("Registration failed:", error)
        errorRegisterToast.showToast({
          description:
            error.message ||
            "An error occurred during registration. Please try again.",
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      errorToast.showToast({
        description: "Invalid OTP. Please try again.",
      })
    }
  }

  const handleResendOTP = async () => {
    const newOtp = generateOTP()
    setGeneratedOtp(newOtp)
    try {
      await sendOtpEmail(registerData.email, newOtp)
    } catch (error) {
      // Lỗi đã được xử lý bằng toast trong sendOtpEmail
    }
  }

  return (
    <TooltipProvider>
      <div>
        <motion.div
          variants={tabVariantsRight}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={{ duration: 0.5 }}
          layout
        >
          <form onSubmit={handleSubmit} noValidate>
            <motion.div variants={childVariants}>
              <CardHeader>
                <CardTitle className="text-black text-center text-xl">
                  Sign Up
                </CardTitle>
                <CardDescription className="text-gray-600 text-center">
                  Create a new account to get started
                </CardDescription>
              </CardHeader>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
              initial="hidden"
              animate="visible"
            >
              <CardContent className="space-y-4">
                <motion.div variants={childVariants} className="space-y-1">
                  <Label htmlFor="email" className="text-black">
                    Email
                  </Label>
                  <Tooltip open={showEmailTooltip}>
                    <TooltipTrigger asChild>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder={
                          isSubmitted && errors.email && !registerData.email
                            ? errors.email
                            : "Enter your email"
                        }
                        value={registerData.email}
                        onChange={handleInputChange}
                        onInput={handleInput}
                        className={`border ${
                          isSubmitted && errors.email
                            ? "border-red-500 placeholder:text-red-500"
                            : touched.email && registerData.email
                            ? "border-green-500"
                            : "border-gray-300"
                        } text-black bg-white placeholder-gray-400 transition-all duration-300 rounded-md focus:ring-0 focus:border-gray-500`}
                      />
                    </TooltipTrigger>
                    {isSubmitted &&
                      errors.email &&
                      registerData.email &&
                      errors.email !== "This field cannot be empty." && (
                        <TooltipContent side="bottom">
                          <p className="text-red-500 text-xs">{errors.email}</p>
                        </TooltipContent>
                      )}
                  </Tooltip>
                </motion.div>
                <motion.div variants={childVariants} className="space-y-1">
                  <Label htmlFor="fullName" className="text-black">
                    Full Name
                  </Label>
                  <Tooltip open={showFullNameTooltip}>
                    <TooltipTrigger asChild>
                      <Input
                        id="fullName"
                        name="fullName"
                        type="text"
                        placeholder={
                          isSubmitted &&
                          errors.fullName &&
                          !registerData.fullName
                            ? errors.fullName
                            : "Enter your full name"
                        }
                        value={registerData.fullName || ""}
                        onChange={handleInputChange}
                        onInput={handleInput}
                        className={`border ${
                          isSubmitted && errors.fullName
                            ? "border-red-500 placeholder:text-red-500"
                            : touched.fullName && registerData.fullName
                            ? "border-green-500"
                            : "border-gray-300"
                        } text-black bg-white placeholder-gray-400 transition-all duration-300 rounded-md focus:ring-0 focus:border-gray-500`}
                      />
                    </TooltipTrigger>
                    {isSubmitted &&
                      errors.fullName &&
                      registerData.fullName &&
                      errors.fullName !== "This field cannot be empty." && (
                        <TooltipContent side="bottom">
                          <p className="text-red-500 text-xs">
                            {errors.fullName}
                          </p>
                        </TooltipContent>
                      )}
                  </Tooltip>
                </motion.div>
                <motion.div variants={childVariants} className="space-y-1">
                  <Label htmlFor="username" className="text-black">
                    Username
                  </Label>
                  <Tooltip open={showUsernameTooltip}>
                    <TooltipTrigger asChild>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder={
                          isSubmitted &&
                          errors.username &&
                          !registerData.username
                            ? errors.username
                            : "Choose a username"
                        }
                        value={registerData.username}
                        onChange={handleInputChange}
                        onInput={handleInput}
                        className={`border ${
                          isSubmitted && errors.username
                            ? "border-red-500 placeholder:text-red-500"
                            : touched.username && registerData.username
                            ? "border-green-500"
                            : "border-gray-300"
                        } text-black bg-white placeholder-gray-400 transition-all duration-300 rounded-md focus:ring-0 focus:border-gray-500`}
                      />
                    </TooltipTrigger>
                    {isSubmitted &&
                      errors.username &&
                      registerData.username &&
                      errors.username !== "This field cannot be empty." && (
                        <TooltipContent side="bottom">
                          <p className="text-red-500 text-xs">
                            {errors.username}
                          </p>
                        </TooltipContent>
                      )}
                  </Tooltip>
                </motion.div>
                <motion.div variants={childVariants}>
                  <Label htmlFor="password" className="text-black">
                    Password
                  </Label>
                  <Tooltip open={showPasswordTooltip}>
                    <TooltipTrigger asChild>
                      <PasswordInput
                        id="password"
                        name="password"
                        placeholder={
                          isSubmitted &&
                          errors.password &&
                          !registerData.password
                            ? errors.password
                            : "Create a password"
                        }
                        value={registerData.password}
                        onChange={handleInputChange}
                        onInput={handleInput}
                        showPassword={showRegisterPassword}
                        setShowPassword={setShowRegisterPassword}
                        error={isSubmitted && !!errors.password}
                        touched={touched.password && !!registerData.password}
                      />
                    </TooltipTrigger>
                    {isSubmitted &&
                      errors.password &&
                      registerData.password &&
                      errors.password !== "This field cannot be empty." && (
                        <TooltipContent side="bottom">
                          <p className="text-red-500 text-xs">
                            {errors.password}
                          </p>
                        </TooltipContent>
                      )}
                  </Tooltip>
                </motion.div>
                <motion.div variants={childVariants}>
                  <Label htmlFor="confirmPassword" className="text-black">
                    Confirm Password
                  </Label>
                  <Tooltip open={showConfirmPasswordTooltip}>
                    <TooltipTrigger asChild>
                      <PasswordInput
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder={
                          isSubmitted &&
                          errors.confirmPassword &&
                          !registerData.confirmPassword
                            ? errors.confirmPassword
                            : "Confirm your password"
                        }
                        value={registerData.confirmPassword}
                        onChange={handleInputChange}
                        onInput={handleInput}
                        showPassword={showConfirmPassword}
                        setShowPassword={setShowConfirmPassword}
                        error={isSubmitted && !!errors.confirmPassword}
                        touched={
                          touched.confirmPassword &&
                          !!registerData.confirmPassword
                        }
                        isConfirmPassword={true}
                      />
                    </TooltipTrigger>
                    {isSubmitted &&
                      errors.confirmPassword &&
                      registerData.confirmPassword &&
                      errors.confirmPassword !==
                        "This field cannot be empty." && (
                        <TooltipContent side="bottom">
                          <p className="text-red-500 text-xs">
                            {errors.confirmPassword}
                          </p>
                        </TooltipContent>
                      )}
                  </Tooltip>
                </motion.div>
                <motion.div
                  variants={childVariants}
                  className="flex items-center justify-end space-x-2 relative"
                >
                  <Checkbox
                    id="terms"
                    className="border-gray-300"
                    checked={termsAgreed}
                    onCheckedChange={handleTermsChange}
                  />
                  <Label htmlFor="terms" className="text-sm text-black">
                    I agree to the terms
                  </Label>
                  {isSubmitted && errors.terms && (
                    <motion.span
                      className="absolute left-0 top-5 text-red-500 text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {errors.terms}
                    </motion.span>
                  )}
                </motion.div>
              </CardContent>
            </motion.div>
            <motion.div variants={childVariants}>
              <CardFooter>
                <Button
                  type="submit"
                  className="btn-signIU w-full text-white hover:bg-gray-800"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </Button>
              </CardFooter>
            </motion.div>
          </form>
        </motion.div>
        <OTPDialog
          open={openOTPDialog}
          setOpen={setOpenOTPDialog}
          onSubmit={handleOTPSubmit}
          title="Verify OTP for Registration"
          countdown={countdown}
          onResend={handleResendOTP}
        />
      </div>
    </TooltipProvider>
  )
}

export default RegisterForm
