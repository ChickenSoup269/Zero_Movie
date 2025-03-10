import { ReactNode } from "react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar cho User */}
      <Navbar />
      {/* Nội dung chính */}
      <main className="flex-1 p-6 bg-[#292c33] dark:bg-[#0e1116]">
        {children}
      </main>
      <Footer />
    </div>
  )
}
