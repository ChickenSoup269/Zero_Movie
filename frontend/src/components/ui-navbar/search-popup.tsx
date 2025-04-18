"use client"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Movie } from "@/services/movieService"
import { GenreService } from "@/services/genreService"

interface SearchPopupProps {
  filteredMovies: Movie[]
  isSearchOpen: boolean
  debouncedSearchText: string
}

const SearchPopup = ({
  filteredMovies,
  isSearchOpen,
  debouncedSearchText,
}: SearchPopupProps) => {
  const router = useRouter()
  const [genreMap, setGenreMap] = useState<Record<number, string>>({})

  // Fetch genre map to convert genreIds to names
  useEffect(() => {
    const fetchGenreMap = async () => {
      try {
        const map = await GenreService.getGenreMap()
        setGenreMap(map)
      } catch (error) {
        console.error("Failed to fetch genre map:", error)
      }
    }
    fetchGenreMap()
  }, [])

  // Animation variants for popup
  const popupVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.2 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.2 },
    },
  }

  return (
    <AnimatePresence>
      {isSearchOpen && debouncedSearchText && filteredMovies.length > 0 && (
        <motion.div
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="absolute top-full left-0 mt-2 w-full bg-white/90 dark:bg-gray-800/90 shadow-lg rounded-lg z-10 max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700"
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie._id}
              onClick={() => router.push(`/movies/${movie.tmdbId}`)}
              className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 hover:cursor-pointer transition-colors"
            >
              <Image
                src={
                  movie.posterPath
                    ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
                    : "/placeholder-image.jpg"
                }
                alt={movie.title}
                width={50}
                height={75}
                className="rounded-md mr-3 object-cover"
              />
              <div className="flex-1 text-black dark:text-white">
                <h3 className="font-semibold text-sm md:text-base">
                  {movie.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                  {movie.runtime ? `${movie.runtime} min` : "N/A"}
                  {movie.genreIds?.length > 0 &&
                    ` • ${movie.genreIds
                      .map((id) => genreMap[id] || "Unknown")
                      .join(", ")}`}
                  {movie.releaseDate
                    ? ` • ${new Date(movie.releaseDate).getFullYear()}`
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default SearchPopup
