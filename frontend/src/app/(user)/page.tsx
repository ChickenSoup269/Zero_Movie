// "use client"
// import { useState, useEffect } from "react"
// import { Swiper, SwiperSlide } from "swiper/react"
// import { Navigation, Pagination, Autoplay } from "swiper/modules"
// import Image from "next/image"
// import { Button } from "@/components/ui/button"
// import AboutUs from "@/components/about-us"

// // Import CSS của Swiper
// import "swiper/css"
// import "swiper/css/navigation"
// import "swiper/css/pagination"

// export default function Home() {
//   // Danh sách phim mẫu
//   const movies = [
//     {
//       id: 1,
//       title: "Dandadan",
//       year: "2024",
//       age: "16+",
//       genre: "Anime",
//       imageFull:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABddbZ9kdS14TgTLF-5HIY1A2OP-xRqeAuB-6fhWaze1Em28zwv5ca0IsJoLHfcAyBJBH7qmX5FcClEUWrjYYOPdqPaIAWY1klZ8o.webp?r=54d",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSbYqa5p_N9pN79rdPjAWBBXzUidzesj45Br7yS9Krg3Ig7oib6Bt5v4-fEx7kJEF4UFpRRf6d7e8OEBGawHmbl2tmxPCUilhtvwJhwcaeioqcpaa2fr6aKbRPZQIQe1e13bIQ.webp?r=c93",
//       description:
//         "In a bet to prove whether ghosts or aliens exist, two high schoolers uncover paranormal threats, gain superpowers, and maybe even fall in love?",
//       starring: "Starring: Shion Wakayama, Natsuki Hanae, Nana Mizuki",
//       status: "nowShowing",
//       releaseDate: "March 15, 2025",
//     },
//     {
//       id: 2,
//       title: "Chainsaw Man",
//       year: "2022",
//       age: "18+",
//       genre: "Anime",
//       imageFull:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABS5UUxKLG-m9Z1zXlITh-j8OTpbJQHjCCNwUFgVnzQz_OpFX4v_XN4UIkO99_jep0FNLX6tcX2s0KXmvTvCFFjKYGQ1s4aRvENJ8.webp?r=4f2",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABeq2Rqsua47S8j0_XmB8_iZnyBufOk1uLGPfzopf4F1bEHvuI_W_iBNd5-OQ2J3R1wrEVI5u3uE6mtgURNsUhZhg9RwxZHi6VTly.webp?r=c1a",
//       description:
//         "A young man merges with a devil to become a powerful devil hunter.",
//       starring: "Starring: Kikunosuke Toya, Tomori Kusunoki",
//       status: "nowShowing",
//     },
//     {
//       id: 3,
//       title: "Sakamoto Days",
//       year: "2025",
//       age: "13+",
//       genre: "Anime",
//       imageFull:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABS8sYAW8i5x_OS8VgTmf0VVxZtfDkI92nAMneZcFd8UJHo8q2FJCHll33mGEi9sSVFi7zKpnylOFD1n7PcN4WBZIHWEz3jXeiezF.webp?r=b87",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVzVapAGG_WsoP7yQ8LCoFY53ip68QDOPeP7MB7BH4t4S0ffRMydDOKpwWB7NiOkSEbE8tIIsa8Dd-918u3oTcLM7mrGZSYKpUZg.webp?r=524",
//       description:
//         "A retired hitman tries to live a peaceful life while hiding his past.",
//       starring: "Starring: Tomokazu Sugita, Rie Takahashi",
//       status: "upcoming",
//     },
//     {
//       id: 4,
//       title: "Demon Slayer",
//       year: "2019",
//       age: "13+",
//       genre: "Anime",
//       imageFull:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABVqZNv5hm-kbgW7x4-6qo9Mw9kErJxQPd3zKbhOAau-3p3TQjT8Jyh5wMKmr54hy8qVgMcNBepa_qlRbI4T8sAGnczGioGUOYUV5.webp?r=3ba",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABTDenBojPT8LKSPuudCycMPI2G7wgi6e5Ivr9h6Cl7ZRSVxrEHnee-ALnuJO4ZveYjNemAz-uB-YXg5kVyvRJqP5T1dRJVRohIdR4ZVjerSiysnHdqVkzcWNUHIzgBRQvNcCAg.webp?r=6ef",
//       description:
//         "A young boy becomes a demon slayer to save his sister, who turned into a demon.",
//       starring: "Starring: Natsuki Hanae, Akari Kito",
//       status: "upcoming",
//     },
//     {
//       id: 5,
//       title: "Attack on Titan",
//       year: "2013",
//       age: "16+",
//       genre: "Anime",
//       imageFull: "/images/attackontitan-full.jpg",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABTWnhpG_2X5yH3DU-dU6AQuOb6TOlDZdwgezNFBUCHLzjMEkRZZ1UTFMTjIR1Yv2_l4rHvG-LsURLQG9AE5iSowQd5wrWn4SLyIz.webp?r=097",
//       description:
//         "Humans fight against giant humanoid Titans to reclaim their world.",
//       starring: "Starring: Yuki Kaji, Yui Ishikawa",
//       status: "nowShowing",
//     },
//     {
//       id: 6,
//       title: "My Hero Academia",
//       year: "2016",
//       age: "13+",
//       genre: "Anime",
//       imageFull: "/images/myheroacademia-full.jpg",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABcAxTxtIpvtWKtxnwtHqoHgpl0YLi185G1nPwmF5gO_wkE8ccvq_8k5WyT30Vun95kL8VkhrFquP_5KAYiLQ-gjG12doH5yunF_I.webp?r=1cb",
//       description:
//         "A boy without powers aims to become the greatest hero in a world of superhumans.",
//       starring: "Starring: Daiki Yamashita, Kenta Miyake",
//       status: "nowShowing",
//     },
//     {
//       id: 7,
//       title: "My Hero Academia",
//       year: "2016",
//       age: "13+",
//       genre: "Anime",
//       imageFull: "/images/myheroacademia-full.jpg",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABcAxTxtIpvtWKtxnwtHqoHgpl0YLi185G1nPwmF5gO_wkE8ccvq_8k5WyT30Vun95kL8VkhrFquP_5KAYiLQ-gjG12doH5yunF_I.webp?r=1cb",
//       description:
//         "A boy without powers aims to become the greatest hero in a world of superhumans.",
//       starring: "Starring: Daiki Yamashita, Kenta Miyake",
//       status: "nowShowing",
//     },
//     {
//       id: 8,
//       title: "My Hero Academia",
//       year: "2016",
//       age: "13+",
//       genre: "Anime",
//       imageFull: "/images/myheroacademia-full.jpg",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABcAxTxtIpvtWKtxnwtHqoHgpl0YLi185G1nPwmF5gO_wkE8ccvq_8k5WyT30Vun95kL8VkhrFquP_5KAYiLQ-gjG12doH5yunF_I.webp?r=1cb",
//       description:
//         "A boy without powers aims to become the greatest hero in a world of superhumans.",
//       starring: "Starring: Daiki Yamashita, Kenta Miyake",
//       status: "nowShowing",
//     },
//     {
//       id: 9,
//       title: "My Hero Academia",
//       year: "2016",
//       age: "13+",
//       genre: "Anime",
//       imageFull: "/images/myheroacademia-full.jpg",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABcAxTxtIpvtWKtxnwtHqoHgpl0YLi185G1nPwmF5gO_wkE8ccvq_8k5WyT30Vun95kL8VkhrFquP_5KAYiLQ-gjG12doH5yunF_I.webp?r=1cb",
//       description:
//         "A boy without powers aims to become the greatest hero in a world of superhumans.",
//       starring: "Starring: Daiki Yamashita, Kenta Miyake",
//       status: "nowShowing",
//     },
//     {
//       id: 10,
//       title: "My Hero Academia",
//       year: "2016",
//       age: "13+",
//       genre: "Anime",
//       imageFull: "/images/myheroacademia-full.jpg",
//       poster:
//         "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABcAxTxtIpvtWKtxnwtHqoHgpl0YLi185G1nPwmF5gO_wkE8ccvq_8k5WyT30Vun95kL8VkhrFquP_5KAYiLQ-gjG12doH5yunF_I.webp?r=1cb",
//       description:
//         "A boy without powers aims to become the greatest hero in a world of superhumans.",
//       starring: "Starring: Daiki Yamashita, Kenta Miyake",
//       status: "nowShowing",
//     },
//   ]

//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const [swiper, setSwiper] = useState<any>(null) // State để lưu Swiper instance
//   const [activeIndex, setActiveIndex] = useState(0) // Index của slide hiện tại
//   const [isHovered, setIsHovered] = useState(false) // State để theo dõi hover
//   const [activeTab, setActiveTab] = useState("nowShowing")

//   // Hàm xử lý khi nhấn poster để chuyển slide
//   const handlePosterClick = (index: number) => {
//     if (swiper) {
//       swiper.slideTo(index) // Chuyển đến slide tương ứng
//       setActiveIndex(index)
//     }
//   }

//   // Hàm xử lý khi nhấn "Book Now"
//   const handleBookNow = (movie: (typeof movies)[0]) => {
//     console.log(`Book Now clicked for ${movie.title}`)
//   }

//   // Hàm xử lý khi nhấn "View Details"
//   const handleViewDetails = (movie: (typeof movies)[0]) => {
//     console.log(`View Details clicked for ${movie.title}`)
//   }

//   useEffect(() => {
//     if (swiper) {
//       swiper.on("slideChange", () => {
//         setActiveIndex(swiper.activeIndex)
//       })

//       // Tạm dừng autoplay khi hover
//       const handleMouseEnter = () => {
//         setIsHovered(true)
//         swiper.autoplay.stop()
//       }

//       // Tiếp tục autoplay sau 5s khi mouseout
//       const handleMouseLeave = () => {
//         setIsHovered(false)
//         setTimeout(() => {
//           if (!isHovered) {
//             swiper.autoplay.start()
//           }
//         }, 5000) // Đợi 5 giây trước khi tiếp tục autoplay
//       }

//       const swiperContainer = swiper.el // Lấy element của Swiper
//       swiperContainer.addEventListener("mouseenter", handleMouseEnter)
//       swiperContainer.addEventListener("mouseleave", handleMouseLeave)

//       // Dọn dẹp sự kiện khi unmount
//       return () => {
//         swiperContainer.removeEventListener("mouseenter", handleMouseEnter)
//         swiperContainer.removeEventListener("mouseleave", handleMouseLeave)
//       }
//     }
//   }, [swiper, isHovered])

//   return (
//     <div className="min-h-screen">
//       {/* Slider full image và poster */}
//       <div className="relative w-full">
//         {/* Phần full image (90% chiều cao màn hình) */}
//         <div className="relative w-full h-[90vh] overflow-hidden">
//           <Swiper
//             modules={[Navigation, Pagination, Autoplay]}
//             spaceBetween={0}
//             slidesPerView={1}
//             navigation={{
//               prevEl: ".swiper-button-prev",
//               nextEl: ".swiper-button-next",
//             }}
//             autoplay={{ delay: 5000, disableOnInteraction: false }}
//             onSwiper={setSwiper}
//             className="h-full"
//           >
//             {movies.map((movie) => (
//               <SwiperSlide key={movie.id} className="relative">
//                 <Image
//                   src={movie.imageFull}
//                   alt={movie.title}
//                   fill
//                   style={{ objectFit: "cover" }}
//                   priority
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-r from-black/85 to-transparent flex items-center justify-start pl-[100px] z-10">
//                   {/* Gradient từ đen mờ (trái) sang trong suốt (phải) */}
//                   <div className="text-white space-y-4 w-1/3">
//                     <h2 className="text-4xl font-bold">{movie.title}</h2>
//                     <p className="text-lg">
//                       {movie.year} | {movie.age} | {movie.genre}
//                     </p>
//                     <p className="text-base line-clamp-3">
//                       {movie.description}
//                     </p>
//                     <p className="text-base">{movie.starring}</p>
//                     <div className="mt-4 space-x-4 z-20">
//                       <Button
//                         variant="outline"
//                         className="bg-[#DF0707] hover:bg-white hover:text-[#DF0707] border-[#DF0707] text-white z-20 duration-300"
//                         onClick={() => handleBookNow(movie)}
//                       >
//                         Book Now
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="text-black dark:text-white border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black z-20 duration-300"
//                         onClick={() => handleViewDetails(movie)}
//                       >
//                         View Details
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//                 {/* Nút điều hướng */}
//                 <div className="absolute inset-0 flex items-center justify-between px-4">
//                   <div className="swiper-button-prev text-white bg-black/100 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="size-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M15.75 19.5 8.25 12l7.5-7.5"
//                       />
//                     </svg>
//                   </div>
//                   <div className="swiper-button-next text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth={1.5}
//                       stroke="currentColor"
//                       className="size-6"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="m8.25 4.5 7.5 7.5-7.5 7.5"
//                       />
//                     </svg>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//         </div>

//         {/* Phần poster phim (50% trong full image và 50% bên dưới) */}
//         <div className="relative -mt-[15vh] z-10 overflow-hidden mr-5">
//           <Swiper
//             modules={[Navigation]}
//             spaceBetween={5}
//             slidesPerView={6}
//             navigation={{
//               prevEl: ".poster-prev",
//               nextEl: ".poster-next",
//             }}
//             breakpoints={{
//               640: { slidesPerView: 2 },
//               768: { slidesPerView: 3 },
//               1024: { slidesPerView: 6 },
//             }}
//             className="max-w-6xl mx-auto mb-8 overflow-hidden "
//           >
//             {movies.map((movie, index) => (
//               <SwiperSlide
//                 key={movie.id}
//                 className="overflow-visible p-2 relative "
//               >
//                 {/* Hình ảnh chính (poster) */}
//                 <div
//                   className={`cursor-pointer rounded-lg overflow-hidden shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105 hover:translate-z-10 origin-center ${
//                     activeIndex === index ? "border-4 border-[#DF0707]" : ""
//                   }`}
//                   onClick={() => handlePosterClick(index)}
//                   style={{ transformStyle: "preserve-3d" }}
//                 >
//                   <Image
//                     src={movie.poster}
//                     alt={movie.title}
//                     width={200}
//                     height={300}
//                     style={{ objectFit: "cover" }}
//                   />
//                 </div>

//                 {/* Hình ảnh blur bên dưới poster */}
//                 <div className="absolute inset-0 -z-10">
//                   <Image
//                     src={movie.poster}
//                     alt={`${movie.title} blur`}
//                     width={200}
//                     height={300}
//                     style={{
//                       objectFit: "cover",
//                       filter: "blur(10px)", // Làm mờ hình ảnh
//                       opacity: 0.5, // Độ trong suốt
//                       position: "absolute",
//                       top: 0,
//                       left: 0,
//                       right: 0,
//                       bottom: 0,
//                     }}
//                   />
//                 </div>
//               </SwiperSlide>
//             ))}
//           </Swiper>
//           {/* Nút điều hướng cho poster */}
//           <div className="absolute top-1/2 left-0 transform -translate-y-1/2 z-10">
//             <div className="poster-prev text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="size-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M15.75 19.5 8.25 12l7.5-7.5"
//                 />
//               </svg>
//             </div>
//           </div>
//           <div className="absolute top-1/2 right-0 transform -translate-y-1/2 z-10">
//             <div className="poster-next text-white bg-black/30 rounded-full p-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="size-6"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="m8.25 4.5 7.5 7.5-7.5 7.5"
//                 />
//               </svg>
//             </div>
//           </div>
//         </div>
//         {/* Phần thân mới thêm vào */}
//         <div className="container mx-auto px-4 py-12">
//           {/* Hai button ở giữa */}
//           <div className="flex justify-center gap-6 mb-12">
//             <Button
//               variant="outline"
//               className={`px-10 py-5 text-lg font-semibold ${
//                 activeTab === "nowShowing"
//                   ? "bg-[#DF0707] text-white border-[#DF0707] hover:text-[#DF0707] dark:hover:bg-white"
//                   : "text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//               } transition-all duration-300`}
//               onClick={() => setActiveTab("nowShowing")}
//             >
//               Now Showing
//             </Button>
//             <Button
//               variant="outline"
//               className={`px-10 py-5 text-lg font-semibold ${
//                 activeTab === "upcoming"
//                   ? "bg-[#DF0707] text-white border-[#DF0707] hover:text-[#DF0707] dark:hover:bg-white"
//                   : "text-black dark:text-black dark:bg-white hover:bg-black hover:text-white dark:hover:bg-[#0e1116]  dark:hover:text-white"
//               } transition-all duration-300`}
//               onClick={() => setActiveTab("upcoming")}
//             >
//               Upcoming
//             </Button>
//           </div>

//           {/* Phần hiển thị movies */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-">
//             {activeTab === "nowShowing"
//               ? movies
//                   .filter((movie) => movie.status === "nowShowing")
//                   .map((movie) => (
//                     <div
//                       key={movie.id}
//                       className="group relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
//                     >
//                       <Image
//                         src={movie.poster}
//                         alt={movie.title}
//                         width={300}
//                         height={450}
//                         style={{ objectFit: "cover" }}
//                       />
//                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
//                         <h3 className="text-white text-xl font-semibold mb-2">
//                           {movie.title}
//                         </h3>
//                         <p className="text-white text-sm mb-2">
//                           {movie.year} | {movie.genre}
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="w-full bg-[#DF0707] text-white border-[#DF0707] hover:bg-white hover:text-[#DF0707]"
//                           onClick={() => handleBookNow(movie)}
//                         >
//                           Book Now
//                         </Button>
//                         <Button
//                           variant="outline"
//                           className="w-full dark:text-white border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black mt-2"
//                           onClick={() => handleViewDetails(movie)}
//                         >
//                           View Details
//                         </Button>
//                       </div>
//                     </div>
//                   ))
//               : movies
//                   .filter((movie) => movie.status === "upcoming")
//                   .map((movie) => (
//                     <div
//                       key={movie.id}
//                       className="group relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
//                     >
//                       <Image
//                         src={movie.poster}
//                         alt={movie.title}
//                         width={300}
//                         height={450}
//                         style={{ objectFit: "cover" }}
//                       />
//                       <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
//                         <h3 className="text-white text-xl font-semibold mb-2">
//                           {movie.title}
//                         </h3>
//                         <p className="text-white text-sm mb-2">
//                           {movie.releaseDate}
//                         </p>
//                         <Button
//                           variant="outline"
//                           className="w-full dark:text-white border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
//                           onClick={() => handleViewDetails(movie)}
//                         >
//                           View Details
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//           </div>
//         </div>
//         <div className="pb-12">
//           <AboutUs />
//         </div>
//       </div>
//     </div>
//   )
// }
import FullImageSlider from "@/components/full-image-slider"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* SLide ảnh full componeent */}
      <FullImageSlider />
      <h1>ădadawd</h1>
      <h1>ădadawd</h1>
      <h1>ădadawd</h1>
      <h1>ădadawd</h1>
      <h1>ădadawd</h1>
      <h1>ădadawd</h1>
      <h1>ădadawd</h1>
      <h1>ădadawd</h1>
    </div>
  )
}
