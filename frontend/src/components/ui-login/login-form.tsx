/* eslint-disable react-hooks/exhaustive-deps */
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
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { ErrorToast } from "@/components/ui-notification/error-toast"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user"

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

const LoginForm = ({
  loginData,
  handleLoginChange,
  showLoginPassword,
  setShowLoginPassword,
  openDialog,
  setOpenDialog,
}: LoginFormProps) => {
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { login } = useUser() // Sử dụng useUser

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
    const savedEmail = localStorage.getItem("rememberedEmail")
    if (savedEmail) {
      handleLoginChange({
        target: { name: "email", value: savedEmail },
      } as React.ChangeEvent<HTMLInputElement>)
      setRememberMe(true)
    }
  }, [])

  const handleSubmitWithRemember = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rememberMe) {
      localStorage.setItem("rememberedEmail", loginData.email)
    } else {
      localStorage.removeItem("rememberedEmail")
    }

    setIsLoading(true)
    try {
      await login({
        email: loginData.email,
        password: loginData.password,
      })
      successLoginToast.showToast()
      router.push("/")
    } catch (error: any) {
      console.error("Login failed:", error)
      errorLoginToast.showToast({
        description:
          error.message || "Invalid email or password. Please try again.",
      })
    } finally {
      setIsLoading(false)
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
              className="flex justify-between items-center w-full"
            >
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={rememberMe}
                  onCheckedChange={(checked) =>
                    setRememberMe(checked as boolean)
                  }
                />
                <Label htmlFor="rememberMe" className="text-black text-sm">
                  Remember Me
                </Label>
              </div>

              <motion.div variants={childVariants}>
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
            </motion.div>
          </CardContent>
        </motion.div>
        <motion.div variants={childVariants}>
          <CardFooter>
            <Button
              type="submit"
              className="btn-signIU w-full text-white bg-black"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </CardFooter>
        </motion.div>
      </form>
      <ForgotPasswordDialog open={openDialog} setOpenDialog={setOpenDialog} />
    </motion.div>
  )
}

export default LoginForm
