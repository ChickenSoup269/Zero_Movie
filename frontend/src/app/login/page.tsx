"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Nếu dùng Next.js
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
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

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
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleRegisterChange = (e) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    console.log("Login data:", loginData)
  }

  const handleRegisterSubmit = (e) => {
    e.preventDefault()
    console.log("Register data:", registerData)
  }

  const handleBack = () => {
    router.back()
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

      <Card className="w-full max-w-md border-black bg-white">
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
                {/* Forgot Password */}
                <div className="text-right">
                  <a href="#" className="text-sm text-black hover:underline">
                    Forgotten Password?
                  </a>
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
                {/* Checkbox ở góc phải */}
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
