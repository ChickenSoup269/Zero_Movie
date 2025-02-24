"use client"
import { useState } from "react"
import Link from "next/link"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/80 backdrop-blur-md text-white p-4 flex items-center justify-between z-50">
      {/* Logo */}
      <div className="text-2xl font-bold tracking-wide">
        <Link href="/">
          <span className="cursor-pointer">🎬 MyFlix</span>
        </Link>
      </div>

      {/* Menu */}
      <div className="hidden md:flex space-x-8 text-lg">
        <Link href="/" className="hover:text-gray-300 transition">
          HOME
        </Link>
        <Link href="/movies" className="hover:text-gray-300 transition">
          MOVIES
        </Link>
        <Link href="/cinema" className="hover:text-gray-300 transition">
          CINEMA
        </Link>
        <Link href="/search" className="hover:text-gray-300 transition">
          SEARCH
        </Link>
      </div>

      {/* Button + Switch */}
      <div className="flex items-center space-x-4">
        <Switch checked={darkMode} onCheckedChange={setDarkMode} />
        <Button>Sign In</Button>
      </div>
    </nav>
  )
}
