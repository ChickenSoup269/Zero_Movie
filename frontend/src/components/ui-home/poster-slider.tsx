"use client"

import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { Swiper as SwiperType } from "swiper" // Import Swiper type
import { motion } from "framer-motion"
import "swiper/css"
import "swiper/css/navigation"

// Interface Slide đầy đủ (đồng bộ với Movies)
interface Slide {
  id: number
  image: string
  title: string
  description: string
  poster: string
  duration: string
  genre: string
  releaseYear: number
  ageRating: string
  starring: string
  status: "nowPlaying" | "upcoming"
  director: string
  rating: number
}

// Props cho PosterSlider
interface PosterSliderProps {
  slides: Slide[]
  activeSlide: number
  handlePosterClick: (index: number) => void
  swiperInstance: SwiperType | null // Sử dụng SwiperType thay vì any
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
      scale: 1.3,
      y: -20,
      zIndex: 25,
      transition: { duration: 0.35, ease: "easeInOut" },
    },
    inactive: {
      scale: 1,
      y: 0,
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
              key={slide.id} // Dùng slide.id thay vì index để đảm bảo uniqueness
              className="relative overflow-hidden b-game-card"
            >
              {/* Layer image blur */}
              <div className="absolute inset-0">
                <div className="relative h-[200px] w-[150px]">
                  <Image
                    src={slide.poster || "/fallback-poster.jpg"}
                    alt={`${slide.title}-blur`}
                    fill
                    className="rounded-lg shadow-lg object-contain" // Using Tailwind's object-contain
                    style={{
                      filter: "blur(8px)",
                      opacity: 0.8,
                      zIndex: -1,
                      pointerEvents: "none",
                    }}
                  />
                </div>
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
                    src={slide.poster || "/fallback-poster.jpg"}
                    alt={slide.title || "Movie poster"}
                    width={150}
                    height={200}
                    className="rounded-lg shadow-lg b-game-card__cover"
                    objectFit="contain"
                    loading="lazy" // Tối ưu tải hình ảnh
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
