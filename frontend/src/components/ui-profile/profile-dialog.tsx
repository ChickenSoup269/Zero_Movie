/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { UserService } from "@/services/userService"
import { ErrorToast } from "@/components/ui-notification/error-toast"
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { Camera, Key } from "lucide-react" // Thêm icon Key
import ForgotPasswordDialog from "@/components/ui-login/forgot-password-dialog" // Import ForgotPasswordDialog

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
  userProfile: any
  onProfileUpdate: (updatedProfile: any) => void
}

export default function ProfileDialog({
  open,
  onOpenChange,
  user,
  userProfile,
  onProfileUpdate,
}: ProfileDialogProps) {
  const [formData, setFormData] = useState({
    fullName: userProfile?.fullName || user?.fullName || "",
    username: userProfile?.username || user?.username || "",
    avatar: userProfile?.avatar || user?.avatar || "",
    backgroundImage:
      userProfile?.backgroundImage || user?.backgroundImage || "",
  })
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isForgotPasswordDialogOpen, setIsForgotPasswordDialogOpen] =
    useState(false) // State để mở ForgotPasswordDialog

  const errorToast = ErrorToast({
    title: "Error",
    description: "Failed to update profile.",
    duration: 3000,
  })

  const successToast = SuccessToast({
    title: "Success!",
    description: "Profile updated successfully.",
    duration: 3000,
  })

  useEffect(() => {
    setFormData({
      fullName: userProfile?.fullName || user?.fullName || "",
      username: userProfile?.username || user?.username || "",
      avatar: userProfile?.avatar || user?.avatar || "",
      backgroundImage:
        userProfile?.backgroundImage || user?.backgroundImage || "",
    })
  }, [user, userProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setFormData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }))
    }
  }

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setBackgroundFile(file)
      setFormData((prev) => ({
        ...prev,
        backgroundImage: URL.createObjectURL(file),
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("fullName", formData.fullName)
      formDataToSend.append("username", formData.username)
      if (avatarFile) {
        formDataToSend.append("avatar", avatarFile)
      }
      if (backgroundFile) {
        formDataToSend.append("backgroundImage", backgroundFile)
      }

      const response = await UserService.updateUserProfile(
        user.id,
        formDataToSend // Sửa lại để gửi FormData trực tiếp
      )
      onProfileUpdate(response.data)
      successToast.showToast()
      onOpenChange(false)
    } catch (error: any) {
      errorToast.showToast({
        description: error.message || "Failed to update profile.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] w-[90%]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Background Image */}
              <div className="relative h-32 w-full rounded-lg overflow-hidden">
                {formData.backgroundImage ? (
                  <Image
                    src={formData.backgroundImage}
                    alt="Background"
                    layout="fill"
                    objectFit="cover"
                    className="brightness-75"
                  />
                ) : (
                  <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Background</span>
                  </div>
                )}
                <label
                  htmlFor="background-upload"
                  className="absolute inset-0 flex items-center justify-center cursor-pointer hover:bg-black/20 transition-colors"
                >
                  <Camera className="h-6 w-6 text-white" />
                  <input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBackgroundChange}
                  />
                </label>
              </div>

              {/* Avatar */}
              <div className="relative -mt-16 mx-auto h-24 w-24 rounded-full border-4 border-white">
                {formData.avatar ? (
                  <>
                    <Image
                      src={formData.avatar}
                      alt={formData.fullName || "User"}
                      width={96}
                      height={96}
                      className="absolute rounded-full blur-md opacity-80 scale-110"
                      style={{ filter: "brightness(1.2)" }}
                    />
                    <Image
                      src={formData.avatar}
                      alt={formData.fullName || "User"}
                      width={96}
                      height={96}
                      className="relative rounded-full"
                    />
                  </>
                ) : (
                  <Avatar className="h-24 w-24">
                    <AvatarFallback
                      className="bg-[#4599e3] text-white text-2xl"
                      style={{
                        filter: "drop-shadow(0 0 8px rgba(69, 153, 227, 0.8))",
                      }}
                    >
                      {formData.fullName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer hover:bg-black/20 transition-colors"
                >
                  <Camera className="h-6 w-6 text-white" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email (Cannot be changed)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="email"
                      name="email"
                      value={userProfile?.email || user?.email || "No email"}
                      disabled
                      className="bg-gray-100"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsForgotPasswordDialogOpen(true)}
                      className="flex items-center space-x-1"
                    >
                      <Key className="h-4 w-4" />
                      <span>Reset Password</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ForgotPasswordDialog */}
      <ForgotPasswordDialog
        open={isForgotPasswordDialogOpen}
        setOpenDialog={setIsForgotPasswordDialogOpen}
      />
    </>
  )
}
