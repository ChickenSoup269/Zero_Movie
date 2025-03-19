// components/FullImageSlider.js
"use client"

import { useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { motion, AnimatePresence } from "framer-motion"
import "swiper/css"
import "swiper/css/navigation"
import PosterSlider from "./poster-slider"

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

interface FullImageSliderProps {
  slides: Slide[]
}

const FullImageSlider = ({ slides }: FullImageSliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [swiperInstance, setSwiperInstance] = useState<any>(null)

  const handlePosterClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index)
      setActiveSlide(index)
    }
  }

  // Hàm cắt mô tả tại dấu chấm đầu tiên
  const getFirstSentence = (description: string) => {
    const firstPeriodIndex = description.indexOf(".")
    if (firstPeriodIndex !== -1) {
      return description.substring(0, firstPeriodIndex + 1) // Lấy đến dấu chấm
    }
    return description // Nếu không có dấu chấm, trả về toàn bộ mô tả
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.05 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  }

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: 0.2, ease: "easeInOut" },
    },
  }

  return (
    <div className="relative w-full h-[90vh] z-10">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{ prevEl: ".slider-prev", nextEl: ".slider-next" }}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        className="relative w-full h-[100%]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <AnimatePresence initial={false}>
              {activeSlide === index && (
                <motion.div
                  key={`slide-${index}`}
                  className="relative w-full h-full"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <div className="custom-overlay"></div>
                  <motion.div
                    variants={imageVariants}
                    className="absolute top-0 left-0 w-full h-full full-screen-img"
                  >
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      layout="fill"
                      objectFit="cover"
                    />
                  </motion.div>
                  <motion.div
                    variants={textVariants}
                    className="absolute inset-0 z-50 flex items-center justify-start p-8"
                  >
                    <div className=" bg-opacity-60 p-6 rounded-lg max-w-lg pb-20">
                      {/* Release Year | Age Rating | Genre */}
                      <div className="text-sm text-white mb-2">
                        <span className="font-bold">{slide.releaseYear}</span> |{" "}
                        <span className="font-bold">{slide.ageRating}</span> |{" "}
                        <span className="font-bold">{slide.genre}</span>
                      </div>

                      {/* Title */}
                      <h1 className="text-4xl font-bold mb-4 text-white">
                        {slide.title}
                      </h1>

                      {/* Description (chỉ lấy câu đầu tiên) */}
                      <p className="text-lg mb-4 text-gray-200 leading-relaxed">
                        {getFirstSentence(slide.description)}
                      </p>

                      {/* Buttons */}
                      <div className="flex space-x-4 mb-4">
                        <button className="bg-[#4599e3] text-white px-4 py-2 rounded-lg font-semibold">
                          Book Now
                        </button>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                          View Details
                        </button>
                      </div>

                      {/* Starring */}
                      <div className="text-sm text-gray-300 border-t border-gray-500 pt-2">
                        <span className="font-semibold">Starring:</span>{" "}
                        {slide.starring}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </SwiperSlide>
        ))}
      </Swiper>
      <PosterSlider
        slides={slides}
        activeSlide={activeSlide}
        handlePosterClick={handlePosterClick}
        swiperInstance={swiperInstance}
      />
    </div>
  )
}

export default FullImageSlider
