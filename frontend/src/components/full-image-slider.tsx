"use client" // Chạy phía client vì dùng hook

import { useState } from "react"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

const FullImageSlider = () => {
  const slides = [
    {
      title: "Monsters, Inc.",
      description: "Monsters generate power by scaring kids in Monstropolis.",
      image: "/images/monster's.jpg",
      poster: "/images/04_monsters_stroke.jpg",
      duration: "92 min",
      genre: "Animation, Family, Comedy",
      releaseYear: 2001,
    },
    {
      title: "The Good Dinosaur",
      description:
        "A young dinosaur and his human friend embark on an adventure.",
      image: "/images/the-good-dinosaur.jpg",
      poster: "/images/16_dino.jpg",
      duration: "93 min",
      genre: "Animation, Adventure, Family",
      releaseYear: 2015,
    },
    {
      title: "Up",
      description:
        "An old man flies his house with balloons to Paradise Falls.",
      image: "/images/up.jpg",
      poster: "/images/10_up.jpg",
      duration: "96 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2009,
    },
    {
      title: "Coco",
      description: "A boy explores the Land of the Dead to find his roots.",
      image: "/images/coco.jpg",
      poster: "/images/19_coco.jpg",
      duration: "105 min",
      genre: "Animation, Family, Fantasy",
      releaseYear: 2017,
    },
    {
      title: "Luca",
      description: "A sea monster boy enjoys a summer on the Italian Riviera.",
      image: "/images/luca.jpg",
      poster: "/images/23_luca.jpg",
      duration: "95 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2021,
    },
    {
      title: "Cars 3",
      description: "Lightning McQueen races against a new generation.",
      image: "/images/car-3.jpg",
      poster: "/images/18_cars3.jpg",
      duration: "102 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2017,
    },
    {
      title: "Finding Dory",
      description: "Dory searches for her parents with Nemo and Marlin.",
      image: "/images/finding-dory.jpg",
      poster: "/images/17_dory.jpg",
      duration: "97 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2016,
    },
    {
      title: "WALL-E",
      description: "A robot’s journey shapes humanity’s future.",
      image: "/images/wall-e.jpg",
      poster: "/images/09_walle.jpg",
      duration: "98 min",
      genre: "Animation, Adventure, Sci-Fi",
      releaseYear: 2008,
    },
    {
      title: "Elio",
      description: "A boy connects with aliens as Earth’s ambassador.",
      image: "/images/elio-2024.jpg",
      poster: "/images/ELIO_Teaser.jpg",
      duration: "N/A",
      genre: "Animation, Adventure, Sci-Fi",
      releaseYear: 2025,
    },
    {
      title: "Toy Story 4",
      description: "Woody and friends go on a road trip with Forky.",
      image: "/images/toy-story-4.jpg",
      poster: "/images/21_ts4.jpg",
      duration: "100 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2019,
    },
  ]

  const [activeSlide, setActiveSlide] = useState(0)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [swiperInstance, setSwiperInstance] = useState<any>(null) // Lưu instance của Swiper

  // Hàm xử lý khi nhấp vào poster
  const handlePosterClick = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideTo(index)
      setActiveSlide(index)
    }
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
            <div className="relative w-full h-full">
              <Image
                src={slide.image}
                alt={slide.title}
                layout="fill"
                objectFit="cover"
                className="absolute top-0 left-0 z-0"
              />

              <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-start p-8">
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
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Swiper cho danh sách poster */}
      <div className="absolute bottom-0 w-full h-[25%] z-40">
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
            className="w-full h-full"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="relative">
                  {/* Poster gốc */}
                  <div
                    className={`cursor-pointer transition-transform duration-300 ${
                      activeSlide === index
                        ? "scale-110 shadow-[0_0_0_3px_rgba(255,255,255,0.9)] transform-origin-center z-25 bg-gray-800/50 p-2 rounded-lg"
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
                  </div>
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
              className="size-8" // Tăng kích thước SVG
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
              className="size-8" // Tăng kích thước SVG
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
