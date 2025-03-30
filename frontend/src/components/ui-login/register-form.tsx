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
  return (
    <motion.div
      variants={tabVariantsRight}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.5 }}
      layout
    >
      <form onSubmit={handleRegisterSubmit}>
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
                staggerChildren: 0.2, // Các phần tử con xuất hiện cách nhau 0.2s
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
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                className="border-black text-black bg-white placeholder-gray-400"
              />
            </motion.div>
            <motion.div variants={childVariants} className="space-y-2">
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
            </motion.div>
            <motion.div variants={childVariants}>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Create a password"
                value={registerData.password}
                onChange={handleRegisterChange}
                showPassword={showRegisterPassword}
                setShowPassword={setShowRegisterPassword}
              />
            </motion.div>
            <motion.div variants={childVariants}>
              <PasswordInput
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                showPassword={showConfirmPassword}
                setShowPassword={setShowConfirmPassword}
              />
            </motion.div>
            <motion.div
              variants={childVariants}
              className="flex items-center justify-end space-x-2"
            >
              <Checkbox id="terms" className="border-black" />
              <Label htmlFor="terms" className="text-sm text-black">
                I agree to the terms
              </Label>
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
  )
}

export default RegisterForm
