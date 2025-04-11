"use client"

import { useState, useEffect } from "react"
import FullImageSlider from "@/components/ui-home/full-image-slider"
import Movies from "@/components/ui-home/movies"
import { getAllMovies } from "@/services/movieService"

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

// Interface cho dữ liệu phim từ API
interface Movie {
  _id: string
  tmdbId: number
  title: string
  originalTitle: string
  overview: string
  posterPath: string | null
  backdropPath: string | null
  genreIds: number[]
  releaseDate: string
  voteAverage: number
  voteCount: number
  popularity: number
  originalLanguage: string
  adult: boolean
  video: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

// Interface cho API response
interface ApiResponse {
  message: string
  movies: Movie[]
}

// Interface cho slides (dùng chung cho FullImageSlider, Movies, PosterSlider)
interface Slide {
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
  status: "nowShowing" | "upcoming"
  director: string
  rating: number
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true)
        const response = await getAllMovies()
        console.log("Raw API response:", response)

        // Xử lý response để lấy mảng movies
        let moviesArray: Movie[] = []
        if (response && typeof response === "object" && "movies" in response) {
          moviesArray = (response as ApiResponse).movies
        } else if (Array.isArray(response)) {
          moviesArray = response as Movie[] // Trường hợp API trả mảng trực tiếp
        } else {
          throw new Error("API response is not an array or valid object")
        }

        console.log("Movies array:", moviesArray)

        const mappedSlides: Slide[] = moviesArray.map((movie) => {
          const releaseDate = new Date(movie.releaseDate)
          return {
            id: movie.tmdbId, // Dùng tmdbId làm id
            image: movie.backdropPath
              ? `${TMDB_IMAGE_BASE_URL}${movie.backdropPath}`
              : "/fallback-image.jpg",
            title: movie.title || "Untitled",
            description: movie.overview || "No description available.",
            poster: movie.posterPath
              ? `${TMDB_IMAGE_BASE_URL}${movie.posterPath}`
              : "/fallback-poster.jpg",
            duration: "N/A", // API không cung cấp, dùng mặc định
            genre: movie.genreIds.join(", "), // Tạm thời nối genreIds
            releaseYear: releaseDate.getFullYear(),
            ageRating: movie.adult ? "R" : "PG-13", // Giả định từ adult
            starring: "Unknown", // API không cung cấp
            status: releaseDate <= new Date() ? "nowShowing" : "upcoming",
            director: "Unknown", // API không cung cấp
            rating: movie.voteAverage || 0,
          }
        })

        console.log(
          "Mapped slides:",
          mappedSlides.map((slide) => ({
            id: slide.id,
            title: slide.title,
            image: slide.image,
            poster: slide.poster,
            status: slide.status,
          }))
        )
        setSlides(mappedSlides)
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching movies:", err)
        setError(err.message || "Failed to fetch movies")
        setLoading(false)
      }
    }

    fetchMovies()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        {error}
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white">
      <FullImageSlider slides={slides} />
      <Movies slides={slides} />
    </div>
  )
}
