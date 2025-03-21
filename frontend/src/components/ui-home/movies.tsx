"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

interface Slide {
  image: string
  title: string
  description: string
  poster: string
  duration: string
  genre: string
  releaseYear: number
  ageRating: string
  starring: string
  status: "nowShowing" | "upcoming"
}

interface MoviesProps {
  slides: Slide[]
}

const Movies = ({ slides }: MoviesProps) => {
  const [selectedTab, setSelectedTab] = useState<"nowShowing" | "upcoming">(
    "nowShowing"
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const moviesContainerRef = useRef<HTMLDivElement>(null)

  const nowShowingMovies = slides.filter(
    (slide) => slide.status === "nowShowing"
  )
  const upcomingMovies = slides.filter((slide) => slide.status === "upcoming")
  const displayedMovies =
    selectedTab === "nowShowing" ? nowShowingMovies : upcomingMovies

  const moviesPerPage = 8
  const totalPages = Math.ceil(displayedMovies.length / moviesPerPage)
  const startIndex = (currentPage - 1) * moviesPerPage
  const endIndex = startIndex + moviesPerPage
  const currentMovies = displayedMovies.slice(startIndex, endIndex)

  useEffect(() => {
    if (moviesContainerRef.current) {
      moviesContainerRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentPage])

  // Variants cho animation của movie card
  const movieVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
    exit: {
      opacity: 0,
      x: 30,
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    },
  }

  // Variants cho hiệu ứng scale của poster
  const scaleVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
  }

  // Variants cho chi tiết phim (trượt lên mượt mà)
  const detailsVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1],
        staggerChildren: 0.1,
      },
    },
  }

  // Variants cho từng phần tử con trong chi tiết
  const childVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
    },
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setHoveredIndex(null)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setHoveredIndex(null)
    }
  }

  const handleViewDetails = (movie: Slide) => {
    console.log(`View details for: ${movie.title}`)
  }

  return (
    <div className="container mx-auto px-44 py-8 pt-44">
      <div className="flex justify-center mb-8">
        <button
          onClick={() => {
            setSelectedTab("nowShowing")
            setCurrentPage(1)
            setHoveredIndex(null)
          }}
          className={`px-6 py-2 text-lg font-semibold rounded-l-lg transition-colors duration-300 ${
            selectedTab === "nowShowing"
              ? "bg-[#4599e3] text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Now Showing
        </button>
        <button
          onClick={() => {
            setSelectedTab("upcoming")
            setCurrentPage(1)
            setHoveredIndex(null)
          }}
          className={`px-6 py-2 text-lg font-semibold rounded-r-lg transition-colors duration-300 ${
            selectedTab === "upcoming"
              ? "bg-[#4599e3] text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Upcoming
        </button>
      </div>

      <div ref={moviesContainerRef} className="relative">
        {/* Thêm "See more" ở góc phải của grid */}
        <div className="absolute top-[-30px] right-4 z-10">
          <a href="#" className="text-white text-sm font-light hover:underline">
            See more
          </a>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedTab}-${currentPage}`}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"
          >
            {currentMovies.length > 0 ? (
              currentMovies.map((movie, index) => (
                <motion.div
                  key={index}
                  variants={movieVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative rounded-lg overflow-hidden shadow-lg w-[200px] mx-auto"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Poster trơn ban đầu */}
                  <motion.div
                    variants={scaleVariants}
                    initial="initial"
                    whileHover="hover"
                    className="relative w-full h-[300px]"
                  >
                    <Image
                      src={movie.poster}
                      alt={movie.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </motion.div>

                  {/* Chi tiết phim xuất hiện khi hover */}
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        variants={detailsVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="absolute bottom-0 left-0 right-0 p-2 bg-gray-800 text-white"
                      >
                        <motion.h3
                          variants={childVariants}
                          className="text-sm font-semibold text-center mb-1"
                        >
                          {movie.title}
                        </motion.h3>
                        <motion.p
                          variants={childVariants}
                          className="text-xs mb-1"
                        >
                          <span className="font-semibold">Genre:</span>{" "}
                          {movie.genre}
                        </motion.p>
                        <motion.p
                          variants={childVariants}
                          className="text-xs mb-1"
                        >
                          <span className="font-semibold">Release Year:</span>{" "}
                          {movie.releaseYear}
                        </motion.p>
                        <motion.p
                          variants={childVariants}
                          className="text-xs mb-2"
                        >
                          <span className="font-semibold">Age Rating:</span>{" "}
                          {movie.ageRating}
                        </motion.p>
                        <motion.button
                          variants={childVariants}
                          onClick={() => handleViewDetails(movie)}
                          className="w-full py-1 text-sm font-semibold text-white bg-[#4599e3] rounded-lg hover:bg-[#357abd] transition-colors duration-300"
                        >
                          View Details
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.p
                key="no-movies"
                variants={movieVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="text-center text-gray-400 col-span-full"
              >
                No movies available in this category.
              </motion.p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-8 space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-white rounded-lg transition-colors duration-300 ${
              currentPage === 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#4599e3] hover:bg-[#357abd]"
            }`}
          >
            Previous
          </button>
          <span className="text-white self-center">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-white rounded-lg transition-colors duration-300 ${
              currentPage === totalPages
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-[#4599e3] hover:bg-[#357abd]"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default Movies
