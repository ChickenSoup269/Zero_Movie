/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { MovieService, Movie } from "@/services/movieService"
import SearchPopup from "@/components/ui-navbar/search-popup"

export default function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const { toast } = useToast()
  const router = useRouter()

  // Animation variants for search box
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
      setIsLoading(true)
      const timer = setTimeout(() => {
        setDebouncedSearchText(searchText)
        setIsLoading(false)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setDebouncedSearchText("")
      setIsLoading(false)
    }
  }, [searchText, isSearchOpen])

  // Fetch movies based on debounced search text
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      try {
        const token = localStorage.getItem("access_token")
        if (!token && debouncedSearchText) {
          toast({
            title: "Unauthorized",
            description: "Please log in to search movies.",
            variant: "destructive",
          })
          router.push("/login")
          return
        }

        const response: Movie[] = debouncedSearchText
          ? await MovieService.searchMovies(debouncedSearchText)
          : await MovieService.getAllMovies()

        setFilteredMovies(response)

        if (response.length === 0 && debouncedSearchText) {
          toast({
            title: "No Results",
            description: `No movies found for "${debouncedSearchText}".`,
            variant: "default",
          })
        }
      } catch (error: any) {
        console.error("Search movies error:", error.response || error)

        if (error.response?.status === 401) {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (isSearchOpen) {
      fetchMovies()
    } else {
      setFilteredMovies([])
    }
  }, [debouncedSearchText, isSearchOpen, toast, router])

  // Clear search text
  const clearSearch = () => {
    setSearchText("")
    setDebouncedSearchText("")
  }

  // Toggle search
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchText("")
      setDebouncedSearchText("")
      setFilteredMovies([])
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
            className={`ml-2 bg-transparent rounded-md transition-all duration-300 ${
              isSearchOpen
                ? "border border-white/50 shadow-xl backdrop-blur-lg"
                : "border-none"
            }`}
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
                className="h-8 w-8 hover:bg-gray-500/50"
              >
                <Search className="h-4 w-4 text-white" />
              </Button>

              <div className="h-4 w-px bg-white/50 mx-2"></div>

              {isSearchOpen && (
                <>
                  <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full ml-1 bg-transparent border-none focus:outline-none text-white placeholder-white/70 pr-12 text-sm md:text-base"
                    autoFocus
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
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-gray-500/50 flex items-center justify-center"
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
