/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import Image from "next/legacy/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import { motion, AnimatePresence } from "framer-motion"
import { Swiper as SwiperType } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import PosterSlider from "./poster-slider"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

export interface Slide {
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
  tmdbId: number
}

interface FullImageSliderProps {
  slides: Slide[]
}

const FullImageSlider = ({ slides }: FullImageSliderProps) => {
  const [activeSlide, setActiveSlide] = useState(0)
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handlePosterClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index)
      setActiveSlide(index)
    }
  }

  const handleViewDetails = (movie: Slide) => {
    console.log("Navigating to details with tmdbId:", movie.tmdbId) // Debug
    if (movie.status === "upcoming") {
      toast({
        title: "Hey!",
        description: "The movie has no release date yet :(",
        variant: "default",
        action: <ToastAction altText="Try again">I'm cook</ToastAction>,
      })
    } else {
      router.push(`/details-movies/${movie.tmdbId}`)
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
                      fill
                      sizes="100%"
                      style={{
                        objectFit: "cover",
                      }}
                      onError={() =>
                        console.error(`Failed to load image: ${slide.image}`)
                      }
                    />
                  </motion.div>
                  <motion.div
                    variants={textContainerVariants}
                    className="absolute inset-0 z-50 flex items-center justify-start p-8"
                  >
                    <div className="bg-opacity-100 p-6 rounded-lg max-w-lg pb-20">
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
                        <span className="font-bold inline-flex items-center">
                          {slide.ageRating ? (
                            <>
                              <Image
                                src={`/${slide.ageRating}.avif`}
                                alt={slide.ageRating}
                                width={45}
                                height={45}
                                className="mr-1 rounded-md"
                              />
                            </>
                          ) : (
                            "N/A"
                          )}
                        </span>{" "}
                        |{" "}
                        <span className="font-bold">
                          {slide.genre || "N/A"}
                        </span>{" "}
                        |{" "}
                        <span className="font-bold">
                          {slide.releaseYear || "N/A"}
                        </span>{" "}
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
                        <button
                          className="bg-[#4599e3] text-white px-4 py-2 rounded-lg font-semibold"
                          onClick={() => handleViewDetails(slide)}
                        >
                          Book Now
                        </button>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                          Add to Watchlist
                        </button>
                      </motion.div>
                      <motion.div
                        variants={textItemVariants}
                        className="text-sm text-gray-300 border-t border-gray-500 pt-2 flex flex-col space-y-1"
                      >
                        <div className="flex space-x-4">
                          <div>
                            <span className="font-semibold text-white">
                              Director:
                            </span>
                            <span className="font-mono">
                              {" "}
                              {slide.director || "Unknown"}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-white">
                              Rating:
                            </span>{" "}
                            <span className="font-mono text-yellow-400">
                              {slide.rating
                                ? `${slide.rating.toFixed(1)}/10`
                                : "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="font-semibold text-white">
                              Status:
                            </span>{" "}
                            <span
                              className={`font-mono ${
                                slide.status === "nowPlaying"
                                  ? "text-green-400"
                                  : "text-yellow-400"
                              }`}
                            >
                              {slide.status === "nowPlaying"
                                ? "Now Showing"
                                : "Coming Soon"}
                            </span>
                          </div>
                        </div>
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
