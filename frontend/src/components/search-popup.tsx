"use client"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

// Định nghĩa kiểu cho một phim
interface Movie {
  title: string
  description: string
  image: string
  poster: string
  duration: string
  genre: string
  releaseYear: number
}

// Định nghĩa kiểu cho props của SearchPopup
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
  // Animation variants cho popup
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
          className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md z-10 max-h-60 overflow-y-auto"
        >
          {filteredMovies.map((movie) => (
            <div
              key={movie.title}
              className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {/* Poster */}
              <Image
                src={movie.poster}
                alt={movie.title}
                width={50}
                height={75}
                className="rounded-md mr-3"
              />
              {/* Thông tin phim */}
              <div className="flex-1 text-black dark:text-white">
                <h3 className="font-semibold">{movie.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {movie.duration} • {movie.genre} • {movie.releaseYear}
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
