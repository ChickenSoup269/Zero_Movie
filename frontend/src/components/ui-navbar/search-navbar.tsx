"use client"
import { useState, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { moviesData } from "@/data/moviesData"
import SearchPopup from "@/components/ui-navbar/search-popup"

// Định nghĩa kiểu cho một phim
interface Movie {
  title: string
  description: string
  image: string
  poster: string
  duration: string
  genre: string
  releaseYear: number
  ageRating: string
  starring: string
}

export default function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Lọc phim dựa trên từ khóa tìm kiếm
  const filteredMovies: Movie[] = moviesData.filter((movie) =>
    movie.title.toLowerCase().includes(debouncedSearchText.toLowerCase())
  )

  // Animation variants cho search box
  const searchVariants = {
    closed: {
      width: "40px",
      opacity: 1,
      transition: { duration: 0.3 },
    },
    open: {
      width: "300px",
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  // Debounce search text
  useEffect(() => {
    if (isSearchOpen && searchText) {
      // Chỉ debounce khi có text
      setIsLoading(true)
      const timer = setTimeout(() => {
        setDebouncedSearchText(searchText)
        setIsLoading(false)
      }, 1000) // Chờ 1 giây trước khi hiển thị kết quả
      return () => clearTimeout(timer)
    } else {
      setIsLoading(false) // Đảm bảo isLoading là false khi mở nhưng chưa nhập
    }
  }, [searchText, isSearchOpen])

  // Hàm xóa text
  const clearSearch = () => {
    setSearchText("")
    setDebouncedSearchText("")
  }

  // Hàm toggle search
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchText("")
      setDebouncedSearchText("")
    }
  }

  return (
    <div className="flex items-center relative">
      <AnimatePresence>
        <motion.div
          variants={searchVariants}
          initial="closed"
          animate={isSearchOpen ? "open" : "closed"}
          exit="closed"
          className="relative"
        >
          <div
            className="ml-2 bg-transparent shadow-xl border border-white backdrop-blur-lg rounded-md"
            style={{
              backgroundImage: "url('/path-to-your-pattern.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                className="h-8 w-8 hover:bg-gray-500"
              >
                <Search className="h-4 w-4 text-white" />
              </Button>

              {/* Đường phân cách */}
              <div className="h-4 w-px bg-white/50 mx-2"></div>

              {isSearchOpen && (
                <>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full ml-1 bg-transparent border-none focus:outline-none text-white pr-12"
                  />
                  <div className="relative">
                    {isLoading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 p-0 flex items-center justify-center text-white"
                        disabled
                      >
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      </Button>
                    )}
                    {searchText && !isLoading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-gray-500 flex items-center justify-center"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4 text-white" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sử dụng component SearchPopup */}
          <SearchPopup
            filteredMovies={filteredMovies}
            isSearchOpen={isSearchOpen}
            debouncedSearchText={debouncedSearchText}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
