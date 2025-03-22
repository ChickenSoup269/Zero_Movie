/* eslint-disable @typescript-eslint/no-explicit-any */
// components/PosterSlider.js
"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { motion } from "framer-motion"
import "swiper/css"
import "swiper/css/navigation"

interface Slide {
  image: string
  title: string
  description: string
  poster: string
}

interface PosterSliderProps {
  slides: Slide[]
  activeSlide: number
  handlePosterClick: (index: number) => void
  swiperInstance: any
}

const PosterSlider = ({
  slides,
  activeSlide,
  handlePosterClick,
  swiperInstance,
}: PosterSliderProps) => {
  // Variants cho poster
  const posterVariants = {
    active: {
      scale: 1.3, // Giữ scale như trước
      y: -20,
      zIndex: 25,

      transition: { duration: 0.35, ease: "easeInOut" },
    },
    inactive: {
      scale: 1,
      y: 0, // Trở về vị trí ban đầu
      zIndex: 0,

      transition: { duration: 0.35, ease: "easeInOut" },
    },
  }

  return (
    <div className="absolute bottom-0 px-4 w-full h-[18%] z-40 max-w-[1920px] mx-auto">
      <div className="relative w-full px-2 poster-swiper-container">
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={30}
          slidesPerView={8}
          breakpoints={{
            320: { slidesPerView: 3 },
            640: { slidesPerView: 4 },
            768: { slidesPerView: 5 },
            1024: { slidesPerView: 6 },
            1280: { slidesPerView: 8 },
          }}
          navigation={{
            prevEl: ".poster-prev",
            nextEl: ".poster-next",
          }}
          onSwiper={(swiper) => {
            if (swiperInstance) {
              swiper.slideTo(activeSlide)
            }
          }}
          className="w-full h-full relative"
        >
          {slides.map((slide, index) => (
            <SwiperSlide
              key={index}
              className="relative overflow-hidden b-game-card"
            >
              {/* Layer image blur */}
              <div className="absolute inset-0">
                <Image
                  src={slide.poster}
                  alt={`${slide.title}-blur`}
                  width={150}
                  height={200}
                  className="rounded-lg shadow-lg"
                  objectFit="contain"
                  style={{
                    filter: "blur(8px)",
                    opacity: 0.8,
                    zIndex: -1,
                    pointerEvents: "none",
                  }}
                />
              </div>

              {/* Layer image gốc với animation */}
              <div className="relative">
                <motion.div
                  variants={posterVariants}
                  initial="inactive"
                  animate={activeSlide === index ? "active" : "inactive"}
                  className={`cursor-pointer ${
                    activeSlide === index ? "p-2 rounded-sm" : ""
                  }`}
                  onClick={() => handlePosterClick(index)}
                >
                  <Image
                    src={slide.poster}
                    alt={slide.title}
                    width={150}
                    height={200}
                    className="rounded-lg shadow-lg b-game-card__cover"
                    objectFit="contain"
                  />
                </motion.div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Nút điều hướng */}
        <button className="poster-prev h-20 absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-gray-800/70 text-white p-2 rounded-sm hover:bg-gray-800 hover:cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <button className="poster-next h-20 absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-gray-800/70 text-white p-2 rounded-sm hover:bg-gray-800 hover:cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-8"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default PosterSlider
