"use client"

import { useState, useEffect } from "react";
import FullImageSlider from "@/components/ui-home/full-image-slider";
import Movies from "@/components/ui-home/movies";
import { GenreService } from "@/services/genreService";
import actorAgeData from "@/data/actorAgeData";
import { MovieService, Movie } from "@/services/movieService"; // Import Movie interface
import { useUser } from "@/hooks/use-user";

const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p/original";

interface Genre {
  id: string;
  name: string;
}

interface Slide {
  id: number;
  _id: string;
  tmdbId: number;
  image: string;
  title: string;
  description: string;
  poster: string;
  duration: string;
  genre: string;
  releaseYear: number;
  ageRating: string;
  starring: string;
  status: "nowPlaying" | "upcoming";
  director: string;
  rating: number;
}

interface ActorAgeInfo {
  id: number;
  ageRating: string;
  director: string;
  title?: string;
  genre?: string;
}

export default function Home() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre] = useState<string | null>(null);
  const [searchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user, isLoggedIn, loading: userLoading } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const genresData = await GenreService.getGenres();
        setGenres(
          genresData.map((genre) => ({ ...genre, id: genre.id.toString() }))
        );

        let moviesArray: Movie[] = [];
        if (searchQuery) {
          moviesArray = await MovieService.searchMovies(searchQuery);
        } else if (selectedGenre) {
          moviesArray = await GenreService.getMoviesByGenre(selectedGenre);
        } else if (isLoggedIn && user?.id) {
          moviesArray = await MovieService.getRecommendations(user.id);
        } else {
          moviesArray = await MovieService.getAllMovies();
        }

        const genreMap = await GenreService.getGenreMap();

        const actorAgeMap = new Map<number, ActorAgeInfo>();
        actorAgeData.movies.forEach((movie) => {
          actorAgeMap.set(movie.id, movie);
        });

        const mappedSlides: Slide[] = moviesArray.map((movie) => {
          const releaseDate = new Date(movie.releaseDate || "");
          const genreNames =
            movie.genreIds
              .map((id) => genreMap[id])
              .filter((name): name is string => !!name)
              .join(", ") || "No genres available";

          const extraInfo = actorAgeMap.get(movie.tmdbId);
          const status =
            movie.status ||
            (releaseDate <= new Date() ? "nowPlaying" : "upcoming");
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
            duration: movie.runtime ? `${movie.runtime} min` : "N/A",
            genre: genreNames,
            releaseYear: releaseDate.getFullYear() || 0,
            ageRating:
              extraInfo?.ageRating ||
              (movie.adult
                ? "public/images/ageRating/pegi_18"
                : "public/images/ageRating/pegi_12"),
            starring: movie.starring || "Unknown",
            status: status === "nowPlaying" ? "nowPlaying" : "upcoming",
            director: extraInfo?.director || "Unknown",
            rating: movie.voteAverage || 0,
          };
        });
        setSlides(mappedSlides);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to fetch data");
        setLoading(false);
      }
    };

    if (!userLoading) {
      fetchData();
    }
  }, [selectedGenre, searchQuery, isLoggedIn, user, userLoading]);

  if (loading || userLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      <FullImageSlider slides={slides} />
      <Movies slides={slides} />
    </div>
  );
}