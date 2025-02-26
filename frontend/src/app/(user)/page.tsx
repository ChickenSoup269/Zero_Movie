"use client"
import { useState, useEffect } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Pagination, Autoplay } from "swiper/modules"
import Image from "next/image"
import { Button } from "@/components/ui/button" // Đảm bảo import Button từ @shadcn/ui

// Import CSS của Swiper
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export default function Home() {
  // Danh sách phim mẫu
  const movies = [
    {
      id: 1,
      title: "Dandadan",
      year: "2024",
      age: "16+",
      genre: "Anime",
      imageFull: "/images/dandadan-full.jpg",
      poster: "/images/dandadan-poster.jpg",
      description:
        "In a bet to prove whether ghosts or aliens exist, two high schoolers uncover paranormal threats, gain superpowers, and maybe even fall in love?",
      starring: "Starring: Shion Wakayama, Natsuki Hanae, Nana Mizuki",
    },
    {
      id: 2,
      title: "Chainsaw Man",
      year: "2022",
      age: "18+",
      genre: "Anime",
      imageFull: "/images/chainsawman-full.jpg",
      poster: "/images/chainsawman-poster.jpg",
      description:
        "A young man merges with a devil to become a powerful devil hunter.",
      starring: "Starring: Kikunosuke Toya, Tomori Kusunoki",
    },
    {
      id: 3,
      title: "Sakamoto Days",
      year: "2025",
      age: "13+",
      genre: "Anime",
      imageFull:
        "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABXTG17BFUnYPJ85VMDsaTVpjNKwj2WHsUHHrcoifNyZeQBHHDHZlXtNfRk8_yBGZRhuOWBmGAadp4YEYyAeNwT-Q2Pe1szDw6Ltn.webp?r=5cf",
      poster:
        "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSbYqa5p_N9pN79rdPjAWBBXzUidzesj45Br7yS9Krg3Ig7oib6Bt5v4-fEx7kJEF4UFpRRf6d7e8OEBGawHmbl2tmxPCUilhtvwJhwcaeioqcpaa2fr6aKbRPZQIQe1e13bIQ.webp?r=c93",
      description:
        "A retired hitman tries to live a peaceful life while hiding his past.",
      starring: "Starring: Tomokazu Sugita, Rie Takahashi",
    },
  ]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [swiper, setSwiper] = useState<any>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  // Hàm xử lý khi nhấn poster để chuyển slide
  const handlePosterClick = (index: number) => {
    if (swiper) {
      swiper.slideTo(index)
      setActiveIndex(index)
    }
  }

  // Hàm xử lý khi nhấn "Book Now"
  const handleBookNow = (movie: (typeof movies)[0]) => {
    console.log(`Book Now clicked for ${movie.title}`)
    // Thêm logic thật (ví dụ: chuyển hướng đến trang booking)
  }

  // Hàm xử lý khi nhấn "View Details"
  const handleViewDetails = (movie: (typeof movies)[0]) => {
    console.log(`View Details clicked for ${movie.title}`)
    // Thêm logic thật (ví dụ: chuyển hướng đến trang chi tiết phim)
  }

  useEffect(() => {
    if (swiper) {
      swiper.on("slideChange", () => {
        setActiveIndex(swiper.activeIndex)
      })
    }
  }, [swiper])

  return (
    <div className="min-h-screen text-black dark:text-white">
      {/* Slider full image */}
      <div className="relative w-full h-screen">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            prevEl: ".swiper-button-prev",
            nextEl: ".swiper-button-next",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          onSwiper={setSwiper}
          className="h-full"
        >
          {movies.map((movie) => (
            <SwiperSlide key={movie.id} className="relative">
              <Image
                src={movie.imageFull}
                alt={movie.title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              <div className="absolute inset-0  flex flex-col justify-end p-6 pointer-events-none">
                <div className="text-white space-y-2 pointer-events-auto">
                  <h2 className="text-3xl font-bold">{movie.title}</h2>
                  <p className="text-sm">
                    {movie.year} | {movie.age} | {movie.genre}
                  </p>
                  <p className="text-sm line-clamp-2">{movie.description}</p>
                  <p className="text-sm">{movie.starring}</p>
                  <div className="mt-4 space-x-2">
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md"
                      onClick={() => handleBookNow(movie)}
                    >
                      Book Now
                    </Button>
                    <Button
                      className="text-white border border-white hover:bg-white hover:text-black px-4 py-2 rounded-md ml-2"
                      onClick={() => handleViewDetails(movie)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
              {/* Nút điều hướng */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <div className="swiper-button-prev text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"></div>
                <div className="swiper-button-next text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"></div>
              </div>
              {/* Pagination dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="swiper-pagination"></div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Danh sách poster phim */}
      <div className="pt-20 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Trang chủ</h1>

        <div className="relative">
          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={4}
            navigation={{
              prevEl: ".poster-prev",
              nextEl: ".poster-next",
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="max-w-5xl mx-auto mb-8"
          >
            {movies.map((movie, index) => (
              <SwiperSlide key={movie.id}>
                <div
                  className={`cursor-pointer rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105 ${
                    activeIndex === index ? "border-4 border-[#DF0707]" : ""
                  }`}
                  onClick={() => handlePosterClick(index)}
                >
                  <Image
                    src={movie.poster}
                    alt={movie.title}
                    width={200}
                    height={300}
                    style={{ objectFit: "cover" }}
                  />
                  <p className="text-center p-2 text-sm font-semibold">
                    {movie.title}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Nút điều hướng cho poster */}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
            <div className="poster-prev text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
            <div className="poster-next text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Nội dung giả để scroll */}
        <section className="max-w-3xl mx-auto space-y-6 mt-8">
          <p className="text-lg">
            Chào mừng bạn đến với trang chủ! Đây là một đoạn văn mẫu để kiểm tra
            hiệu ứng cuộn của navbar. Bạn có thể cuộn xuống để xem navbar thay
            đổi từ trong suốt sang màu đen.
          </p>

          <div className="h-96 bg-blue-200 dark:bg-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-xl">Content Block 1</span>
          </div>

          <p className="text-lg">
            Tiếp tục cuộn xuống để xem thêm nội dung. Navbar sẽ đổi màu khi bạn
            cuộn quá 50px từ đầu trang. Nội dung này chỉ là giả lập để tạo chiều
            dài cho trang.
          </p>

          <div className="h-96 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-xl">Content Block 2</span>
          </div>

          <p className="text-lg">
            Đây là đoạn cuối cùng. Bạn có thể thấy navbar đã đổi màu khi cuộn
            đến đây. Nếu muốn điều chỉnh, cứ bảo mình nhé!
          </p>

          <div className="h-96 bg-red-200 dark:bg-red-800 rounded-lg flex items-center justify-center">
            <span className="text-xl">Content Block 3</span>
          </div>
        </section>
      </div>
    </div>
  )
}
