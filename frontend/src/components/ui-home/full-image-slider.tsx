"use client"

import { useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { motion, AnimatePresence } from "framer-motion"
import { Swiper as SwiperType } from "swiper"
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
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)

  const handlePosterClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index)
      setActiveSlide(index)
    }
  }

  const getFirstSentence = (description: string) => {
    const firstPeriodIndex = description.indexOf(".")
    if (firstPeriodIndex !== -1) {
      return description.substring(0, firstPeriodIndex + 1)
    }
    return description
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

  const textContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
    exit: { opacity: 0 },
  }

  const textItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  }

  if (slides.length === 0) {
    return (
      <div className="relative w-full h-[90vh] text-white flex items-center justify-center">
        No movies available
      </div>
    )
  }

  return (
    <div className="relative w-full h-[90vh] z-10 max-w-[2620px] mx-auto">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{ prevEl: ".slider-prev", nextEl: ".slider-next" }}
        autoplay={{ delay: 20000, disableOnInteraction: false }}
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
                      src={slide.image || "/fallback-image.jpg"}
                      alt={slide.title || "Movie slide"}
                      layout="fill"
                      objectFit="cover"
                      onError={() =>
                        console.error(`Failed to load image: ${slide.image}`)
                      }
                    />
                  </motion.div>
                  <motion.div
                    variants={textContainerVariants}
                    className="absolute inset-0 z-50 flex items-center justify-start p-8"
                  >
                    <div className="bg-opacity-60 p-6 rounded-lg max-w-lg pb-20">
                      <motion.h1
                        variants={textItemVariants}
                        className="text-6xl font-bold mb-4 text-white"
                      >
                        {slide.title || "Untitled"}
                      </motion.h1>
                      <motion.div
                        variants={textItemVariants}
                        className="text-sm text-white mb-2"
                      >
                        <span className="font-bold">
                          {slide.releaseYear || "N/A"}
                        </span>{" "}
                        |{" "}
                        <span className="font-bold">
                          {slide.ageRating || "N/A"}
                        </span>{" "}
                        |{" "}
                        <span className="font-bold">
                          {slide.genre || "N/A"}
                        </span>
                      </motion.div>
                      <motion.p
                        variants={textItemVariants}
                        className="text-lg mb-4 text-gray-200 leading-relaxed"
                      >
                        {getFirstSentence(
                          slide.description || "No description available."
                        )}
                      </motion.p>
                      <motion.div
                        variants={textItemVariants}
                        className="flex space-x-4 mb-4"
                      >
                        <button className="bg-[#4599e3] text-white px-4 py-2 rounded-lg font-semibold">
                          Book Now
                        </button>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                          View Details
                        </button>
                      </motion.div>
                      <motion.div
                        variants={textItemVariants}
                        className="text-sm text-gray-300 border-t border-gray-500 pt-2"
                      >
                        <span className="font-semibold">Starring:</span>{" "}
                        {slide.starring || "Unknown"}
                      </motion.div>
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
