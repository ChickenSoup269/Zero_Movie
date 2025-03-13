"use client"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { motion } from "framer-motion"

export default function LanguageSelector() {
  const [language, setLanguage] = useState("en")
  const [isOpen, setIsOpen] = useState(false)

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    console.log(`Switched to ${lang}`)
  }

  // Variants cho animation của mũi tên
  const arrowVariants = {
    closed: { rotate: 0 },
    open: { rotate: 180 },
  }

  return (
    <DropdownMenu onOpenChange={(open) => setIsOpen(open)}>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-1 cursor-pointer">
          <span className=" font-light text-sm text-white dark:text-white hover:text-gray-300 transition-colors duration-300">
            {language === "vi" ? "Tiếng Việt" : "English"}
          </span>
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-4 text-white dark:text-white"
            variants={arrowVariants}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            transition={{ duration: 0.3 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m19.5 8.25-7.5 7.5-7.5-7.5"
            />
          </motion.svg>
        </div>
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
  )
}
