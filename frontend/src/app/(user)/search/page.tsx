"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const movies = [
  {
    id: 1,
    title: "Dandadan",
    year: "2024",
    age: "16+",
    genre: "Anime",
    imageFull:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABddbZ9kdS14TgTLF-5HIY1A2OP-xRqeAuB-6fhWaze1Em28zwv5ca0IsJoLHfcAyBJBH7qmX5FcClEUWrjYYOPdqPaIAWY1klZ8o.webp?r=54d",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABSbYqa5p_N9pN79rdPjAWBBXzUidzesj45Br7yS9Krg3Ig7oib6Bt5v4-fEx7kJEF4UFpRRf6d7e8OEBGawHmbl2tmxPCUilhtvwJhwcaeioqcpaa2fr6aKbRPZQIQe1e13bIQ.webp?r=c93",
    description:
      "In a bet to prove whether ghosts or aliens exist, two high schoolers uncover paranormal threats, gain superpowers, and maybe even fall in love?",
    starring: "Starring: Shion Wakayama, Natsuki Hanae, Nana Mizuki",
    status: "nowShowing",
    releaseDate: "March 15, 2025",
  },
  {
    id: 2,
    title: "Chainsaw Man",
    year: "2022",
    age: "18+",
    genre: "Anime",
    imageFull:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABS5UUxKLG-m9Z1zXlITh-j8OTpbJQHjCCNwUFgVnzQz_OpFX4v_XN4UIkO99_jep0FNLX6tcX2s0KXmvTvCFFjKYGQ1s4aRvENJ8.webp?r=4f2",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABeq2Rqsua47S8j0_XmB8_iZnyBufOk1uLGPfzopf4F1bEHvuI_W_iBNd5-OQ2J3R1wrEVI5u3uE6mtgURNsUhZhg9RwxZHi6VTly.webp?r=c1a",
    description:
      "A young man merges with a devil to become a powerful devil hunter.",
    starring: "Starring: Kikunosuke Toya, Tomori Kusunoki",
    status: "nowShowing",
  },
  {
    id: 3,
    title: "Sakamoto Days",
    year: "2025",
    age: "13+",
    genre: "Anime",
    imageFull:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABS8sYAW8i5x_OS8VgTmf0VVxZtfDkI92nAMneZcFd8UJHo8q2FJCHll33mGEi9sSVFi7zKpnylOFD1n7PcN4WBZIHWEz3jXeiezF.webp?r=b87",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABVzVapAGG_WsoP7yQ8LCoFY53ip68QDOPeP7MB7BH4t4S0ffRMydDOKpwWB7NiOkSEbE8tIIsa8Dd-918u3oTcLM7mrGZSYKpUZg.webp?r=524",
    description:
      "A retired hitman tries to live a peaceful life while hiding his past.",
    starring: "Starring: Tomokazu Sugita, Rie Takahashi",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Demon Slayer",
    year: "2019",
    age: "13+",
    genre: "Anime",
    imageFull:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/Z-WHgqd_TeJxSuha8aZ5WpyLcX8/AAAABVqZNv5hm-kbgW7x4-6qo9Mw9kErJxQPd3zKbhOAau-3p3TQjT8Jyh5wMKmr54hy8qVgMcNBepa_qlRbI4T8sAGnczGioGUOYUV5.webp?r=3ba",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABTDenBojPT8LKSPuudCycMPI2G7wgi6e5Ivr9h6Cl7ZRSVxrEHnee-ALnuJO4ZveYjNemAz-uB-YXg5kVyvRJqP5T1dRJVRohIdR4ZVjerSiysnHdqVkzcWNUHIzgBRQvNcCAg.webp?r=6ef",
    description:
      "A young boy becomes a demon slayer to save his sister, who turned into a demon.",
    starring: "Starring: Natsuki Hanae, Akari Kito",
    status: "upcoming",
  },
  {
    id: 5,
    title: "Attack on Titan",
    year: "2013",
    age: "16+",
    genre: "Anime",
    imageFull: "/images/attackontitan-full.jpg",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABTWnhpG_2X5yH3DU-dU6AQuOb6TOlDZdwgezNFBUCHLzjMEkRZZ1UTFMTjIR1Yv2_l4rHvG-LsURLQG9AE5iSowQd5wrWn4SLyIz.webp?r=097",
    description:
      "Humans fight against giant humanoid Titans to reclaim their world.",
    starring: "Starring: Yuki Kaji, Yui Ishikawa",
    status: "nowShowing",
  },
  {
    id: 6,
    title: "My Hero Academia",
    year: "2016",
    age: "13+",
    genre: "Anime",
    imageFull: "/images/myheroacademia-full.jpg",
    poster:
      "https://occ-0-58-325.1.nflxso.net/dnm/api/v6/mAcAr9TxZIVbINe88xb3Teg5_OA/AAAABcAxTxtIpvtWKtxnwtHqoHgpl0YLi185G1nPwmF5gO_wkE8ccvq_8k5WyT30Vun95kL8VkhrFquP_5KAYiLQ-gjG12doH5yunF_I.webp?r=1cb",
    description:
      "A boy without powers aims to become the greatest hero in a world of superhumans.",
    starring: "Starring: Daiki Yamashita, Kenta Miyake",
    status: "nowShowing",
  },
]

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all") // Thay "" bằng "all"
  const [activeTab, setActiveTab] = useState("nowShowing")

  const genres = [
    { value: "anime", label: "Anime" },
    { value: "comedy", label: "Comedy" },
    { value: "drama", label: "Drama" },
    { value: "horror", label: "Horror" },
    { value: "sci-fi", label: "Sci-Fi" },
    { value: "romance", label: "Romance" },
    { value: "thriller", label: "Thriller" },
    { value: "animation", label: "Animation" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Search Query:", searchQuery, "Genre:", selectedGenre)
  }

  const handleBookNow = (movie) => {
    console.log("Booking:", movie.title)
  }

  const handleViewDetails = (movie) => {
    console.log("Viewing details:", movie.title)
  }

  const filteredMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesGenre =
      selectedGenre === "all" ||
      movie.genre.toLowerCase() === selectedGenre.toLowerCase()
    return matchesSearch && matchesGenre
  })

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        {/* Thanh tìm kiếm */}
        <Card className="w-full max-w-2xl mx-auto border-black bg-white/90 mb-12">
          <CardHeader>
            <CardTitle className="text-black text-2xl">Search Movies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="search" className="text-black">
                  Search for your favorite movies
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="search"
                    type="text"
                    placeholder="Enter movie title..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border-black text-black bg-white placeholder-gray-400"
                  />
                  <Button
                    type="submit"
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    Search
                  </Button>
                </div>
              </div>
            </form>
            <div className="space-y-2">
              <Label htmlFor="genre" className="text-black">
                Filter by Genre
              </Label>
              <Select onValueChange={setSelectedGenre} value={selectedGenre}>
                <SelectTrigger
                  id="genre"
                  className="border-black text-black bg-white"
                >
                  <SelectValue placeholder="Select a genre" />
                </SelectTrigger>
                <SelectContent className="bg-white border-black">
                  <SelectItem value="all" className="text-black">
                    All Genres
                  </SelectItem>
                  {genres.map((genre) => (
                    <SelectItem
                      key={genre.value}
                      value={genre.value}
                      className="text-black"
                    >
                      {genre.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Phần hiển thị phim */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-center gap-6 mb-12">
            <Button
              variant="outline"
              className={`px-10 py-5 text-lg font-semibold ${
                activeTab === "nowShowing"
                  ? "bg-[#DF0707] text-white border-[#DF0707] hover:text-[#DF0707]"
                  : "text-black hover:bg-black hover:text-white"
              } transition-all duration-300`}
              onClick={() => setActiveTab("nowShowing")}
            >
              Now Showing
            </Button>
            <Button
              variant="outline"
              className={`px-10 py-5 text-lg font-semibold ${
                activeTab === "upcoming"
                  ? "bg-[#DF0707] text-white border-[#DF0707] hover:text-[#DF0707]"
                  : "text-black hover:bg-black hover:text-white"
              } transition-all duration-300`}
              onClick={() => setActiveTab("upcoming")}
            >
              Upcoming
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {activeTab === "nowShowing"
              ? filteredMovies
                  .filter((movie) => movie.status === "nowShowing")
                  .map((movie) => (
                    <div
                      key={movie.id}
                      className="group relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={300}
                        height={450}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white text-xl font-semibold mb-2">
                          {movie.title}
                        </h3>
                        <p className="text-white text-sm mb-2">
                          {movie.year} | {movie.genre}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full bg-[#DF0707] text-white border-[#DF0707] hover:bg-white hover:text-[#DF0707]"
                          onClick={() => handleBookNow(movie)}
                        >
                          Book Now
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-white border-white hover:bg-black hover:text-white mt-2"
                          onClick={() => handleViewDetails(movie)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))
              : filteredMovies
                  .filter((movie) => movie.status === "upcoming")
                  .map((movie) => (
                    <div
                      key={movie.id}
                      className="group relative rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-105"
                    >
                      <Image
                        src={movie.poster}
                        alt={movie.title}
                        width={300}
                        height={450}
                        style={{ objectFit: "cover" }}
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                        <h3 className="text-white text-xl font-semibold mb-2">
                          {movie.title}
                        </h3>
                        <p className="text-white text-sm mb-2">
                          {movie.releaseDate}
                        </p>
                        <Button
                          variant="outline"
                          className="w-full text-white border-white hover:bg-black hover:text-white"
                          onClick={() => handleViewDetails(movie)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage
