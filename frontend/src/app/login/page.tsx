/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import "./login.css"

const LoginPage = () => {
  const router = useRouter()
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [registerData, setRegisterData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  })
  const [forgotEmail, setForgotEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const handleLoginChange = (e: { target: { name: any; value: any } }) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleRegisterChange = (e: { target: { name: any; value: any } }) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log("Login data:", loginData)
  }

  const handleRegisterSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log("Register data:", registerData)
  }

  const handleBack = () => {
    router.back()
  }

  const handleForgotPasswordSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    console.log("Forgot password email:", forgotEmail, "OTP:", otp)
    // Logic gửi OTP hoặc reset password ở đây
    setOpenDialog(false) // Đóng dialog sau khi submit
  }

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative">
      {/* Button quay lại */}
      <Button
        variant="ghost"
        className="absolute top-4 left-4 p-2 text-black hover:bg-gray-200"
        onClick={handleBack}
      >
        <ArrowLeftIcon className="h-6 w-6" />
      </Button>

      <Card className="w-full max-w-md border-black bg-white/90">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-200">
            <TabsTrigger
              value="login"
              className="text-black data-[state=active]:bg-white"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="text-black data-[state=active]:bg-white"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Tab Đăng nhập */}
          <TabsContent value="login">
            <form onSubmit={handleLoginSubmit}>
              <CardHeader>
                <CardTitle className="text-black">Sign In</CardTitle>
                <CardDescription className="text-gray-600">
                  Enter your credentials to access your account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                      className="border-black text-black bg-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                    >
                      {showLoginPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-black" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-black" />
                      )}
                    </button>
                  </div>
                </div>
                {/* Forgotten Password với Dialog */}
                <div className="text-right">
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                      <a
                        href="#"
                        className="text-sm text-black hover:underline"
                      >
                        Forgotten Password?
                      </a>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white border-black">
                      <DialogHeader>
                        <DialogTitle className="text-black">
                          Reset Password
                        </DialogTitle>
                      </DialogHeader>
                      <form
                        onSubmit={handleForgotPasswordSubmit}
                        className="space-y-4"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="forgotEmail" className="text-black">
                            Email
                          </Label>
                          <Input
                            id="forgotEmail"
                            type="email"
                            placeholder="Enter your email"
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            required
                            className="border-black text-black bg-white placeholder-gray-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="otp" className="text-black">
                            OTP
                          </Label>
                          <InputOTP
                            id="otp"
                            maxLength={6}
                            value={otp}
                            onChange={(value) => setOtp(value)}
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
                        </div>
                        <Button
                          type="submit"
                          className="w-full bg-black text-white hover:bg-gray-800"
                        >
                          Submit
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Sign In
                </Button>
              </CardFooter>
            </form>
          </TabsContent>

          {/* Tab Đăng ký */}
          <TabsContent value="register">
            <form onSubmit={handleRegisterSubmit}>
              <CardHeader>
                <CardTitle className="text-black">Sign Up</CardTitle>
                <CardDescription className="text-gray-600">
                  Create a new account to get started
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-black">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    required
                    className="border-black text-black bg-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-black">
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Choose a username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    required
                    className="border-black text-black bg-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-black">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showRegisterPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      required
                      className="border-black text-black bg-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() =>
                        setShowRegisterPassword(!showRegisterPassword)
                      }
                    >
                      {showRegisterPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-black" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-black" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-black">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      required
                      className="border-black text-black bg-white placeholder-gray-400"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeSlashIcon className="h-5 w-5 text-black" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-black" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <Checkbox id="terms" className="border-black" />
                  <Label htmlFor="terms" className="text-sm text-black">
                    I agree to the terms
                  </Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  Sign Up
                </Button>
              </CardFooter>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}

export default LoginPage
