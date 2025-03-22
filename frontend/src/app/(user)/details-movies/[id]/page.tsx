// app/details-movies/[id]/page.tsx
"use client"

import { useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { moviesData } from "@/data/moviesData"
import { theatersData } from "@/data/theatersData"
import React from "react"

interface MovieDetailProps {
  params: Promise<{ id: string }>
}

interface Theater {
  id: number
  name: string
  image: string
  address: string
  phone: string
  description: string
}

export default function MovieDetail({ params }: MovieDetailProps) {
  const unwrappedParams = React.use(params)
  const movieId = unwrappedParams.id

  const movie = moviesData.find((m) => m.id === parseInt(movieId))

  if (!movie) {
    notFound()
  }

  const genres = movie.genre.split(", ")
  const [isExpanded, setIsExpanded] = useState(false)
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)

  // Hàm mở popup
  const openTheaterPopup = (theater: Theater) => {
    setSelectedTheater(theater)
  }

  // Hàm đóng popup
  const closeTheaterPopup = () => {
    setSelectedTheater(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#1d1e20] text-white min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Cột trái: Poster phim */}
        <div className="w-full md:w-1/4">
          <Image
            src={movie.poster}
            alt={movie.title}
            width={300}
            height={450}
            className="rounded-lg shadow-lg w-full h-auto object-cover"
          />
        </div>

        {/* Cột phải: Thông tin chi tiết phim và danh sách rạp */}
        <div className="w-full md:w-3/4 flex flex-col gap-4">
          {/* Thông tin chi tiết phim */}
          <h1 className="text-4xl md:text-5xl font-bold">{movie.title}</h1>
          <div className="flex flex-wrap gap-2 items-center">
            {genres.map((genre, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-700 text-white text-sm rounded-full"
              >
                {genre}
              </span>
            ))}
            <span className="text-sm">
              <span className="font-semibold">IMDb</span>{" "}
              {movie.rating.toFixed(1)}/10
            </span>
            <span className="px-2 py-1 bg-gray-700 text-white text-sm rounded">
              {movie.ageRating}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              {movie.duration}
            </span>
          </div>
          <p className="text-gray-300 text-base">
            {isExpanded
              ? movie.description
              : `${movie.description.slice(0, 150)}...`}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-orange-400 hover:underline ml-2"
            >
              {isExpanded ? "Read Less" : "Read More"}
            </button>
          </p>
          <div>
            <span className="font-semibold">Director:</span>{" "}
            <span className="text-gray-300">{movie.director}</span>
          </div>
          <div>
            <span className="font-semibold">Writers:</span>{" "}
            <span className="text-gray-300">{movie.writers.join(", ")}</span>
          </div>
          <div>
            <span className="font-semibold">Stars:</span>{" "}
            <span className="text-gray-300">{movie.starring}</span>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
              Watch Trailer
            </button>
            <button className="px-6 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-colors flex items-center gap-2">
              To Watchlist
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Section rạp chiếu phim */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-400 mb-2">
              Available Theaters
            </h3>
            <div className="space-y-4">
              {theatersData.map((theater) => (
                <div
                  key={theater.id}
                  className="flex justify-between items-center cursor-pointer hover:bg-gray-700 p-2 rounded"
                  onClick={() => openTheaterPopup(theater)}
                >
                  <span className="text-gray-300">{theater.name}</span>
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popup hiển thị chi tiết rạp phim */}
      {selectedTheater && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-3xl flex flex-col md:flex-row gap-6 relative">
            {/* Nút đóng popup */}
            <button
              onClick={closeTheaterPopup}
              className="absolute top-4 right-4 text-gray-300 hover:text-white"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Hình ảnh rạp phim */}
            <div className="w-full md:w-1/3">
              <Image
                src={selectedTheater.image}
                alt={selectedTheater.name}
                width={300}
                height={200}
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </div>

            {/* Thông tin chi tiết rạp phim */}
            <div className="w-full md:w-2/3 flex flex-col gap-4 text-white">
              <h3 className="text-2xl md:text-3xl font-bold">
                {selectedTheater.name}
              </h3>
              <div>
                <span className="font-semibold">Address:</span>{" "}
                <span className="text-gray-300">{selectedTheater.address}</span>
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                <span className="text-gray-300">{selectedTheater.phone}</span>
              </div>
              <p className="text-gray-300 text-base">
                {selectedTheater.description}
              </p>
              <div className="flex gap-4 mt-4">
                <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors">
                  View on Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
