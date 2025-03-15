"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import CustomSwitch from "@/components/switch-theme"
import SearchBar from "@/components/search-navbar"
import LanguageSelector from "@/components/language-selector"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion" // Thêm framer-motion cho animation
import { Menu, X as CloseIcon } from "lucide-react" // Thêm icon cho hamburger menu

// Định nghĩa kiểu cho item menu
interface NavItem {
  href: string
  label: string
}

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false) // State cho menu mobile

  const pathname = usePathname()

  const navItems: NavItem[] = [
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

  // Animation variants cho menu mobile
  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  }

  return (
    <nav
      className={`fixed left-4 right-4 z-50 flex items-center justify-between transition-all duration-300 rounded-md ${
        isScrolled
          ? "top-0 bg-white/10 dark:bg-transparent backdrop-blur-lg text-white shadow-lg pt-2 pb-4 px-5"
          : "top-1 text-white dark:text-white p-4"
      }`}
    >
      {/* Logo và Menu được gộp gần nhau */}
      <div className="flex items-center space-x-6">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Zero Movies Logo"
            width={isScrolled ? 80 : 100}
            height={isScrolled ? 50 : 80}
            className="cursor-pointer transition-transform duration-300 hover:scale-105"
          />
        </Link>
        {/* Menu cho desktop */}
        <div className="hidden md:flex space-x-6 text-md">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`hover:text-gray-300 capitalize transition-colors duration-300 px-2 py-1 ${
                pathname === item.href
                  ? isScrolled
                    ? "bg-[#4599e3] text-white font-bold rounded-b-lg -mt-3 pt-3"
                    : "bg-[#4599e3] text-white font-bold rounded-lg"
                  : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
        {/* Nút hamburger cho mobile */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-8 w-8 p-0"
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search button và animated textbox */}
        <SearchBar />
        {/* Sử dụng ngôn ngữ dropdown */}
        <LanguageSelector />
        {/* Switch sáng tối */}
        <CustomSwitch checked={darkMode} onCheckedChange={setDarkMode} />
        <Button className="bg-[#4599e3] hover:bg-[#287ac3] dark:hover:bg-[#dfdfdf] dark:bg-white dark:text-black duration-300">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>

      {/* Menu mobile (dropdown) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-16 left-0 w-full bg-white/90 dark:bg-gray-800 shadow-lg rounded-b-md z-40 p-4"
          >
            <div className="flex flex-col space-y-4 text-lg text-black dark:text-white">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`hover:text-gray-300 capitalize transition-colors duration-300 px-2 py-1 ${
                    pathname === item.href
                      ? "bg-[#4599e3] text-white font-bold rounded-lg"
                      : ""
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)} // Đóng menu khi click
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
