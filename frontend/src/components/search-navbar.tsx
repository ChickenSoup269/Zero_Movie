"use client"
import { useState } from "react"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchText, setSearchText] = useState("")

  // Animation variants cho search box
  const searchVariants = {
    closed: {
      width: "1px",
      opacity: 0,
      transition: { duration: 0.3 },
    },
    open: {
      width: "250px",
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  // Hàm xóa text
  const clearSearch = () => {
    setSearchText("")
  }

  return (
    <div className="flex items-center relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
      >
        <Search className="h-5 w-5" />
      </Button>
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            variants={searchVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative"
          >
            <input
              type="text"
              placeholder="Search..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="ml-2 p-1 pr-8 bg-transparent border-b focus:outline-none text-black dark:text-white w-full"
            />
            {searchText && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-1/2 -translate-y-1/2 h-5 w-5 p-0"
                onClick={clearSearch}
              >
                <X className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
