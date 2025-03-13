"use client"
import { useState, useEffect } from "react"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"

import CustomSwitch from "@/components/switch-theme"
import SearchBar from "@/components/search-navbar"
import LanguageSelector from "@/components/language-selector"
import Link from "next/link"
import Image from "next/image"

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

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

  return (
    <nav
      className={`fixed left-8 right-8 z-50 flex items-center justify-between transition-all duration-300 rounded-md ${
        isScrolled
          ? " top-0 bg-white/10 dark:bg-transparent backdrop-blur-lg text-white shadow-lg pt-2 pb-4 px-5"
          : "top-1  text-white dark:text-white p-4"
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
            width={isScrolled ? 80 : 100}
            height={isScrolled ? 50 : 80}
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
                    ? "bg-[#4599e3] text-white font-bold rounded-b-lg -mt-3 pt-3"
                    : "bg-[#4599e3] text-white font-bold rounded-lg "
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
        {/* Sử dụng ngôn ngữ dropdown*/}
        <LanguageSelector />
        {/* Switch sáng tối */}
        <CustomSwitch checked={darkMode} onCheckedChange={setDarkMode} />
        <Button className="bg-[#4599e3] hover:bg-[#287ac3] dark:hover:bg-[#dfdfdf] dark:bg-white dark:text-black duration-300">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </nav>
  )
}
