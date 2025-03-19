// components/Movies.tsx
"use client"

import { useState } from "react"
import Image from "next/image"

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
}

interface MoviesProps {
  slides: Slide[]
}

const Movies = ({ slides }: MoviesProps) => {
  const [selectedTab, setSelectedTab] = useState<"nowShowing" | "upcoming">(
    "nowShowing"
  ) // Mặc định là "Now Showing"

  // Lọc phim theo tab
  const currentYear = 2025 // Năm hiện tại
  const nowShowingMovies = slides.filter(
    (slide) => slide.releaseYear <= currentYear
  )
  const upcomingMovies = slides.filter(
    (slide) => slide.releaseYear > currentYear
  )

  // Danh sách phim hiển thị dựa trên tab được chọn
  const displayedMovies =
    selectedTab === "nowShowing" ? nowShowingMovies : upcomingMovies

  return (
    <div className="container mx-auto px-4 py-8 pt-32">
      {/* Tabs: Now Showing và Upcoming */}
      <div className="flex justify-center mb-8">
        <button
          onClick={() => setSelectedTab("nowShowing")}
          className={`px-6 py-2 text-lg font-semibold rounded-l-lg transition-colors duration-300 ${
            selectedTab === "nowShowing"
              ? "bg-[#4599e3] text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Now Showing
        </button>
        <button
          onClick={() => setSelectedTab("upcoming")}
          className={`px-6 py-2 text-lg font-semibold rounded-r-lg transition-colors duration-300 ${
            selectedTab === "upcoming"
              ? "bg-[#4599e3] text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Upcoming
        </button>
      </div>

      {/* Danh sách phim */}
      {displayedMovies.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedMovies.map((movie, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Poster phim */}
              <div className="relative w-full h-64">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>

              {/* Thông tin phim */}
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2 text-white">
                  {movie.title}
                </h3>
                <p className="text-sm text-gray-400 mb-1">
                  <span className="font-semibold">Genre:</span> {movie.genre}
                </p>
                <p className="text-sm text-gray-400 mb-1">
                  <span className="font-semibold">Release Year:</span>{" "}
                  {movie.releaseYear}
                </p>
                <p className="text-sm text-gray-400">
                  <span className="font-semibold">Age Rating:</span>{" "}
                  {movie.ageRating}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No movies available in this category.
        </p>
      )}
    </div>
  )
}

export default Movies
