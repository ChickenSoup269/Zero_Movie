import { ReactNode } from "react"
import Navbar from "@/components/navbar"

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar cho User */}
      <Navbar />

      {/* Nội dung chính */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
