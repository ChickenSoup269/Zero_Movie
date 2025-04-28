/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useRouter } from "next/navigation"

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
  const [ticketNotifications, setTicketNotifications] = useState<any[]>([])
  const { logout } = useUser()
  const router = useRouter()

  const errorToast = ErrorToast({
    title: "Error",
    description: "Failed to load user profile.",
    duration: 3000,
  })

  const sessionExpiredToast = ErrorToast({
    title: "Session Expired",
    description: "Your session has expired. Please log in again.",
    duration: 5000,
  })

  // Lấy danh sách thông báo vé từ localStorage
  useEffect(() => {
    const updateNotifications = () => {
      const notifications = JSON.parse(
        localStorage.getItem("ticketNotifications") || "[]"
      )
      setTicketNotifications(notifications)
    }
    updateNotifications()
    window.addEventListener("storage", updateNotifications)
    return () => window.removeEventListener("storage", updateNotifications)
  }, [])

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isLoggedIn && user?.id) {
        try {
          const response = await UserService.getProfile()
          setUserProfile(response.data)
          setAvatarError(false)
        } catch (error: any) {
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

  // Mở ProfileDialog với tab tickets
  const openTicketsTab = () => {
    setIsProfileDialogOpen(true)
    localStorage.setItem("activeProfileTab", "tickets")
  }

  useEffect(() => {
    const responseInterceptor = axiosJWT.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          try {
            const refreshToken = localStorage.getItem("refresh_token")
            if (refreshToken) {
              const refreshResponse = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
                { refreshToken }
              )
              const newAccessToken = refreshResponse.data.access_token
              localStorage.setItem("access_token", newAccessToken)
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
              return axiosJWT(originalRequest)
            } else {
              await handleAutoLogout()
            }
          } catch (refreshError) {
            await handleAutoLogout()
          }
        }
        return Promise.reject(error)
      }
    )
    return () => axiosJWT.interceptors.response.eject(responseInterceptor)
  }, [logout])

  const handleAutoLogout = async () => {
    try {
      await logout()
      sessionExpiredToast.showToast({
        description: "Your session has expired. Please log in again.",
      })
      router.push("/login")
    } catch (error) {
      router.push("/login")
    }
  }

  // Callback để xóa thông báo từ ProfileDialog
  const handleNotificationsCleared = () => {
    setTicketNotifications([])
  }

  const isAdmin = userProfile?.role === "admin"
  const avatarUrl = getFullImageUrl(userProfile?.avatar || user?.avatar || "")

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="relative h-8 w-8">
            <div className="relative w-full h-full rounded-full  cursor-pointer">
              {avatarUrl && !avatarError ? (
                <Image
                  src={avatarUrl}
                  alt={userProfile?.fullName || user?.fullName || "User"}
                  width={32}
                  height={32}
                  className="object-cover w-full h-full"
                  onError={() => setAvatarError(true)}
                  style={{
                    borderRadius: "50%",
                    aspectRatio: "1/1",
                    maxWidth: "100%",
                    height: "auto",
                  }}
                />
              ) : (
                <Avatar className="h-full w-full">
                  <AvatarFallback
                    className="bg-[#4599e3] text-white flex items-center justify-center"
                    style={{
                      fontSize: "0.75rem",
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
              {/* Hiển thị thông báo vé mới với chuông và số lượng */}
              {ticketNotifications.length > 0 && (
                <div
                  className="absolute -top-1 -right-1 cursor-pointer"
                  onClick={openTicketsTab}
                >
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {ticketNotifications.length}
                  </div>
                </div>
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
              onClick={() => {
                setIsProfileDialogOpen(true)
                localStorage.setItem("activeProfileTab", "profile")
              }}
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
            <DropdownMenuItem
              onClick={openTicketsTab}
              className="flex items-center space-x-2"
            >
              <Ticket className="h-4 w-4" />
              <span>
                My Tickets{" "}
                {ticketNotifications.length > 0 && (
                  <div
                    className="absolute -top-1 -right-1 cursor-pointer"
                    onClick={openTicketsTab}
                  >
                    <div className="absolute top-3 right-10 bg-red-500 rounded-md text-sm text-white px-4 h-4 w-4 flex items-center justify-center">
                      {ticketNotifications.length}
                    </div>
                  </div>
                )}
              </span>
            </DropdownMenuItem>
            {isAdmin && (
              <DropdownMenuItem asChild>
                <Link
                  href="/adminDashboard"
                  className="flex items-center space-x-2"
                >
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
        onNotificationsCleared={handleNotificationsCleared}
        ticketNotifications={ticketNotifications}
      />
    </>
  )
}
