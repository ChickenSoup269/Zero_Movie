"use client"

import { useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { moviesData } from "@/data/moviesData"
import { theatersData } from "@/data/theatersData"
import React from "react"
import { motion } from "framer-motion"

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
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null)

  // Hàm mở popup
  const openTheaterPopup = (theater: Theater) => {
    setSelectedTheater(theater)
  }

  // Hàm đóng popup
  const closeTheaterPopup = () => {
    setSelectedTheater(null)
  }

  // Animation variants cho background image
  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1, // Không mờ ở phần trên
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  }

  // Animation variants cho thông tin phim
  const infoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.2,
        ease: "easeInOut",
      },
    },
  }

  const infoItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  return (
    <div className="relative min-h-screen text-white flex flex-col">
      {/* Full-screen background image với gradient mờ dần */}
      <motion.div
        className="absolute inset-0 z-0"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <Image
          src={movie.image}
          alt={movie.title}
          layout="fill"
          objectFit="cover"
        />
        {/* Gradient overlay để mờ dần từ 50% xuống dưới */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 0%, #0e1116 50%)",
          }}
        />
      </motion.div>

      {/* Nội dung chính: đẩy xuống dưới để nằm trong phần gradient mờ */}
      <div className="relative flex-1 flex items-end justify-center z-10 pt-64 pb-20">
        <div className="container mx-auto px-4 pb-10">
          <motion.div
            className="flex flex-col md:flex-row gap-6 items-start"
            variants={infoVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Cột trái: Poster phim */}
            <motion.div
              variants={infoItemVariants}
              className="relative w-full sm:w-1/12 md:w-1/6 xl:w-1/5"
            >
              {/* Ảnh nền làm mờ */}
              <div className="absolute inset-0 blur-xl opacity-50">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>

              {/* Ảnh chính */}
              <Image
                src={movie.poster}
                alt={movie.title}
                width={250}
                height={250}
                className="relative z-10 rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </motion.div>

            {/* Cột giữa: Thông tin chi tiết phim */}
            <motion.div
              variants={infoItemVariants}
              className="w-full md:w-1/2 flex flex-col gap-4"
            >
              <motion.h1
                variants={infoItemVariants}
                className="text-4xl md:text-5xl font-bold"
              >
                {movie.title}
              </motion.h1>
              <motion.div
                variants={infoItemVariants}
                className="flex gap-2 items-center"
              >
                {genres.map((genre, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white text-black text-sm rounded-full"
                  >
                    {genre}
                  </span>
                ))}
                <span className="text-sm font-semibold text-yellow-400">
                  IMDb {movie.rating.toFixed(1)}/10
                </span>
                <span className="px-2 py-1 bg-gray-700 text-white text-sm rounded">
                  {movie.ageRating}
                </span>
                <span className="flex items-center gap-1 text-sm text-green-400">
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
              </motion.div>
              <motion.p
                variants={infoItemVariants}
                className="text-gray-300 text-base"
              >
                {movie.description}
              </motion.p>
              <motion.div
                variants={infoItemVariants}
                className="flex gap-4 mt-4"
              >
                <button className="px-6 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors flex items-center gap-2">
                  Watch Trailer
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
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
              </motion.div>
            </motion.div>

            {/* Cột phải: Thông tin rạp chiếu phim và thêm thông tin Director, Writers, Stars */}
            <motion.div
              variants={infoItemVariants}
              className="w-full md:w-1/4 flex flex-col gap-4"
            >
              {/* Thông tin Director, Writers, Stars */}
              <div>
                <h3 className="text-lg font-semibold text-white">Director</h3>
                <p className="text-gray-300">
                  {movie.director || "James Cameron"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Writers</h3>
                <p className="text-gray-300">
                  {movie.writers?.join(", ") || "Rick Jaffa, Amanda Silver"}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Stars</h3>
                <p className="text-gray-300">
                  {movie.starring ||
                    "Zoe Saldana, Sam Worthington, Sigourney Weaver"}
                </p>
              </div>

              {/* List rạp chiếu phim */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Available Theaters
                </h3>
                <div className="space-y-2">
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
            </motion.div>
          </motion.div>
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
