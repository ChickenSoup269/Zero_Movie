/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ErrorToast } from "@/components/ui-notification/error-toast"
import { useUser } from "@/hooks/use-user"
import { User, Mail, Settings, Ticket, LogOut, Shield } from "lucide-react"
import ProfileDialog from "./profile-dialog"
import UserService from "@/services/userService"
import { getFullImageUrl } from "@/utils/getFullImageUrl"
import axios from "axios"

// Create an axios instance for JWT handling
const axiosJWT = axios.create()

interface UserProfileDropdownProps {
  isLoggedIn: boolean
  user: any
}

export default function UserProfileDropdown({
  isLoggedIn,
  user,
}: UserProfileDropdownProps) {
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const [avatarError, setAvatarError] = useState(false)
  const { logout } = useUser()

  const errorToast = ErrorToast({
    title: "Error",
    description: "Failed to load user profile.",
    duration: 3000,
  })

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn && user?.id) {
        try {
          const response = await UserService.getProfile()
          setUserProfile(response.data)
          setAvatarError(false)
        } catch (error: any) {
          console.error(
            "Error fetching user profile:",
            error.response?.data,
            error.response?.status,
            error.message
          )
          errorToast.showToast({
            description:
              error.response?.data?.message ||
              error.message ||
              "Failed to load user profile.",
          })
        }
      }
    }
    fetchUserProfile()
  }, [isLoggedIn, user])

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile)
    setAvatarError(false)
  }

  useEffect(() => {
    const responseInterceptor = axiosJWT.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token hết hạn, thực hiện logout
          await handleAutoLogout()
        }
        return Promise.reject(error)
      }
    )

    return () => {
      // Cleanup interceptor khi component unmount
      axiosJWT.interceptors.response.eject(responseInterceptor)
    }
  }, [logout]) // Thêm logout vào dependencies

  const handleAutoLogout = async () => {
    try {
      // Gọi hàm logout từ useUser hook
      await logout()

      // Có thể thêm thông báo hoặc redirect nếu cần
      console.log("Tự động logout do token hết hạn")

      // Redirect về trang login
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Lỗi khi tự động logout:", error)
    }
  }

  const isAdmin = userProfile?.role === "admin"

  // Tính toán avatarUrl
  const avatarUrl = getFullImageUrl(userProfile?.avatar || user?.avatar || "")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative h-8 w-8">
            <div className="relative w-full h-full rounded-full overflow-hidden cursor-pointer">
              {avatarUrl && !avatarError ? (
                <Image
                  src={avatarUrl}
                  alt={userProfile?.fullName || user?.fullName || "User"}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full" // Quan trọng
                  style={{
                    borderRadius: "50%", // Đảm bảo bo tròn
                    aspectRatio: "1/1", // Giữ tỉ lệ vuông
                  }}
                  onError={() => setAvatarError(true)}
                />
              ) : (
                <Avatar className="h-full w-full">
                  <AvatarFallback
                    className="bg-[#4599e3] text-white flex items-center justify-center"
                    style={{
                      fontSize: "0.75rem", // Kích thước chữ phù hợp
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    {(userProfile?.fullName || user?.fullName)
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <p className="text-sm font-medium leading-none">
                  {userProfile?.fullName || user?.fullName || "User"}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <p className="text-xs leading-none text-muted-foreground">
                  {userProfile?.email || user?.email || "No email"}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setIsProfileDialogOpen(true)}
              className="flex items-center space-x-2"
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/orders" className="flex items-center space-x-2">
                <Ticket className="h-4 w-4" />
                <span>My Tickets</span>
              </Link>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link href="/admin" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Admin Page</span>
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="text-red-500 hover:text-red-700 flex items-center space-x-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        user={user}
        userProfile={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />
    </>
  )
}
