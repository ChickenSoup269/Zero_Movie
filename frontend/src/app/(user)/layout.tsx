"use client"
import { ReactNode, useEffect } from "react"
import Navbar from "@/components/ui-navbar/navbar"
import Footer from "@/components/footer"

export default function UserLayout({ children }: { children: ReactNode }) {
  // Sử dụng useEffect để cuộn lên đầu khi trang được tải
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }, []) // Mảng dependency rỗng để chỉ chạy một lần khi component mount

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar cho User */}
      <Navbar />
      {/* Nội dung chính */}
      <main className="flex-1 p-6 bg-[#1d1e20] dark:bg-[#0e1116] duration-300 ease-in-out">
        {children}
      </main>
      <Footer />
    </div>
  )
}
