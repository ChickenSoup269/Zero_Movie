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
import PasswordInput from "./password-input"
import ForgotPasswordDialog from "./forgot-password-dialog"
import Image from "next/image"

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
  handleLoginSubmit,
  showLoginPassword,
  setShowLoginPassword,
  openDialog,
  setOpenDialog,
}: LoginFormProps) => {
  return (
    <motion.div
      variants={tabVariantsLeft}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      layout
    >
      <form onSubmit={handleLoginSubmit}>
        <motion.div variants={childVariants}>
          <CardHeader>
            {/* <Image
                          src="/logo.png" // Đường dẫn đến hình ảnh trong thư mục public
                          alt="Sign In Illustration"
                          width={150} // Chiều rộng thực tế của hình ảnh (px)
                          height={120} // Chiều cao thực tế của hình ảnh (px)
                          className="mt-4 mx-auto" // Căn giữa và thêm khoảng cách trên bằng Tailwind
                        /> */}
            <CardTitle className="text-black text-center text-xl">
              <Image
                src="/logo2.png" // Đường dẫn đến hình ảnh trong thư mục public
                alt="Sign In Illustration"
                width={50} // Chiều rộng thực tế của hình ảnh (px)
                height={50} // Chiều cao thực tế của hình ảnh (px)
                className="mt-4 mx-auto" // Căn giữa và thêm khoảng cách trên bằng Tailwind
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
              <Label htmlFor="email" className="text-black">
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
                disableStrengthCheck={true} // Tắt kiểm tra độ mạnh
              />
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
            <Button type="submit" className="btn-signIU w-full text-white ">
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
