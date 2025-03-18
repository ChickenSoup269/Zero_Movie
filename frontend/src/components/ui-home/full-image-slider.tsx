// components/FullImageSlider.js
"use client" // Chạy phía client vì dùng hook

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

  // Variants cho full image
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

  // Variants cho text
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
        navigation={{
          prevEl: ".slider-prev",
          nextEl: ".slider-next",
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
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
                  {/* Gradient Overlay */}
                  <div className="custom-overlay"></div>

                  {/* Full Image */}
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

                  {/* Text overlay */}
                  <motion.div
                    variants={textVariants}
                    className="absolute inset-0 z-50 flex items-center justify-start p-8"
                  >
                    <div>
                      <h1 className="text-4xl font-bold mb-4 text-white">
                        {slide.title}
                      </h1>
                      <p className="text-lg mb-6 text-gray-200">
                        {slide.description}
                      </p>
                      <div className="space-x-4">
                        <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
                          Book Now
                        </button>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                          View Detail
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Sử dụng component PosterSlider */}
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
