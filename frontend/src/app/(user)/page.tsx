/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import FullImageSlider from "@/components/ui-home/full-image-slider"
import Movies from "@/components/ui-home/movies"
import { GenreService } from "@/services/genreService"
import actorAgeData from "@/data/actorAgeData"
import { MovieService } from "@/services/movieService"
import { useUser } from "@/hooks/use-user" // Import the useUser hook

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
  _id: string
  tmdbId: number
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
  const [genres, setGenres] = useState<Genre[]>([])
  const [selectedGenre] = useState<string | null>(null)
  const [searchQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use the useUser hook to get user data and authentication status
  const { user, isLoggedIn, loading: userLoading } = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch genres
        const genresData = await GenreService.getGenres()
        setGenres(
          genresData.map((genre) => ({ ...genre, id: genre.id.toString() }))
        )

        // Fetch movies based on login status
        let moviesArray: Movie[] = []
        if (searchQuery) {
          // Search movies by title
          moviesArray = (await MovieService.searchMovies(searchQuery)).map(
            (movie) => ({
              ...movie,
              id: movie._id,
            })
          )
        } else if (selectedGenre) {
          // Fetch movies by genre
          moviesArray = (
            await GenreService.getMoviesByGenre(selectedGenre)
          ).map((movie) => ({
            ...movie,
            id: movie._id,
          }))
        } else if (isLoggedIn && user?.id) {
          // Fetch recommendations for logged-in user
          moviesArray = (await MovieService.getRecommendations(user.id)).map(
            (movie) => ({
              ...movie,
              id: movie._id,
            })
          )
        } else {
          // Fetch all movies for non-logged-in users
          moviesArray = (await MovieService.getAllMovies()).map((movie) => ({
            ...movie,
            id: movie._id,
          }))
        }

        const genreMap = await GenreService.getGenreMap()

        // Create map from actorAgeData
        const actorAgeMap = new Map<number, ActorAgeInfo>()
        actorAgeData.movies.forEach((movie) => {
          actorAgeMap.set(movie.id, movie)
        })

        // Map movies to slides
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
            id: movie.tmdbId,
            _id: movie._id,
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

    // Only fetch data if user loading is complete
    if (!userLoading) {
      fetchData()
    }
  }, [selectedGenre, searchQuery, isLoggedIn, user, userLoading])

  if (loading || userLoading) {
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
