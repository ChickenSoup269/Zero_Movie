"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
// import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu" // Import từ @shadcn/ui
import CustomSwitch from "@/components/switch-theme"

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [language, setLanguage] = useState("en") // Mặc định là tiếng Anh
  const pathname = usePathname()

  // Danh sách menu
  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/movies", label: "MOVIES" },
    { href: "/cinema", label: "CINEMA" },
    { href: "/search", label: "SEARCH" },
  ]

  // Theo dõi sự kiện cuộn
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Toggle dark mode
  useEffect(() => {
    document.documentElement.classList.add("dark") // Mặc định bật dark mode khi trang load
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Đổi ngôn ngữ
  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    console.log(`Switched to ${lang}`)
  }

  return (
    <nav
      className={`fixed left-8 right-8 z-50 flex items-center justify-between transition-all duration-300 rounded-md ${
        isScrolled
          ? "top-0 bg-white/90 backdrop-blur-lg text-black shadow-lg pt-2 pb-4 px-5"
          : "top-1 dark:bg-black/80 text-white dark:text-white  p-4"
      }`}
    >
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <Link href="/">
          <span className="cursor-pointer transition-colors duration-300">
            Zero Movies
          </span>
        </Link>
      </div>

      {/* Menu */}
      <div className="hidden md:flex space-x-8 text-lg">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`hover:text-gray-300 transition-colors duration-300 px-2 py-1 ${
              pathname === item.href
                ? isScrolled
                  ? "bg-[#DF0707] text-white font-bold rounded-b-lg -mt-2 pt-3"
                  : "bg-[#DF0707] text-white font-bold rounded-b-lg -mt-2 pt-3"
                : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Button + Switch + Language Dropdown */}
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-black dark:text-white"
            >
              {language === "vi" ? "Tiếng Việt" : "English"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleLanguageChange("vi")}>
              Tiếng Việt
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
              English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <CustomSwitch checked={darkMode} onCheckedChange={setDarkMode} />
        <Button>
          <Link href="/login" className="hover:text-gray-300 transition">
            Sign in
          </Link>
        </Button>
      </div>
    </nav>
  )
}
