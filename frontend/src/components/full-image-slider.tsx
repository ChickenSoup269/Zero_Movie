"use client" // Chạy phía client vì dùng hook

import { useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { motion, AnimatePresence } from "framer-motion"
import "swiper/css"
import "swiper/css/navigation"

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

  // Variants cho poster
  const posterVariants = {
    active: {
      scale: 1.1,
      zIndex: 25,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    inactive: {
      scale: 1,
      zIndex: 0,
      transition: { duration: 0.3, ease: "easeInOut" },
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
        className="w-full h-[100%]"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <AnimatePresence initial={false}>
              {activeSlide === index && (
                <motion.div
                  key={`slide-${index}`} // Key để ép animation chạy khi slide thay đổi
                  className="relative w-full h-full"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {/* Full Image */}
                  <motion.div
                    variants={imageVariants}
                    className="absolute top-0 left-0 w-full h-full z-0"
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
                    className="absolute inset-0 z-10 flex items-center justify-start p-8"
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

      {/* Swiper cho danh sách poster */}
      <div className="absolute bottom-0 px-4 w-full h-[25%] z-40">
        <div className="relative w-full px-2 poster-swiper-container">
          <Swiper
            modules={[Navigation]}
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
            onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
            onSwiper={(swiper) => {
              if (swiperInstance) {
                swiper.slideTo(activeSlide)
              }
            }}
            className="w-full h-full relative"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index} className="relative overflow-hidden">
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
                      filter: "blur(8px)", // Hiệu ứng blur
                      opacity: 0.8, // Độ trong suốt
                      zIndex: -1, // Đặt dưới image gốc
                      pointerEvents: "none", // Ngăn tương tác
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
                      activeSlide === index
                        ? "shadow-[0_0_0_3px_rgba(255,255,255,0.9)] p-2 rounded-sm"
                        : ""
                    }`}
                    onClick={() => handlePosterClick(index)}
                  >
                    <Image
                      src={slide.poster}
                      alt={slide.title}
                      width={150}
                      height={200}
                      className="rounded-lg shadow-lg"
                      objectFit="contain"
                    />
                  </motion.div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Nút điều hướng cho poster */}
          <button className="poster-prev h-20 absolute left-2 top-1/2 -translate-y-1/2 z-30 bg-gray-800/70 text-white p-2 rounded-sm hover:bg-gray-800 hover:cursor-pointer">
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
          <button className="poster-next h-20 absolute right-2 top-1/2 -translate-y-1/2 z-30 bg-gray-800/70 text-white p-2 rounded-sm hover:bg-gray-800 hover:cursor-pointer">
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
    </div>
  )
}

export default FullImageSlider
