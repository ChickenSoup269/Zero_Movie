/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client"
import { useState, useEffect } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { useToast } from "@/hooks/use-toast"

export default function MovieAdmin() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [formData, setFormData] = useState<MovieInput>({
    title: "",
    originalTitle: "",
    overview: "",
    releaseDate: "",
    status: "upcoming",
    posterPath: "",
    backdropPath: "",
    adult: false,
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchMovies()
  }, [])

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

  const handleSearch = async () => {
    if (!searchTerm) {
      fetchMovies()
      return
    }

    setIsLoading(true)
    try {
      const results = await searchMovies(searchTerm)
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
      await addMovie(formData)
      toast({
        title: "Success",
        description: "Movie added successfully",
      })
      fetchMovies()
      setIsAddDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add movie",
        variant: "destructive",
      })
    }
  }

  const handleEditClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setFormData({
      title: movie.title,
      originalTitle: movie.originalTitle,
      overview: movie.overview,
      releaseDate: movie.releaseDate,
      status: movie.status || "upcoming",
      posterPath: movie.posterPath || "",
      backdropPath: movie.backdropPath || "",
      adult: movie.adult,
      genreIds: movie.genreIds,
      director: movie.director,
      writers: movie.writers,
      starring: movie.starring,
      runtime: movie.runtime,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateMovie = async () => {
    if (!selectedMovie) return

    try {
      await updateMovie(selectedMovie._id, formData)
      toast({
        title: "Success",
        description: "Movie updated successfully",
      })
      fetchMovies()
      setIsEditDialogOpen(false)
      resetForm()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update movie",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClick = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsDeleteDialogOpen(true)
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
      setIsDeleteDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete movie",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, adult: checked }))
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value as "upcoming" | "nowPlaying",
    }))
  }

  return (
    <div className="container mx-auto py-8">
      <Toaster />
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Movie Admin Dashboard</CardTitle>
          <CardDescription>
            Manage your movie catalog with full CRUD operations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Search movies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button onClick={handleSearch}>Search</Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="originalTitle">Original Title</Label>
                      <Input
                        id="originalTitle"
                        name="originalTitle"
                        value={formData.originalTitle || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      name="overview"
                      value={formData.overview || ""}
                      onChange={handleInputChange}
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
                        value={formData.releaseDate || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
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
                        value={formData.posterPath || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backdropPath">Backdrop Path</Label>
                      <Input
                        id="backdropPath"
                        name="backdropPath"
                        value={formData.backdropPath || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="adult"
                        checked={formData.adult || false}
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
                      setIsAddDialogOpen(false)
                      resetForm()
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
                    <TableHead>Status</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movies.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
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
                          <Badge
                            variant={
                              movie.status === "nowPlaying"
                                ? "default"
                                : "outline"
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
                            onClick={() => handleEditClick(movie)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(movie)}
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
        </CardContent>
      </Card>

      {/* Edit Movie Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
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
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-originalTitle">Original Title</Label>
                <Input
                  id="edit-originalTitle"
                  name="originalTitle"
                  value={formData.originalTitle || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-overview">Overview</Label>
              <Textarea
                id="edit-overview"
                name="overview"
                value={formData.overview || ""}
                onChange={handleInputChange}
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
                    formData.releaseDate
                      ? formData.releaseDate.split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={formData.status}
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
                  value={formData.posterPath || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-backdropPath">Backdrop Path</Label>
                <Input
                  id="edit-backdropPath"
                  name="backdropPath"
                  value={formData.backdropPath || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-adult"
                  checked={formData.adult || false}
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
                setIsEditDialogOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateMovie}>Update Movie</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              movie "{selectedMovie?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMovie}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
