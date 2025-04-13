/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import FullImageSlider from "@/components/ui-home/full-image-slider"
import Movies from "@/components/ui-home/movies"
import { getAllMovies } from "@/services/movieService"
import { GenreService } from "@/services/genreService"
import actorAgeData from "@/data/actorAgeData" // Import dữ liệu ageRating và director

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

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
  status?: "upcoming" | "nowPlaying" // Added status field from schema
  createdAt: string
  updatedAt: string
  __v: number
}

interface ApiResponse {
  message: string
  movies: Movie[]
}

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
  status: "nowPlaying" | "upcoming"
  director: string
  rating: number
}

// Interface cho dữ liệu bên ngoài
interface ActorAgeInfo {
  id: number
  ageRating: string
  director: string
  title?: string
  genre?: string
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMoviesAndGenres = async () => {
      try {
        setLoading(true)
        const movieResponse = await getAllMovies()
        let moviesArray: Movie[] = []
        if (
          movieResponse &&
          typeof movieResponse === "object" &&
          "movies" in movieResponse
        ) {
          moviesArray = (movieResponse as ApiResponse).movies
        } else if (Array.isArray(movieResponse)) {
          moviesArray = movieResponse as Movie[]
        } else {
          throw new Error("API response is not an array or valid object")
        }

        const genreMap = await GenreService.getGenreMap()
        console.log("Genre map:", genreMap)
        console.log(
          "Sample movie:",
          moviesArray[0]?.title,
          moviesArray[0]?.genreIds
        )

        // Tạo map từ actorAgeData để tìm kiếm nhanh hơn
        const actorAgeMap = new Map<number, ActorAgeInfo>()
        actorAgeData.movies.forEach((movie) => {
          actorAgeMap.set(movie.id, movie)
        })

        const mappedSlides: Slide[] = moviesArray.map((movie) => {
          const releaseDate = new Date(movie.releaseDate)
          const genreNames =
            movie.genreIds
              .map((id) => {
                const name = genreMap[id]
                console.log(
                  `Movie ${movie.title} - Genre ID ${id}: ${
                    name || "Not found"
                  }`
                )
                return name
              })
              .filter((name): name is string => !!name)
              .join(", ") || "No genres available"

          // Tìm thông tin ageRating và director từ dữ liệu bên ngoài
          const extraInfo = actorAgeMap.get(movie.tmdbId)

          // Prioritize the status from the database, fallback to date-based logic if not available
          const status =
            movie.status ||
            (releaseDate <= new Date() ? "nowPlaying" : "upcoming")

          return {
            id: movie.tmdbId,
            image: movie.backdropPath
              ? `${TMDB_IMAGE_BASE_URL}${movie.backdropPath}`
              : "/fallback-image.jpg",
            title: movie.title || "Untitled",
            description: movie.overview || "No description available.",
            poster: movie.posterPath
              ? `${TMDB_IMAGE_BASE_URL}${movie.posterPath}`
              : "/fallback-poster.jpg",
            duration: "N/A",
            genre: genreNames,
            releaseYear: releaseDate.getFullYear(),
            ageRating:
              extraInfo?.ageRating ||
              (movie.adult
                ? "public/images/ageRating/pegi_18"
                : "public/images/ageRating/pegi_12"),
            starring: "Unknown",
            status: status as "nowPlaying" | "upcoming", // Use the status from database or fallback
            director: extraInfo?.director || "Unknown",
            rating: movie.voteAverage || 0,
          }
        })

        console.log(
          "Mapped slides:",
          mappedSlides.map((slide) => ({
            id: slide.id,
            title: slide.title,
            genre: slide.genre,
            director: slide.director,
            ageRating: slide.ageRating,
            status: slide.status, // Log status to verify
          }))
        )
        setSlides(mappedSlides)
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to fetch movies or genres")
        setLoading(false)
      }
    }

    fetchMoviesAndGenres()
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
