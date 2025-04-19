"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"
import Chat from "./chat"
import UserService from "@/services/userService"

export default function ChatToggle() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Kiểm tra trạng thái đăng nhập
  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await UserService.getProfile() // Giả sử API này trả về thông tin user nếu đã đăng nhập
        setIsAuthenticated(!!user)
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  if (!isAuthenticated) return null // Ẩn nút chat nếu chưa đăng nhập

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className="fixed bottom-4 right-4 rounded-full shadow-lg"
        onClick={() => setIsChatOpen(true)}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      <Chat open={isChatOpen} onOpenChange={setIsChatOpen} />
    </>
  )
}
