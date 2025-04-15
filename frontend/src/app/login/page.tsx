"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import BackButton from "@/components/ui-login/back-button"
import LoginForm from "@/components/ui-login/login-form"
import RegisterForm from "@/components/ui-login/register-form"
import "./login.css"

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
  exit: { opacity: 0, scale: 0.95 },
}

const LoginPage = () => {
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
  const [openDialog, setOpenDialog] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("activeTab") || "login"
  })

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab)
  }, [activeTab])

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value })
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({ ...registerData, [e.target.name]: e.target.value })
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Login data:", loginData)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Register data:", registerData)
  }

  return (
    <div className="login-page min-h-screen flex items-center justify-center relative duration-300">
      <BackButton />
      <Card className="w-full max-w-md border-black bg-white/90">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          key={activeTab}
        >
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value)}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-gray-200 ">
              <TabsTrigger
                value="login"
                className="text-black  data-[state=active]:bg-white  data-[state=active]:text-black dark:data-[state=active]:text-white   dark:data-[state=active]:bg-black"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="text-black   data-[state=active]:bg-white  data-[state=active]:text-black  dark:data-[state=active]:text-white dark:data-[state=active]:bg-black"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm
                loginData={loginData}
                handleLoginChange={handleLoginChange}
                handleLoginSubmit={handleLoginSubmit}
                showLoginPassword={showLoginPassword}
                setShowLoginPassword={setShowLoginPassword}
                openDialog={openDialog} // Truyền openDialog
                setOpenDialog={setOpenDialog}
              />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm
                registerData={registerData}
                handleRegisterChange={handleRegisterChange}
                handleRegisterSubmit={handleRegisterSubmit}
                showRegisterPassword={showRegisterPassword}
                setShowRegisterPassword={setShowRegisterPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </Card>
    </div>
  )
}

export default LoginPage
