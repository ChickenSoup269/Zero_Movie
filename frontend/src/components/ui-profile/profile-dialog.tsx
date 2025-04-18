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
import { ErrorToast } from "@/components/ui-notification/error-toast"
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ForgotPasswordDialog from "@/components/ui-login/forgot-password-dialog"
import { Camera, Key } from "lucide-react"
import UserService from "@/services/userService"
import { getFullImageUrl } from "@/utils/getFullImageUrl"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: {
    fullName?: string
    username?: string
    avatar?: string
    backgroundImage?: string
    email?: string
  }
  userProfile?: {
    fullName?: string
    username?: string
    avatar?: string
    backgroundImage?: string
    email?: string
  }
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
    useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const [backgroundError, setBackgroundError] = useState(false)

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
    setAvatarError(false)
    setBackgroundError(false)
    setFormData({
      fullName: userProfile?.fullName || user?.fullName || "",
      username: userProfile?.username || user?.username || "",
      avatar: userProfile?.avatar || user?.avatar || "",
      backgroundImage:
        userProfile?.backgroundImage || user?.backgroundImage || "",
    })
    setAvatarFile(null)
    setBackgroundFile(null)
  }, [user, userProfile])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!validTypes.includes(file.type)) {
        errorToast.showToast({
          description: "Only JPEG, PNG, or GIF images are allowed.",
        })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        errorToast.showToast({
          description: "Image size must be less than 5MB.",
        })
        return
      }
      console.log("Selected avatar file:", file)
      setAvatarFile(file)
      setAvatarError(false)
      setFormData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }))
    }
  }

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files[0]) {
      const file = files[0]
      const validTypes = ["image/jpeg", "image/png", "image/gif"]
      if (!validTypes.includes(file.type)) {
        errorToast.showToast({
          description: "Only JPEG, PNG, or GIF images are allowed.",
        })
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        errorToast.showToast({
          description: "Image size must be less than 5MB.",
        })
        return
      }
      console.log("Selected background file:", file)
      setBackgroundFile(file)
      setBackgroundError(false)
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
      const profileData = {
        fullName: formData.fullName,
        username: formData.username,
        avatarFile: avatarFile || undefined,
        backgroundFile: backgroundFile || undefined,
      }

      console.log("Submitting profile data:", profileData)
      const response = await UserService.updateProfile(profileData)
      console.log("Profile update response:", response.data)

      // Lấy profile mới nhất
      const profileResponse = await UserService.getProfile()
      const updatedProfile = profileResponse.data
      console.log("Fetched profile:", updatedProfile)

      // Cập nhật formData
      setFormData({
        fullName: updatedProfile.fullName || "",
        username: updatedProfile.username || "",
        avatar: updatedProfile.avatar || "",
        backgroundImage: updatedProfile.backgroundImage || "",
      })

      onProfileUpdate(updatedProfile)
      successToast.showToast()
      setAvatarFile(null)
      setBackgroundFile(null)
      onOpenChange(false)
    } catch (error: any) {
      console.error("Error updating profile:", {
        message: error.message || "Unknown error",
        response: error.response?.data || null,
        status: error.response?.status || null,
        config: error.config || null,
      })
      errorToast.showToast({
        description:
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const avatarUrl = avatarFile
    ? formData.avatar
    : getFullImageUrl(formData.avatar)
  const backgroundUrl = backgroundFile
    ? formData.backgroundImage
    : getFullImageUrl(formData.backgroundImage)

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] w-[90%] p-0 overflow-hidden">
          <DialogHeader className="relative">
            <div className="relative h-40 w-full">
              {formData.backgroundImage && !backgroundError ? (
                <div className="relative h-40 w-full">
                  <Image
                    src={backgroundUrl || "/default-background.png"}
                    alt="Background"
                    fill
                    sizes="100%"
                    style={{ objectFit: "cover" }}
                    onError={() => {
                      console.error("Background load error:", backgroundUrl)
                      setBackgroundError(true)
                    }}
                    priority
                  />
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center rounded-2xl border-2 border-dashed border-black dark:border-white">
                  <span className="text-black dark:text-white font-mono text-lg">
                    No Background
                  </span>
                </div>
              )}
              <label
                htmlFor="background-upload"
                className="absolute bottom-2 right-2 p-1.5 bg-black/50 rounded-full cursor-pointer hover:bg-black/70 transition-colors"
              >
                <Camera className="h-4 w-4 text-white" />
                <input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBackgroundChange}
                />
              </label>
            </div>

            <div className="absolute left-6 top-24 h-24 w-24 group">
              <div className="relative h-full w-full rounded-full border-2 border-white overflow-hidden shadow-lg dark:shadow-gray-500/90">
                {formData.avatar && !avatarError ? (
                  <Image
                    src={avatarUrl || "/default-avatar.png"}
                    alt={formData.fullName || "User"}
                    fill
                    sizes="96px"
                    style={{ objectFit: "cover", objectPosition: "center" }}
                    className="rounded-full transition-opacity group-hover:opacity-75"
                    onError={() => {
                      console.error("Avatar load error:", avatarUrl)
                      setAvatarError(true)
                    }}
                    priority
                  />
                ) : (
                  <Avatar className="h-full w-full">
                    <AvatarFallback className="bg-[#4599e3] text-white text-2xl">
                      {formData.fullName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                )}
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer bg-black/30 rounded-full"
                >
                  <div className="p-2 bg-black/50 rounded-full">
                    <Camera className="h-5 w-5 text-white" />
                  </div>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>

            <DialogTitle className="pt-16 px-6">Edit Profile</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="profile" className="w-full px-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="movies">List Movies</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form onSubmit={handleSubmit} className="px-6 pb-6">
                <div className="space-y-4">
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
                          value={
                            userProfile?.email || user?.email || "No email"
                          }
                          disabled
                          className="bg-gray-100 dark:bg-gray-700"
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
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ForgotPasswordDialog
        open={isForgotPasswordDialogOpen}
        setOpenDialog={setIsForgotPasswordDialogOpen}
      />
    </>
  )
}
