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
import PasswordInput from "./password-input"
import ForgotPasswordDialog from "./forgot-password-dialog"
import Image from "next/image"
import { useState, useEffect } from "react"
import axios, { AxiosError } from "axios"
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { ErrorToast } from "@/components/ui-notification/error-toast"

const axiosJWT = axios.create()
const API_URL = process.env.API_URL

const tabVariantsLeft = {
  hidden: { opacity: 0, x: -40 },
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

interface LoginFormProps {
  loginData: { email: string; password: string }
  handleLoginChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleLoginSubmit: (e: React.FormEvent) => void
  showLoginPassword: boolean
  setShowLoginPassword: (value: boolean) => void
  openDialog: boolean
  setOpenDialog: (value: boolean) => void
}

// Hàm gọi API đăng nhập
const loginUser = async (data: { email: string; password: string }) => {
  try {
    const res = await axiosJWT.post(`${API_URL}/user/login`, data)
    if (res.data.status === "ERR") {
      throw new Error(res.data.message)
    }
    return res.data
  } catch (error) {
    const axiosError = error as AxiosError
    throw axiosError.response ? axiosError.response.data : axiosError
  }
}

const LoginForm = ({
  loginData,
  handleLoginChange,
  handleLoginSubmit,
  showLoginPassword,
  setShowLoginPassword,
  openDialog,
  setOpenDialog,
}: LoginFormProps) => {
  const [rememberMe, setRememberMe] = useState(false)

  // Toast thông báo
  const successLoginToast = SuccessToast({
    title: "Success!",
    description: "You have successfully logged in.",
    duration: 3000,
  })

  const errorLoginToast = ErrorToast({
    title: "Login Failed",
    description: "Invalid email or password. Please try again.",
    duration: 3000,
  })

  useEffect(() => {
    const savedLogin = localStorage.getItem("rememberedLogin")
    if (savedLogin) {
      const { email, password } = JSON.parse(savedLogin)
      handleLoginChange({
        target: { name: "email", value: email },
      } as React.ChangeEvent<HTMLInputElement>)
      handleLoginChange({
        target: { name: "password", value: password },
      } as React.ChangeEvent<HTMLInputElement>)
      setRememberMe(true)
    }
  }, [handleLoginChange])

  const handleSubmitWithRemember = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rememberMe) {
      localStorage.setItem(
        "rememberedLogin",
        JSON.stringify({ email: loginData.email, password: loginData.password })
      )
    } else {
      localStorage.removeItem("rememberedLogin")
    }

    try {
      // Gọi API đăng nhập
      const response = await loginUser({
        email: loginData.email,
        password: loginData.password,
      })
      console.log("Login successful! API Response:", response)

      // Lưu token vào localStorage (giả định API trả về access_token)
      if (response.access_token) {
        localStorage.setItem("access_token", response.access_token)
      }

      // Hiển thị toast thành công
      successLoginToast.showToast()

      // Gọi hàm submit gốc để xử lý logic tiếp theo (nếu có)
      handleLoginSubmit(e)
    } catch (error: any) {
      console.error("Login failed:", error)
      errorLoginToast.showToast({
        description:
          error.message || "Invalid email or password. Please try again.",
      })
    }
  }

  return (
    <motion.div
      variants={tabVariantsLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      layout
    >
      <form onSubmit={handleSubmitWithRemember}>
        <motion.div variants={childVariants}>
          <CardHeader>
            <CardTitle className="text-black text-center text-xl">
              <Image
                src="/logo2.png"
                alt="Sign In Illustration"
                width={50}
                height={50}
                className="mt-4 mx-auto"
              />{" "}
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-600 text-center">
              Enter your credentials to access your account
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
            <motion.div variants={childVariants} className="space-y-2">
              <Label htmlFor="email" className="text-black">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                className="border-black text-black bg-white placeholder-gray-400"
              />
            </motion.div>
            <motion.div variants={childVariants}>
              <Label htmlFor="password" className="text-black">
                Password
              </Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Enter your password"
                value={loginData.password}
                onChange={handleLoginChange}
                showPassword={showLoginPassword}
                setShowPassword={setShowLoginPassword}
                disableStrengthCheck={true}
              />
            </motion.div>
            <motion.div
              variants={childVariants}
              className="flex items-center space-x-2"
            >
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="rememberMe" className="text-black text-sm">
                Remember Me
              </Label>
            </motion.div>
            <motion.div variants={childVariants} className="text-right">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setOpenDialog(true)
                }}
                className="text-sm text-black hover:underline"
              >
                Forgot Password?
              </a>
            </motion.div>
          </CardContent>
        </motion.div>
        <motion.div variants={childVariants}>
          <CardFooter>
            <Button type="submit" className="btn-signIU w-full text-white">
              Sign In
            </Button>
          </CardFooter>
        </motion.div>
      </form>
      <ForgotPasswordDialog open={openDialog} setOpenDialog={setOpenDialog} />
    </motion.div>
  )
}

export default LoginForm
