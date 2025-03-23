"use client"

import { useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import { moviesData } from "@/data/moviesData"
import { theatersData } from "@/data/theatersData"
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import SeatSelection from "@/components/seat-selection-cinema"

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
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)

  const openTheaterPopup = (theater: Theater) => {
    setSelectedTheater(theater)
  }

  const closeTheaterPopup = () => {
    setSelectedTheater(null)
  }

  const openTrailerPopup = () => {
    setIsTrailerOpen(true)
  }

  const closeTrailerPopup = () => {
    setIsTrailerOpen(false)
  }

  // Kiểm tra xem có popup nào đang mở không
  const isAnyPopupOpen = selectedTheater !== null || isTrailerOpen

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  }

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

  const overlayVariants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  }

  const popupContentVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      y: 20,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
  }

  const theaterHoverVariants = {
    rest: {
      scale: 1,
      backgroundColor: "rgba(55, 65, 81, 0)",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    hover: {
      scale: 1.02,
      backgroundColor: "rgba(55, 65, 81, 1)",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  }

  const buttonHoverVariants = {
    rest: {
      scale: 1,
      boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
      transition: { duration: 0.2, ease: "easeInOut" },
    },
  }

  const glowVariants = {
    glow: {
      boxShadow: [
        "0 0 20px 5px rgba(255, 0, 0, 0.5)",
        "0 0 20px 5px rgba(0, 255, 0, 0.5)",
        "0 0 20px 5px rgba(0, 0, 255, 0.5)",
        "0 0 20px 5px rgba(255, 0, 255, 0.5)",
        "0 0 20px 5px rgba(255, 0, 0, 0.5)",
      ],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: "linear",
      },
    },
  }

  // Animation variants cho background blur
  const backgroundVariants = {
    normal: {
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    blurred: {
      filter: "blur(8px)",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  }

  return (
    <div className="relative min-h-screen text-white flex flex-col">
      {/* Background và nội dung chính với hiệu ứng blur */}
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
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, transparent 0%, #0e1116 30%)",
          }}
        />
      </motion.div>

      <motion.div
        className="relative flex-1 flex items-end justify-center z-10 pt-52 pb-20"
        variants={backgroundVariants}
        animate={isAnyPopupOpen ? "blurred" : "normal"} // Áp dụng blur khi popup mở
      >
        <div className="container mx-auto px-4 pb-10">
          <motion.div
            className="flex flex-col md:flex-row gap-6 items-start"
            variants={infoVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={infoItemVariants}
              className="relative sm:w-1/12 xl:w-1/6"
            >
              <div className="absolute inset-0 blur-xl opacity-100">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <Image
                src={movie.poster}
                alt={movie.title}
                width={250}
                height={250}
                className="relative z-10 rounded-lg shadow-lg w-full h-auto object-cover"
              />
            </motion.div>

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

              <motion.div variants={infoItemVariants}>
                <table className="w-full text-gray-300 border-collapse">
                  <tbody>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 pr-4 font-semibold text-white w-1/4">
                        Director
                      </td>
                      <td className="py-2">
                        {movie.director || "James Cameron"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-700">
                      <td className="py-2 pr-4 font-semibold text-white w-1/4">
                        Writers
                      </td>
                      <td className="py-2">
                        {movie.writers?.join(", ") ||
                          "Rick Jaffa, Amanda Silver"}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 font-semibold text-white w-1/4">
                        Stars
                      </td>
                      <td className="py-2">
                        {movie.starring ||
                          "Zoe Saldana, Sam Worthington, Sigourney Weaver"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </motion.div>

              <motion.div
                variants={infoItemVariants}
                className="flex gap-4 mt-4"
              >
                <motion.button
                  className="px-6 py-2 text-white rounded-md flex items-center gap-2"
                  style={{ backgroundColor: "#4599e3" }}
                  whileHover="hover"
                  initial="rest"
                  variants={buttonHoverVariants}
                  onClick={openTrailerPopup}
                >
                  Watch Trailer
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </motion.button>
                <motion.button
                  className="px-6 py-2 text-black bg-white rounded-md flex items-center gap-2"
                  whileHover="hover"
                  initial="rest"
                  variants={buttonHoverVariants}
                >
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
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={infoItemVariants}
              className="w-full md:w-1/4 flex flex-col gap-4"
            >
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white sm:pt-0 md:pt-10 xl:pt-20">
                  Available Theaters
                </h3>
                <div className="space-y-2">
                  {theatersData.map((theater) => (
                    <motion.div
                      key={theater.id}
                      className="flex justify-between items-center cursor-pointer p-2 rounded"
                      onClick={() => openTheaterPopup(theater)}
                      whileHover="hover"
                      initial="rest"
                      variants={theaterHoverVariants}
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
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
          {/* phần chọn ghế */}
          <SeatSelection />
        </div>
      </motion.div>

      {/* Popup cho rạp phim */}
      <AnimatePresence>
        {selectedTheater && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className="bg-gray-800 rounded-lg p-6 w-full max-w-3xl flex flex-col md:flex-row gap-6 relative"
              variants={popupContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
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
              <div className="w-full md:w-1/3">
                <Image
                  src={selectedTheater.image}
                  alt={selectedTheater.name}
                  width={300}
                  height={200}
                  className="rounded-lg shadow-lg w-full h-auto object-cover"
                />
              </div>
              <div className="w-full md:w-2/3 flex flex-col gap-4 text-white">
                <h3 className="text-2xl md:text-3xl font-bold">
                  {selectedTheater.name}
                </h3>
                <div>
                  <span className="font-semibold">Address:</span>{" "}
                  <span className="text-gray-300">
                    {selectedTheater.address}
                  </span>
                </div>
                <div>
                  <span className="font-semibold">Phone:</span>{" "}
                  <span className="text-gray-300">{selectedTheater.phone}</span>
                </div>
                <p className="text-gray-300 text-base">
                  {selectedTheater.description}
                </p>
                <div className="flex gap-4 mt-4">
                  <motion.button
                    className="px-6 py-2 text-white rounded-full"
                    style={{ backgroundColor: "#4078bd" }}
                    whileHover="hover"
                    initial="rest"
                    variants={buttonHoverVariants}
                  >
                    View on Map
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popup cho trailer */}
      <AnimatePresence>
        {isTrailerOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
          >
            <motion.div
              className=" rounded-lg p-6 w-full max-w-2xl relative"
              variants={popupContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <button
                onClick={closeTrailerPopup}
                className="absolute top-[-10] right-[-10] text-gray-300 hover:text-white z-10"
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
              <div className="w-full relative">
                {/* Video chính */}
                <div
                  className="relative z-10"
                  style={{ paddingBottom: "56.25%" }}
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/t1f0kBkSQs8?si=f1dZbWrN33p1NjlT"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
                {/* Video nhân bản với hiệu ứng blur và loang màu */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    paddingBottom: "56.25%",
                    filter: "blur(20px)",
                    opacity: 0.7,
                  }}
                  variants={glowVariants}
                  animate="glow"
                >
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src="https://www.youtube.com/embed/t1f0kBkSQs8?si=f1dZbWrN33p1NjlT"
                    title="YouTube video player (blurred)"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
