"use client"
import { useRef } from "react"
import Navbar from "./components/Navbar"
import Image from "next/image"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

// Danh sách phim (mock data)
const movies = [
  {
    id: 1,
    title: "Movie 1",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSbYqa5p_N9pN79rdPjAWBBXzUidzesj45Br7yS9Krg3Ig7oib6Bt5v4-fEx7kJEF4UFpRRf6d7e8OEBGawHmbl2tmxPCUilhtvwJhwcaeioqcpaa2fr6aKbRPZQIQe1e13bIQ.webp?r=c93",
    backdrop:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABQ88h7GWAndBpg6NhG4w2R8sZROHqS2iHHEQzHdi93WYmVtVhUnPkv6lQE8BbnXxs784GWtlDWgMcNc7e-zg5vZZ82g2vKCfg32O.webp?r=d20",
  },
  {
    id: 2,
    title: "Movie 2",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSbYqa5p_N9pN79rdPjAWBBXzUidzesj45Br7yS9Krg3Ig7oib6Bt5v4-fEx7kJEF4UFpRRf6d7e8OEBGawHmbl2tmxPCUilhtvwJhwcaeioqcpaa2fr6aKbRPZQIQe1e13bIQ.webp?r=c93",
    backdrop:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABQ88h7GWAndBpg6NhG4w2R8sZROHqS2iHHEQzHdi93WYmVtVhUnPkv6lQE8BbnXxs784GWtlDWgMcNc7e-zg5vZZ82g2vKCfg32O.webp?r=d20",
  },
  {
    id: 3,
    title: "Movie 3",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSbYqa5p_N9pN79rdPjAWBBXzUidzesj45Br7yS9Krg3Ig7oib6Bt5v4-fEx7kJEF4UFpRRf6d7e8OEBGawHmbl2tmxPCUilhtvwJhwcaeioqcpaa2fr6aKbRPZQIQe1e13bIQ.webp?r=c93",
    backdrop:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABQ88h7GWAndBpg6NhG4w2R8sZROHqS2iHHEQzHdi93WYmVtVhUnPkv6lQE8BbnXxs784GWtlDWgMcNc7e-zg5vZZ82g2vKCfg32O.webp?r=d20",
  },
  {
    id: 4,
    title: "Movie 4",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSbYqa5p_N9pN79rdPjAWBBXzUidzesj45Br7yS9Krg3Ig7oib6Bt5v4-fEx7kJEF4UFpRRf6d7e8OEBGawHmbl2tmxPCUilhtvwJhwcaeioqcpaa2fr6aKbRPZQIQe1e13bIQ.webp?r=c93",
    backdrop:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABQ88h7GWAndBpg6NhG4w2R8sZROHqS2iHHEQzHdi93WYmVtVhUnPkv6lQE8BbnXxs784GWtlDWgMcNc7e-zg5vZZ82g2vKCfg32O.webp?r=d20",
  },
  {
    id: 6,
    title: "Movie 5",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSbYqa5p_N9pN79rdPjAWBBXzUidzesj45Br7yS9Krg3Ig7oib6Bt5v4-fEx7kJEF4UFpRRf6d7e8OEBGawHmbl2tmxPCUilhtvwJhwcaeioqcpaa2fr6aKbRPZQIQe1e13bIQ.webp?r=c93",
    backdrop:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABQ88h7GWAndBpg6NhG4w2R8sZROHqS2iHHEQzHdi93WYmVtVhUnPkv6lQE8BbnXxs784GWtlDWgMcNc7e-zg5vZZ82g2vKCfg32O.webp?r=d20",
  },
]

export default function Home() {
  const sliderRef = useRef<{ swiper: { slideTo: (index: number) => void } }>(
    null
  )

  return (
    <main className="relative min-h-screen bg-black text-white">
      {/* Navbar */}
      <Navbar />

      {/* Slider */}
      <section className="relative w-full h-screen">
        <Swiper
          ref={sliderRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
          className="w-full h-full"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id}>
              <div className="relative w-full h-3/4 flex flex-col justify-end items-center">
                {/* Ảnh nền full backdrop */}
                <Image
                  src={movie.backdrop}
                  alt={movie.title}
                  layout="fill"
                  objectFit="cover"
                  className="opacity-80"
                />
                {/* Overlay làm mờ phần trên */}
                {/* <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/90"></div> */}
                {/* Tiêu đề phim */}
                <div className="absolute bottom-40 w-full text-center text-white">
                  <h1 className="text-4xl font-bold">{movie.title}</h1>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Danh sách poster TRÊN slider */}
        {/* Danh sách poster TRÊN slider */}
        <div className="absolute -bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-5xl bg-opacity-70 py-6 px-6 rounded-xl z-[100] shadow-2xl">
          <div className="flex gap-4 justify-center">
            {movies.map((movie, index) => (
              <button
                key={movie.id}
                onClick={() => sliderRef.current?.swiper.slideTo(index)}
                className="relative flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
              >
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  width={150} // Giữ poster nhỏ gọn
                  height={225}
                  className="rounded-lg shadow-xl border-4 border-white"
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
