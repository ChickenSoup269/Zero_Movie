/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"
import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { ErrorToast } from "@/components/ui-notification/error-toast"
import { SuccessToast } from "@/components/ui-notification/success-toast"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, X } from "lucide-react"
import { getFullImageUrl } from "@/utils/getFullImageUrl"
import UserService from "@/services/userService"
import ForgotPasswordDialog from "@/components/ui-login/forgot-password-dialog"
import SettingsTabContent from "./settings-tab-content"
import ProfileTabContent from "./profile-tab-content"

// Other code remains the same...

export default function ProfileDialog({
  open,
  onOpenChange,
  user,
  userProfile,
  onProfileUpdate,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: any
  userProfile: any
  onProfileUpdate: (updatedProfile: any) => void
}) {
  // Your existing state declarations remain the same...
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
  const [isEditingFullName, setIsEditingFullName] = useState(false)
  const [isEditingUsername, setIsEditingUsername] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const isOnline = userProfile?.isOnline || user?.isOnline || true

  // Your existing toast and methods remain the same...
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

  // Enhanced tab animation variants
  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  }

  // Your existing methods remain the same...
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
    setIsEditingFullName(false)
    setIsEditingUsername(false)
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

  const handleEditFullName = (isEditing: boolean) => {
    setIsEditingFullName(isEditing)
    if (!isEditing) {
      setFormData((prev) => ({
        ...prev,
        fullName: userProfile?.fullName || user?.fullName || "",
      }))
    }
  }

  const handleEditUsername = (isEditing: boolean) => {
    setIsEditingUsername(isEditing)
    if (!isEditing) {
      setFormData((prev) => ({
        ...prev,
        username: userProfile?.username || user?.username || "",
      }))
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
            <div className="relative h-40 w-full group">
              {/* Background image với overlay */}
              {formData.backgroundImage && !backgroundError ? (
                <div className="relative h-40 w-full">
                  <Image
                    src={backgroundUrl || "/default-background.png"}
                    alt="Background"
                    fill
                    sizes="100%"
                    style={{ objectFit: "cover" }}
                    onError={() => setBackgroundError(true)}
                    priority
                    className="transition-opacity group-hover:opacity-70" // Giảm opacity khi hover
                  />
                  {/* Overlay đen khi hover */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              ) : (
                <div className="h-full w-full flex items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 group">
                  <span className="text-gray-500 dark:text-gray-400 font-mono text-lg group-hover:hidden">
                    No Background
                  </span>
                </div>
              )}

              {/* Camera icon chỉ hiện khi hover */}
              <label
                htmlFor="background-upload"
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              >
                <div className="p-3 bg-black/50 rounded-full hover:bg-black/70 transition-colors">
                  <Camera className="h-6 w-6 text-white" />
                </div>
                <input
                  id="background-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBackgroundChange}
                />
              </label>

              {/* Button X để xóa background (chỉ hiện khi có ảnh) */}
              {formData.backgroundImage && !backgroundError && (
                <button
                  type="button"
                  className="absolute top-2 right-2 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, backgroundImage: "" }))
                    setBackgroundFile(null)
                  }}
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              )}
            </div>

            {/* Avatar với hiệu ứng online */}
            <div className="absolute left-6 top-24 h-24 w-24 group">
              <div className="relative h-full w-full rounded-full border-2 border-white shadow-lg dark:shadow-gray-500/90">
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

                {/* Hiệu ứng online (chấm xanh) */}
                {isOnline && (
                  <div className="absolute bottom-1 right-1 h-4 w-4 bg-blue-400 rounded-full border-2 border-white animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Username và title cùng hàng */}
            <div className="flex items-end justify-between pt-16 px-6">
              <div className="flex flex-col">
                <h3 className="text-xl font-semibold">
                  {formData.fullName || "User"}
                </h3>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">
                    @{formData.username || "username"}
                  </span>
                  {isOnline && (
                    <span className="flex items-center gap-1 text-blue-400">
                      <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
                      Online
                    </span>
                  )}
                </div>
              </div>

              <motion.h3
                className="text-sm font-mono text-blue-400 pr-5"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                key={activeTab}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "profile" && "Edit Profile"}
                {activeTab === "settings" && "Edit Settings"}
                {activeTab === "tickets" && "My Tickets"}
                {activeTab === "movies" && "My Movies"}
              </motion.h3>
            </div>
          </DialogHeader>

          <Tabs
            defaultValue="profile"
            className="w-full px-6 relative"
            onValueChange={setActiveTab}
          >
            <TabsList className="flex relative bg-transparent mb-4 capitalize cursor-pointer">
              {["profile", "settings", "tickets", "movies"].map((tab) => (
                <TabsTrigger key={tab} value={tab} asChild>
                  <div className="relative px-4 py-2 ">
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="tabIndicator"
                        className="absolute bottom-0 left-4 right-4 h-1 bg-blue-400 rounded-full shadow-xl "
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </div>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="relative overflow-scroll min-h-[275px]">
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile-tab"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <ProfileTabContent
                      formData={formData}
                      user={user}
                      userProfile={userProfile}
                      isEditingFullName={isEditingFullName}
                      isEditingUsername={isEditingUsername}
                      isLoading={isLoading}
                      onInputChange={handleInputChange}
                      onEditFullName={handleEditFullName}
                      onEditUsername={handleEditUsername}
                      onResetPassword={() =>
                        setIsForgotPasswordDialogOpen(true)
                      }
                      onSubmit={handleSubmit}
                      onCancel={() => onOpenChange(false)}
                    />
                  </motion.div>
                )}
                {activeTab === "settings" && (
                  <motion.div
                    key="settings-tab"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <SettingsTabContent />
                  </motion.div>
                )}
                {activeTab === "tickets" && (
                  <motion.div
                    key="tickets-tab"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <div className="py-6">
                      <h3 className="text-lg font-medium">My Tickets</h3>
                      <p className="text-muted-foreground mt-2">
                        You don't have any tickets yet.
                      </p>
                    </div>
                  </motion.div>
                )}
                {activeTab === "movies" && (
                  <motion.div
                    key="movies-tab"
                    variants={tabVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute w-full"
                  >
                    <div className="py-6">
                      <h3 className="text-lg font-medium">My Movie List</h3>
                      <p className="text-muted-foreground mt-2">
                        Your movie list is empty.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>

      <ForgotPasswordDialog
        open={isForgotPasswordDialogOpen}
        setOpenDialog={setIsForgotPasswordDialogOpen}
        userEmail={userProfile?.email || user?.email}
      />
    </>
  )
}
