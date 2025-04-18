/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import FullImageSlider from "@/components/ui-home/full-image-slider"
import Movies from "@/components/ui-home/movies"
import { GenreService } from "@/services/genreService"
import actorAgeData from "@/data/actorAgeData"
import { MovieService } from "@/services/movieService"

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original"

export interface Movie {
  id: any
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
  status?: "upcoming" | "nowPlaying"
  createdAt: string
  updatedAt: string
  __v: number
  runtime?: number
  director?: string
  writers?: string[]
  starring?: string
}

interface Genre {
  id: string
  name: string
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

interface ActorAgeInfo {
  id: number
  ageRating: string
  director: string
  title?: string
  genre?: string
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [, setGenres] = useState<Genre[]>([])
  const [selectedGenre] = useState<string | null>(null)
  const [searchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Lấy danh sách thể loại
        const genresData = await GenreService.getGenres()
        setGenres(
          genresData.map((genre) => ({ ...genre, id: genre.id.toString() }))
        )

        // Lấy phim
        let moviesArray: Movie[] = []
        if (searchQuery) {
          // Tìm kiếm phim theo tiêu đề
          moviesArray = (await MovieService.searchMovies(searchQuery)).map(
            (movie) => ({
              ...movie,
              id: movie._id, // Map _id to id
            })
          )
        } else if (selectedGenre) {
          // Lấy phim theo thể loại
          moviesArray = (
            await GenreService.getMoviesByGenre(selectedGenre)
          ).map((movie) => ({
            ...movie,
            id: movie._id, // Map _id to id
          }))
        } else {
          // Lấy tất cả phim
          moviesArray = (await MovieService.getAllMovies()).map((movie) => ({
            ...movie,
            id: movie._id, // Map _id to id
          }))
        }

        const genreMap = await GenreService.getGenreMap()

        // Tạo map từ actorAgeData
        const actorAgeMap = new Map<number, ActorAgeInfo>()
        actorAgeData.movies.forEach((movie) => {
          actorAgeMap.set(movie.id, movie)
        })

        // Ánh xạ phim thành slides
        const mappedSlides: Slide[] = moviesArray.map((movie) => {
          const releaseDate = new Date(movie.releaseDate)
          const genreNames =
            movie.genreIds
              .map((id) => genreMap[id])
              .filter((name): name is string => !!name)
              .join(", ") || "No genres available"

          const extraInfo = actorAgeMap.get(movie.tmdbId)
          const status =
            movie.status ||
            (releaseDate <= new Date() ? "nowPlaying" : "upcoming")

          return {
            id: movie.id, // Convert _id to a number
            tmdbId: movie.tmdbId,
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
            status: status === "nowPlaying" ? "nowPlaying" : "upcoming",
            director: extraInfo?.director || "Unknown",
            rating: movie.voteAverage || 0,
          }
        })
        setSlides(mappedSlides)
        setLoading(false)
      } catch (err: any) {
        console.error("Error fetching data:", err)
        setError(err.message || "Failed to fetch data")
        setLoading(false)
      }
    }

    fetchData()
  }, [selectedGenre, searchQuery]) // Chạy lại khi selectedGenre hoặc searchQuery thay đổi

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
