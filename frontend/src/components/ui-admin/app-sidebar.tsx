/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect } from "react"
import {
  Calendar,
  Film,
  Home,
  LogOut,
  Settings,
  Tag,
  Users,
  Menu,
  ChevronRight,
  ChevronLeft,
  Palette,
  CheckSquare,
  Projector,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"
import UserService from "@/services/userService"
import { logout } from "@/services/authService"
import { useToast } from "@/hooks/use-toast"
import ProfileDialog from "@/components/ui-profile/profile-dialog"
import { getFullImageUrl } from "@/utils/getFullImageUrl"
import CustomSwitch from "@/components/ui-navbar/switch-theme"
import Image from "next/image"

// Menu items
const mainMenuItems = [
  { title: "Dashboard", url: "/adminDashboard", icon: Home },
  { title: "Movies", url: "/movieAdmin", icon: Film },
  { title: "Users", url: "/movieUser", icon: Users },
  { title: "Cinema", url: "/adminCinema", icon: Projector },
  { title: "Tasks", url: "/adminTask", icon: CheckSquare },
  { title: "Calendar", url: "/admin/calendar", icon: Calendar },
]

interface AdminSidebarProps {
  className?: string
  defaultCollapsed?: boolean
}

export function AdminSidebar({
  className,
  defaultCollapsed = false,
}: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [user, setUser] = useState<{
    name: string
    email: string
    role: string
    avatar?: string
    fullName?: string
    username?: string
    backgroundImage?: string
  } | null>(null)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("darkMode")
    if (saved !== null) {
      setIsDarkMode(JSON.parse(saved))
    }
  }, [])

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getProfile()
        const profileData = response.data
        setUser({
          name: profileData.fullName || "Admin User",
          email: profileData.email || "admin@example.com",
          role: profileData.role || "Administrator",
          avatar: profileData.avatar
            ? getFullImageUrl(profileData.avatar)
            : "/api/placeholder/32/32", // Apply getFullImageUrl
          fullName: profileData.fullName,
          username: profileData.username,
          backgroundImage: profileData.backgroundImage,
        })
        setUserProfile(profileData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch user profile",
          variant: "destructive",
        })
        setUser({
          name: "Admin User",
          email: "admin@example.com",
          role: "Administrator",
          avatar: "/api/placeholder/32/32",
        })
      }
    }
    fetchUser()
  }, [toast])

  const handleDarkModeToggle = (checked: boolean) => {
    setIsDarkMode(checked)
    if (checked) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }
  const bottomMenuItems = [
    { title: "Settings", url: "/admin/settings", icon: Settings },
    {
      title: "Dark Mode",
      component: (
        <CustomSwitch
          checked={isDarkMode}
          onCheckedChange={handleDarkModeToggle}
        />
      ),
      icon: Palette,
    },
    { title: "Logout", url: "/logout", icon: LogOut },
  ]

  // Handle profile update
  const handleProfileUpdate = (updatedProfile: any) => {
    setUser((prev) => ({
      ...prev!,
      name: updatedProfile.fullName || prev!.name,
      avatar: updatedProfile.avatar
        ? getFullImageUrl(updatedProfile.avatar)
        : prev!.avatar, // Apply getFullImageUrl
      fullName: updatedProfile.fullName,
      username: updatedProfile.username,
      backgroundImage: updatedProfile.backgroundImage,
    }))
    setUserProfile(updatedProfile)
    toast({
      title: "Success",
      description: "Profile updated successfully",
    })
  }

  // Handle navigation
  const handleNavigation = (url: string, title: string) => {
    if (title === "Logout") {
      handleLogout()
    } else {
      router.push(url)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token") || ""
      await logout(refreshToken)
      localStorage.removeItem("access_token")
      localStorage.removeItem("refresh_token")
      toast({
        title: "Success",
        description: "Logged out successfully",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      })
    }
  }
  const handleBackHomeImage = async () => {
    router.push("/")
  }

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-background border-r transition-all duration-300",
        "sticky top-0",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center h-16 px-4 border-b">
        {!collapsed && (
          <div className="flex items-center flex-1 gap-2">
            <div className="w-20 h-20 rounded-md  flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Zero Movies Logo"
                width={120}
                height={100}
                className="cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={handleBackHomeImage}
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }} />
            </div>
            <span className="font-bold text-lg font-mono">Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-full">
            <div className="w-8 h-8 rounded-md flex items-center justify-center">
              <Image
                src="/logo2.png"
                alt="Zero Movies Logo"
                width={120}
                height={100}
                className="cursor-pointer transition-transform duration-300 hover:scale-105"
                onClick={handleBackHomeImage}
                style={{
                  maxWidth: "100%",
                  height: "auto"
                }}></Image>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={
            collapsed
              ? "absolute -right-10 top-4s w-8 h-8 rounded-full border shadow-md bg-background hover:bg-muted"
              : "ml-auto"
          }
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
      {/* User profile section */}
      <div
        className={cn(
          "flex items-center px-4 py-4 border-b transition-all",
          collapsed ? "flex-col" : "gap-3"
        )}
      >
        {user && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => setIsProfileDialogOpen(true)}>
                  <div className="relative">
                    <Avatar
                      className={cn(
                        " border-b-black",
                        collapsed ? "w-10 h-10" : "w-12 h-12"
                      )}
                    >
                      <AvatarImage
                        src={user.avatar}
                        alt={user.name}
                        className="object-cover object-center shadow-lg"
                        onError={() =>
                          console.error("Failed to load avatar:", user.avatar)
                        }
                      />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                  </div>
                </button>
              </TooltipTrigger>
              <TooltipContent
                side="right"
                align="center"
                className={collapsed ? "block" : "hidden"}
              >
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.role}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
        {!collapsed && user && (
          <div className="flex flex-col">
            <span className="font-medium leading-none">{user.name}</span>
            <span className="text-xs text-muted-foreground mt-1">
              {user.role}
            </span>
          </div>
        )}
        {!collapsed && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Menu className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setIsProfileDialogOpen(true)}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={handleLogout}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      {/* Main navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {mainMenuItems.map((item) => (
            <TooltipProvider key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <li>
                    <button
                      onClick={() => handleNavigation(item.url, item.title)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted w-full text-left",
                        pathname === item.url
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : ""
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5",
                          pathname === item.url
                            ? "text-primary-foreground"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {!collapsed && (
                        <span
                          className={cn(
                            "text-sm font-medium",
                            pathname !== item.url
                              ? "text-muted-foreground group-hover:text-foreground"
                              : ""
                          )}
                        >
                          {item.title}
                        </span>
                      )}
                      {!collapsed && pathname === item.url && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-foreground"></div>
                      )}
                    </button>
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  className={collapsed ? "block" : "hidden"}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </ul>
      </nav>
      {/* Bottom actions */}
      <div className="mt-auto px-2 pb-4">
        <ul className="space-y-1">
          {bottomMenuItems.map((item) => (
            <TooltipProvider key={item.title}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <li>
                    {item.component ? (
                      <div
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors w-full text-left"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            item.title === "Logout" ? "text-red-500" : "",
                            pathname === item.url
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {!collapsed && (
                          <span
                            className={cn(
                              "text-sm font-medium text-muted-foreground group-hover:text-foreground"
                            )}
                          >
                            {item.title}
                          </span>
                        )}
                        <div className="ml-auto">{item.component}</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavigation(item.url!, item.title)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted w-full text-left",
                          item.title === "Logout"
                            ? "hover:bg-red-100 hover:text-red-600"
                            : "",
                          pathname === item.url
                            ? "bg-primary text-primary-foreground hover:bg-primary/90"
                            : ""
                        )}
                      >
                        <item.icon
                          className={cn(
                            "w-5 h-5",
                            item.title === "Logout" ? "text-red-500" : "",
                            pathname === item.url
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          )}
                        />
                        {!collapsed && (
                          <span
                            className={cn(
                              "text-sm font-medium",
                              item.title === "Logout" ? "text-red-500" : "",
                              pathname !== item.url &&
                                !item.title.includes("Logout")
                                ? "text-muted-foreground group-hover:text-foreground"
                                : ""
                            )}
                          >
                            {item.title}
                          </span>
                        )}
                      </button>
                    )}
                  </li>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  align="center"
                  className={collapsed ? "block" : "hidden"}
                >
                  {item.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </ul>
      </div>
      {/* Profile Dialog */}
      {user && userProfile && (
        <ProfileDialog
          open={isProfileDialogOpen}
          onOpenChange={setIsProfileDialogOpen}
          user={user}
          userProfile={userProfile}
          onProfileUpdate={handleProfileUpdate}
        />
      )}
      {/* Version info */}
      {!collapsed && (
        <div className="px-4 py-2 text-xs text-muted-foreground">
          <p>v1.0.0 | © 2025 Movie Admin</p>
        </div>
      )}
    </aside>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
