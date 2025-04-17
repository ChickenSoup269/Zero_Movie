/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/ui-navbar/app-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import UserService from "@/services/userService"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAdminAccess = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("access_token")
        if (!token) {
          toast({
            title: "Unauthorized",
            description: "Please log in to access the admin dashboard.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        const response = await UserService.getProfile()
        console.log("User profile:", response.data) // Debug role
        const userRole = response.data?.role

        if (userRole === "admin" || userRole === "administrator") {
          setIsAdmin(true)
        } else {
          toast({
            title: "Access Denied",
            description: "Only admins can access this page.",
            variant: "destructive",
          })
          router.push("/403") // Or "/" for home page
        }
      } catch (error: any) {
        console.error("Admin check error:", error.response || error)
        toast({
          title: "Error",
          description:
            error.response?.data?.message ||
            error.message ||
            "Failed to verify admin access.",
          variant: "destructive",
        })
        if (error.response?.status === 401) {
          router.push("/login")
        } else {
          router.push("/403")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAdminAccess()
  }, [router, toast])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Skeleton className="h-12 w-64 rounded-md" />
      </div>
    )
  }

  if (!isAdmin) {
    return null // Router will handle redirection
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 p-6">
        <SidebarTrigger className="mr-10" />
        {children}
      </main>
    </SidebarProvider>
  )
}
