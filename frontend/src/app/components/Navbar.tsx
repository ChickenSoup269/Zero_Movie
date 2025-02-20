"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const Navbar = () => {
  const [scrolling, setScrolling] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => setScrolling(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all ${
        scrolling ? "bg-black bg-opacity-80 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* Left Section (Logo) */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="Logo" width={40} height={40} />
            <span className="text-white text-xl font-bold">ZeroMovie</span>
          </Link>
        </div>

        {/* Menu */}
        <ul className="flex gap-8 text-white text-lg">
          <li>
            <Link href="/" className="hover:text-gray-300 transition">
              HOME
            </Link>
          </li>
          <li>
            <Link href="/movies" className="hover:text-gray-300 transition">
              MOVIE
            </Link>
          </li>
          <li>
            <Link href="/cinema" className="hover:text-gray-300 transition">
              CINEMA
            </Link>
          </li>
          <li>
            <Link
              href="/search"
              className="hover:text-gray-300 transition flex items-center gap-1"
            >
              <Search size={20} />
              SEARCH
            </Link>
          </li>
        </ul>

        {/* Right Section (Switch + Login Button) */}
        <div className="flex items-center gap-4">
          {/* Dark Mode Switch */}
          <Switch
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            className="w-10 h-5 bg-gray-400 dark:bg-gray-700 border border-gray-500 rounded-full relative transition duration-300"
          />

          {/* Login Button */}
          <Button
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-black"
          >
            Login
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
