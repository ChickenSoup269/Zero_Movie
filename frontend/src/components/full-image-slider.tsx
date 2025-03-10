// components/FullImageSlider.js
"use client" // Thêm directive vì component này dùng hook

import { useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

const FullImageSlider = () => {
  // Dữ liệu mẫu cho các slide (có thể thay bằng API hoặc dữ liệu thực tế)
  const slides = [
    {
      title: "Monsters, Inc.",
      description:
        "Animated film that explores the world of Monstropolis, where monsters generate their city's power by scaring children at night.",
      image: "/images/monster's.jpg",
      poster: "/images/04_monsters_stroke.jpg",
    },
    // {
    //   title: "The Good Dinosaur",
    //   description:
    //     "A heartwarming tale of a young dinosaur and his human friend on an epic journey.",
    //   image: "/good-dinosaur-bg.jpg",
    //   poster: "/good-dinosaur-poster.jpg",
    // },
    // {
    //   title: "Aladdin",
    //   description:
    //     "A magical adventure with a street-smart thief and a magical genie.",
    //   image: "/aladdin-bg.jpg",
    //   poster: "/aladdin-poster.jpg",
    // },
  ]

  const [activeSlide, setActiveSlide] = useState(0)

  return (
    <div className="relative w-full h-[100vh] overflow-hidden">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation={{
          prevEl: ".slider-prev",
          nextEl: ".slider-next",
        }}
        autoplay={{
          delay: 5000, // Tự động chuyển slide sau 5 giây
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {/* Hình nền full-width */}
              <Image
                src={slide.image}
                alt={slide.title}
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 z-0"
              />
              {/* Overlay và nội dung */}
              <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-start p-8">
                <div>
                  <h1 className="text-4xl font-bold mb-4 text-white">
                    {slide.title}
                  </h1>
                  <p className="text-lg mb-6 text-gray-200">
                    {slide.description}
                  </p>
                  <div className="space-x-4">
                    <button className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200">
                      Watch Now
                    </button>
                    <button className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600">
                      Details
                    </button>
                  </div>
                </div>
              </div>
              {/* Poster nhỏ ở góc trái dưới */}
              <div className="absolute bottom-4 left-8 z-20">
                <Image
                  src={slide.poster}
                  alt={slide.title}
                  width={150}
                  height={225}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Nút điều hướng */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <div className="slider-prev text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </div>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <div className="slider-next text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </div>
      </div>

      {/* Dots indicator (tùy chọn) */}
      <div className="absolute bottom-4 right-8 z-20 flex space-x-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`w-3 h-3 rounded-full ${
              activeSlide === index ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default FullImageSlider
