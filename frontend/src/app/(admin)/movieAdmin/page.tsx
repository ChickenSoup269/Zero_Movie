/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toaster } from "@/components/ui/toaster"
import {
  getAllMovies,
  getMovieById,
  searchMovies,
  addMovie,
  updateMovie,
  deleteMovie,
  type Movie,
  type MovieInput,
} from "@/services/movieService"
import { GenreService, type Genre } from "@/services/genreService"
import { useToast } from "@/hooks/use-toast"

export default function MovieAdmin() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [genreMap, setGenreMap] = useState<Record<number, string>>({})
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [movieSearchTerm, setMovieSearchTerm] = useState("")
  const [genreSearchTerm, setGenreSearchTerm] = useState("")
  const [isAddMovieDialogOpen, setIsAddMovieDialogOpen] = useState(false)
  const [isEditMovieDialogOpen, setIsEditMovieDialogOpen] = useState(false)
  const [isDeleteMovieDialogOpen, setIsDeleteMovieDialogOpen] = useState(false)
  const [isAddGenreDialogOpen, setIsAddGenreDialogOpen] = useState(false)
  const [isEditGenreDialogOpen, setIsEditGenreDialogOpen] = useState(false)
  const [isDeleteGenreDialogOpen, setIsDeleteGenreDialogOpen] = useState(false)
  const [movieFormData, setMovieFormData] = useState<MovieInput>({
    title: "",
    originalTitle: "",
    overview: "",
    releaseDate: "",
    status: "upcoming",
    posterPath: "",
    backdropPath: "",
    adult: false,
  })
  const [genreFormData, setGenreFormData] = useState<{ name: string }>({
    name: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [movieData, genreData, genreMapData] = await Promise.all([
          getAllMovies(),
          GenreService.getGenres(),
          GenreService.getGenreMap(),
        ])
        setMovies(movieData)
        setGenres(genreData)
        setGenreMap(genreMapData)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  // Movie Functions
  const fetchMovies = async () => {
    setIsLoading(true)
    try {
      const data = await getAllMovies()
      setMovies(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch movies",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleMovieSearch = async () => {
    if (!movieSearchTerm) {
      fetchMovies()
      return
    }
    setIsLoading(true)
    try {
      const results = await searchMovies(movieSearchTerm)
      setMovies(results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search movies",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMovie = async () => {
    try {
      await addMovie(movieFormData)
      toast({
        title: "Success",
        description: "Movie added successfully",
      })
      fetchMovies()
      setIsAddMovieDialogOpen(false)
      resetMovieForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add movie",
        variant: "destructive",
      })
    }
  }

  const handleEditMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setMovieFormData({
      title: movie.title,
      originalTitle: movie.originalTitle,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      status: movie.status || "upcoming",
      posterPath: movie.posterPath || "",
      backdropPath: movie.backdropPath || "",
      adult: movie.adult,
      genreIds: movie.genreIds,
    })
    setIsEditMovieDialogOpen(true)
  }

  const handleUpdateMovie = async () => {
    if (!selectedMovie) return
    try {
      await updateMovie(selectedMovie._id, movieFormData)
      toast({
        title: "Success",
        description: "Movie updated successfully",
      })
      fetchMovies()
      setIsEditMovieDialogOpen(false)
      resetMovieForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update movie",
        variant: "destructive",
      })
    }
  }

  const handleDeleteMovieClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsDeleteMovieDialogOpen(true)
  }

  const handleDeleteMovie = async () => {
    if (!selectedMovie) return
    try {
      await deleteMovie(selectedMovie._id)
      toast({
        title: "Success",
        description: "Movie deleted successfully",
      })
      fetchMovies()
      setIsDeleteMovieDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive",
      })
    }
  }

  const resetMovieForm = () => {
    setMovieFormData({
      title: "",
      originalTitle: "",
      overview: "",
      releaseDate: "",
      status: "upcoming",
      posterPath: "",
      backdropPath: "",
      adult: false,
    })
    setSelectedMovie(null)
  }

  const handleMovieInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setMovieFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setMovieFormData((prev) => ({ ...prev, adult: checked }))
  }

  const handleStatusChange = (value: string) => {
    setMovieFormData((prev) => ({
      ...prev,
      status: value as "upcoming" | "nowPlaying",
    }))
  }

  // Genre Functions
  const fetchGenres = async () => {
    setIsLoading(true)
    try {
      const [genreData, genreMapData] = await Promise.all([
        GenreService.getGenres(),
        GenreService.getGenreMap(),
      ])
      setGenres(genreData)
      setGenreMap(genreMapData)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch genres",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenreSearch = async () => {
    if (!genreSearchTerm) {
      fetchGenres()
      return
    }
    setIsLoading(true)
    try {
      const results = await GenreService.searchGenre(genreSearchTerm)
      setGenres(results)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search genres",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddGenre = async () => {
    try {
      await GenreService.addGenre(genreFormData.name)
      toast({
        title: "Success",
        description: "Genre added successfully",
      })
      fetchGenres()
      setIsAddGenreDialogOpen(false)
      resetGenreForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add genre",
        variant: "destructive",
      })
    }
  }

  const handleEditGenreClick = (genre: Genre) => {
    setSelectedGenre(genre)
    setGenreFormData({ name: genre.name })
    setIsEditGenreDialogOpen(true)
  }

  const handleUpdateGenre = async () => {
    if (!selectedGenre) return
    try {
      await GenreService.updateGenre(
        selectedGenre.id.toString(),
        genreFormData.name
      )
      toast({
        title: "Success",
        description: "Genre updated successfully",
      })
      fetchGenres()
      setIsEditGenreDialogOpen(false)
      resetGenreForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update genre",
        variant: "destructive",
      })
    }
  }

  const handleDeleteGenreClick = (genre: Genre) => {
    setSelectedGenre(genre)
    setIsDeleteGenreDialogOpen(true)
  }

  const handleDeleteGenre = async () => {
    if (!selectedGenre) return
    try {
      await GenreService.deleteGenre(selectedGenre.id.toString())
      toast({
        title: "Success",
        description: "Genre deleted successfully",
      })
      fetchGenres()
      setIsDeleteGenreDialogOpen(false)
      resetGenreForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete genre",
        variant: "destructive",
      })
    }
  }

  const resetGenreForm = () => {
    setGenreFormData({ name: "" })
    setSelectedGenre(null)
  }

  const handleGenreInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGenreFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
          <CardDescription>
            Manage your movie catalog and genres
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="movies" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="movies">Movies</TabsTrigger>
              <TabsTrigger value="genres">Genres</TabsTrigger>
            </TabsList>
            <TabsContent value="movies">
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Search movies..."
                  value={movieSearchTerm}
                  onChange={(e) => setMovieSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                <Button onClick={handleMovieSearch}>Search</Button>
                <Dialog
                  open={isAddMovieDialogOpen}
                  onOpenChange={setIsAddMovieDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="ml-auto">Add New Movie</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Movie</DialogTitle>
                      <DialogDescription>
                        Fill in the details for the new movie
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="title">Title</Label>
                          <Input
                            id="title"
                            name="title"
                            value={movieFormData.title}
                            onChange={handleMovieInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="originalTitle">Original Title</Label>
                          <Input
                            id="originalTitle"
                            name="originalTitle"
                            value={movieFormData.originalTitle || ""}
                            onChange={handleMovieInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="overview">Overview</Label>
                        <Textarea
                          id="overview"
                          name="overview"
                          value={movieFormData.overview || ""}
                          onChange={handleMovieInputChange}
                          rows={4}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="releaseDate">Release Date</Label>
                          <Input
                            id="releaseDate"
                            name="releaseDate"
                            type="date"
                            value={movieFormData.releaseDate || ""}
                            onChange={handleMovieInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="status">Status</Label>
                          <Select
                            value={movieFormData.status}
                            onValueChange={handleStatusChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="upcoming">Upcoming</SelectItem>
                              <SelectItem value="nowPlaying">
                                Now Playing
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="posterPath">Poster Path</Label>
                          <Input
                            id="posterPath"
                            name="posterPath"
                            value={movieFormData.posterPath || ""}
                            onChange={handleMovieInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="backdropPath">Backdrop Path</Label>
                          <Input
                            id="backdropPath"
                            name="backdropPath"
                            value={movieFormData.backdropPath || ""}
                            onChange={handleMovieInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="adult"
                            checked={movieFormData.adult || false}
                            onCheckedChange={handleCheckboxChange}
                          />
                          <Label htmlFor="adult">Adult Content</Label>
                        </div>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddMovieDialogOpen(false)
                          resetMovieForm()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddMovie}>Add Movie</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Poster</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Release Date</TableHead>
                        <TableHead>Genres</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movies.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            No movies found
                          </TableCell>
                        </TableRow>
                      ) : (
                        movies.map((movie) => (
                          <TableRow key={movie._id}>
                            <TableCell>
                              {movie.posterPath ? (
                                <img
                                  src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`}
                                  alt={movie.title}
                                  className="w-12 h-16 object-cover rounded"
                                  onError={(e) => {
                                    ;(e.target as HTMLImageElement).src =
                                      "/api/placeholder/92/138"
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                                  No Image
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium">{movie.title}</div>
                              {movie.originalTitle &&
                                movie.originalTitle !== movie.title && (
                                  <div className="text-sm text-gray-500">
                                    {movie.originalTitle}
                                  </div>
                                )}
                            </TableCell>
                            <TableCell>
                              {new Date(movie.releaseDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {movie.genreIds
                                .map((id) => genreMap[id] || "Unknown")
                                .join(", ") || "N/A"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  movie.status === "nowPlaying"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-400 text-white"
                                }
                              >
                                {movie.status === "nowPlaying"
                                  ? "Now Playing"
                                  : "Upcoming"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {movie.voteAverage
                                ? movie.voteAverage.toFixed(1)
                                : "N/A"}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditMovieClick(movie)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteMovieClick(movie)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            <TabsContent value="genres">
              <div className="flex gap-4 mb-4">
                <Input
                  placeholder="Search genres..."
                  value={genreSearchTerm}
                  onChange={(e) => setGenreSearchTerm(e.target.value)}
                  className="max-w-md"
                />
                <Button onClick={handleGenreSearch}>Search</Button>
                <Dialog
                  open={isAddGenreDialogOpen}
                  onOpenChange={setIsAddGenreDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button className="ml-auto">Add New Genre</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Genre</DialogTitle>
                      <DialogDescription>
                        Enter the name of the new genre
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <Label htmlFor="name">Genre Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={genreFormData.name}
                        onChange={handleGenreInputChange}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddGenreDialogOpen(false)
                          resetGenreForm()
                        }}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleAddGenre}>Add Genre</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              {isLoading ? (
                <div className="text-center py-8">Loading...</div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {genres.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-4">
                            No genres found
                          </TableCell>
                        </TableRow>
                      ) : (
                        genres.map((genre) => (
                          <TableRow key={genre.id}>
                            <TableCell>{genre.id}</TableCell>
                            <TableCell>{genre.name}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditGenreClick(genre)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteGenreClick(genre)}
                              >
                                Delete
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Movie Dialog */}
      <Dialog
        open={isEditMovieDialogOpen}
        onOpenChange={setIsEditMovieDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Movie</DialogTitle>
            <DialogDescription>
              Update the details for {selectedMovie?.title}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={movieFormData.title}
                  onChange={handleMovieInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-originalTitle">Original Title</Label>
                <Input
                  id="edit-originalTitle"
                  name="originalTitle"
                  value={movieFormData.originalTitle || ""}
                  onChange={handleMovieInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-overview">Overview</Label>
              <Textarea
                id="edit-overview"
                name="overview"
                value={movieFormData.overview || ""}
                onChange={handleMovieInputChange}
                rows={4}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-releaseDate">Release Date</Label>
                <Input
                  id="edit-releaseDate"
                  name="releaseDate"
                  type="date"
                  value={
                    movieFormData.releaseDate
                      ? movieFormData.releaseDate.split("T")[0]
                      : ""
                  }
                  onChange={handleMovieInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={movieFormData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="nowPlaying">Now Playing</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-posterPath">Poster Path</Label>
                <Input
                  id="edit-posterPath"
                  name="posterPath"
                  value={movieFormData.posterPath || ""}
                  onChange={handleMovieInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-backdropPath">Backdrop Path</Label>
                <Input
                  id="edit-backdropPath"
                  name="backdropPath"
                  value={movieFormData.backdropPath || ""}
                  onChange={handleMovieInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-adult"
                  checked={movieFormData.adult || false}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="edit-adult">Adult Content</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditMovieDialogOpen(false)
                resetMovieForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMovie}>Update Movie</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Movie Dialog */}
      <AlertDialog
        open={isDeleteMovieDialogOpen}
        onOpenChange={setIsDeleteMovieDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              movie &quot;{selectedMovie?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsDeleteMovieDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMovie}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Genre Dialog */}
      <Dialog
        open={isEditGenreDialogOpen}
        onOpenChange={setIsEditGenreDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Genre</DialogTitle>
            <DialogDescription>
              Update the name for {selectedGenre?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="edit-name">Genre Name</Label>
            <Input
              id="edit-name"
              name="name"
              value={genreFormData.name}
              onChange={handleGenreInputChange}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditGenreDialogOpen(false)
                resetGenreForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateGenre}>Update Genre</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Genre Dialog */}
      <AlertDialog
        open={isDeleteGenreDialogOpen}
        onOpenChange={setIsDeleteGenreDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              genre &quot;{selectedGenre?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsDeleteGenreDialogOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGenre}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
