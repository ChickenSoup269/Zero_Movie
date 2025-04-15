/* eslint-disable @typescript-eslint/no-explicit-any */
// UserProfileDropdown.tsx
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
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
import { User, Mail, Settings, Ticket, LogOut } from "lucide-react"
import ProfileDialog from "./profile-dialog"
import UserService from "@/services/userService"

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
  const [avatarError, setAvatarError] = useState(false) // Track avatar load errors
  const { logout } = useUser()

  const errorToast = ErrorToast({
    title: "Error",
    description: "Failed to load user profile.",
    duration: 3000,
  })

  useEffect(() => {
    console.log(
      "isLoggedIn:",
      isLoggedIn,
      "user:",
      user,
      "token:",
      localStorage.getItem("token")
    )
    const fetchUserProfile = async () => {
      if (isLoggedIn && user?.id) {
        try {
          const response = await UserService.getMyProfile()
          console.log("User profile from API:", response)
          setUserProfile(response)
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
    setAvatarError(false) // Reset avatar error on profile update
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <div className="relative w-8 h-8">
              {userProfile?.avatar && !avatarError ? (
                <>
                  <Image
                    src={userProfile.avatar}
                    alt={userProfile?.fullName || user?.fullName || "User"}
                    width={32}
                    height={32}
                    className="absolute rounded-full blur-md opacity-80 scale-110"
                    style={{ filter: "brightness(1.2)" }}
                    onError={() => setAvatarError(true)} // Set error state if blurred image fails
                  />
                  <Image
                    src={userProfile.avatar}
                    alt={userProfile?.fullName || user?.fullName || "User"}
                    width={32}
                    height={32}
                    className="relative rounded-full"
                    onError={() => setAvatarError(true)} // Set error state if main image fails
                  />
                </>
              ) : (
                <Avatar className="h-8 w-8 duration-300 cursor-pointer shadow-lg">
                  <AvatarFallback className="bg-[#4599e3] text-white">
                    {(userProfile?.fullName || user?.fullName)
                      ?.charAt(0)
                      .toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </Button>
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
