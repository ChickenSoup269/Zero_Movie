/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
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

// Menu items
const mainMenuItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "Movies", url: "/movieAdmin", icon: Film },
  { title: "Genres", url: "/admin/genres", icon: Tag },
  { title: "Users", url: "/movieUser", icon: Users },
  { title: "Calendar", url: "/admin/calendar", icon: Calendar },
]

const bottomMenuItems = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Logout", url: "/logout", icon: LogOut },
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
  } | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await UserService.getProfile()
        setUser({
          name: response.data.fullName || "Admin User",
          email: response.data.email || "admin@example.com",
          role: response.data.role || "Administrator",
          avatar: response.data.avatar || "/api/placeholder/32/32",
        })
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

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-background border-r transition-all duration-300 z-10",
        collapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center h-16 px-4 border-b">
        {!collapsed && (
          <div className="flex items-center flex-1 gap-2">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Film className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Movie Admin</span>
          </div>
        )}
        {collapsed && (
          <div className="flex items-center justify-center w-full">
            <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
              <Film className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className={
            collapsed
              ? "absolute -right-4 top-7 w-8 h-8 rounded-full border shadow-md bg-background"
              : ""
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
                <div className="relative">
                  <Avatar
                    className={cn(
                      "border-2 border-primary",
                      collapsed ? "w-10 h-10" : "w-12 h-12"
                    )}
                  >
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
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
              <DropdownMenuItem onClick={() => router.push("/admin/profile")}>
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
                    <button
                      onClick={() => handleNavigation(item.url, item.title)}
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

      {/* Version info */}
      {!collapsed && (
        <div className="px-4 py-2 text-xs text-muted-foreground">
          <p>v1.0.0 | © 2025 Movie Admin</p>
        </div>
      )}
    </aside>
  )
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
