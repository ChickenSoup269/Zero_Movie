"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import CustomSwitch from "@/components/switch-theme"
import Image from "next/image"
import SearchBar from "@/components/search-navbar"

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [language, setLanguage] = useState("en")

  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "home" },
    { href: "/movies", label: "movies" },
    { href: "/cinema", label: "cinema" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.add("dark")
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    console.log(`Switched to ${lang}`)
  }

  return (
    <nav
      className={`fixed left-8 right-8 z-50 flex items-center justify-between transition-all duration-300 rounded-md ${
        isScrolled
          ? "top-0 bg-white dark:bg-transparent backdrop-blur-lg text-black dark:text-white shadow-lg pt-2 pb-4 px-5"
          : "top-100 text-white dark:text-white p-4"
      }`}
    >
      {/* Logo và Menu được gộp gần nhau */}
      <div className="flex items-center space-x-6">
        {" "}
        {/* Giảm space-x từ 8 xuống 6 */}
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Zero Movies Logo"
            width={isScrolled ? 100 : 150}
            height={isScrolled ? 50 : 50}
            className="cursor-pointer transition-transform duration-300 hover:scale-105"
          />
        </Link>
        {/* Menu */}
        <div className="hidden md:flex space-x-6 text-md">
          {" "}
          {/* Giảm space-x từ 8 xuống 6 */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-gray-300 capitalize transition-colors duration-300 px-2 py-1 ${
                pathname === item.href
                  ? isScrolled
                    ? "bg-[#4aa3eb] text-white font-bold rounded-b-lg -mt-2 pt-3"
                    : "bg-[#4aa3eb] text-white font-bold rounded-b-lg -mt-2 pt-3"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search button và animated textbox */}
        <SearchBar />

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
        <Button className="bg-[#4aa3eb] ">
          <Link href="/login" className="hover:text-gray-300 transition">
            Sign in
          </Link>
        </Button>
      </div>
    </nav>
  )
}
