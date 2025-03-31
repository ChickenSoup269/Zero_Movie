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
    terms: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [touched, setTouched] = useState({
    email: false,
    username: false,
    password: false,
    confirmPassword: false,
  })
  const [showEmailTooltip, setShowEmailTooltip] = useState(false)
  const [openOTPDialog, setOpenOTPDialog] = useState(false)
  const [termsAgreed, setTermsAgreed] = useState(false) // Thêm state để quản lý checkbox

  // Kiểm tra tính hợp lệ của các trường
  const validateForm = () => {
    const newErrors = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      terms: "",
    }

    if (!registerData.email) {
      newErrors.email = "This field cannot be empty."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = "Email is invalid."
    }

    if (!registerData.username) {
      newErrors.username = "This field cannot be empty."
    }

    if (!registerData.password) {
      newErrors.password = "This field cannot be empty."
    }

    if (!registerData.confirmPassword) {
      newErrors.confirmPassword = "This field cannot be empty."
    } else if (registerData.confirmPassword !== registerData.password) {
      newErrors.confirmPassword = "Passwords do not match."
    }

    if (!termsAgreed) {
      newErrors.terms = "You must agree to the terms."
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error)
  }

  // Xử lý khi nhấn nút Sign Up
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    const isValid = validateForm()
    if (isValid) {
      handleRegisterSubmit(e)
      setOpenOTPDialog(true)
    }
  }

  // Xử lý khi người dùng nhập thông tin (bao gồm autofill và copy-paste)
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    handleRegisterChange(e)
    if (isSubmitted) {
      validateForm()
    }
  }

  // Xử lý sự kiện onInput để bắt autofill và copy-paste
  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget
    setTouched((prev) => ({ ...prev, [name]: true }))
    if (isSubmitted) {
      validateForm()
    }
  }

  // Xử lý khi checkbox thay đổi
  const handleTermsChange = (checked: boolean) => {
    setTermsAgreed(checked)
    if (isSubmitted) {
      validateForm() // Cập nhật lỗi ngay khi checkbox thay đổi
    }
  }

  // Hiển thị Tooltip khi có lỗi email không hợp lệ
  useEffect(() => {
    if (
      isSubmitted &&
      errors.email &&
      registerData.email &&
      errors.email !== "This field cannot be empty."
    ) {
      setShowEmailTooltip(true)
      const timer = setTimeout(() => {
        setShowEmailTooltip(false)
      }, 3000)
      return () => clearTimeout(timer)
    } else {
      setShowEmailTooltip(false)
    }
  }, [isSubmitted, errors.email, registerData.email])

  const handleOTPSubmit = (otp: string) => {
    console.log("Registration OTP:", otp, "User Data:", registerData)
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
                <CardTitle className="text-black">Sign Up</CardTitle>
                <CardDescription className="text-gray-600">
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
                  <Label htmlFor="username" className="text-black">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder={
                      isSubmitted && errors.username && !registerData.username
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
                </motion.div>
                <motion.div variants={childVariants}>
                  <Label htmlFor="password" className="text-black">
                    Password
                  </Label>
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder={
                      isSubmitted && errors.password && !registerData.password
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
                </motion.div>
                <motion.div variants={childVariants}>
                  <Label htmlFor="confirmPassword" className="text-black">
                    Confirm Password
                  </Label>
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
                      touched.confirmPassword && !!registerData.confirmPassword
                    }
                  />
                </motion.div>
                <motion.div
                  variants={childVariants}
                  className="flex items-center justify-end space-x-2 relative"
                >
                  <Checkbox
                    id="terms"
                    className="border-gray-300"
                    checked={termsAgreed}
                    onCheckedChange={handleTermsChange} // Cập nhật state khi checkbox thay đổi
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
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Sign Up
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
        />
      </div>
    </TooltipProvider>
  )
}

export default RegisterForm
