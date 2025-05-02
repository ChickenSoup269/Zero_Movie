/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/toaster"
import { Search, X, CheckCircle, Film, Loader2 } from "lucide-react"

// Import services
import {
  getAllCinemas,
  createCinema,
  updateCinema,
  deleteCinema,
} from "@/services/cinemaService"
import {
  getRoomsByCinemaId,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/services/roomService"
import {
  getSeatsByRoom,
  deleteSeat,
  createSeat,
  updateSeat,
} from "@/services/seatService"
import {
  getAllShowtimes,
  createShowtime,
  deleteShowtime,
} from "@/services/showtimeService"
import { MovieService } from "@/services/movieService"

// Import tab components
import CinemasTab from "@/components/ui-admin/ui-cinema/cinemas-tab"
import RoomsTab from "@/components/ui-admin/ui-cinema/rooms-tab"
import SeatsTab from "@/components/ui-admin/ui-cinema/seats-tab"
import ShowtimesTab from "@/components/ui-admin/ui-cinema/showtimes-tab"
import Image from "next/image"

interface Cinema {
  id: string
  name: string
  address: string
  createdAt: string
  updatedAt?: string
}

interface Room {
  _id: string
  cinemaId: string
  roomNumber: string
  capacity: number
  createdAt?: string
  updatedAt?: string
  __v?: number
}

interface Seat {
  _id: string
  roomId: string
  seatNumber: string
  row: string
  column: number
  type: "standard"
  createdAt?: string
  updatedAt?: string
}

interface Showtime {
  _id: string
  movieId: number
  roomId: string
  startTime: string
  endTime: string
  price: number
  movie?: Movie
}

interface Movie {
  id: number
  tmdbId: number
  title: string
  poster_path: string
  _id: string
}

export default function AdminCinema() {
  const [activeTab, setActiveTab] = useState("cinemas")
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(
    null
  )
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [seats, setSeats] = useState<Seat[]>([])
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [cinemaForm, setCinemaForm] = useState({ name: "", address: "" })
  const [roomForm, setRoomForm] = useState({
    cinemaId: "",
    roomNumber: "",
    capacity: 0,
  })
  const [seatForm, setSeatForm] = useState({
    roomId: "",
    seatNumber: "",
    row: "",
    column: 0,
    type: "",
  })
  const [showtimeForm, setShowtimeForm] = useState<{
    movieId: number
    roomId: string
    startTime: string
    endTime: string
    price: number
  }>({
    movieId: 0, // Will be set by movie dropdown
    roomId: "", // Will be set by selectedRoom
    startTime: "", // Default for testing
    endTime: "", // Default for testing
    price: 10, // Default price
  })
  const [cinemaDialog, setCinemaDialog] = useState(false)
  const [roomDialog, setRoomDialog] = useState(false)
  const [seatDialog, setSeatDialog] = useState(false)
  const [showtimeDialog, setShowtimeDialog] = useState(false)

  const [movieSearchDialog, setMovieSearchDialog] = useState(false)
  const [movieSearchQuery, setMovieSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const { toast } = useToast()

  const fetchMovies = useCallback(async () => {
    try {
      const moviesList = await MovieService.getAllMovies()
      setMovies(moviesList)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách phim",
        variant: "destructive",
      })
    }
  }, [toast])

  const fetchCinemas = useCallback(async () => {
    try {
      const res = await getAllCinemas()
      if (res.cinemas) {
        setCinemas(Array.isArray(res.cinemas) ? res.cinemas : [])
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách rạp phim",
        variant: "destructive",
      })
    }
  }, [toast])

  // Các hàm tiện ích cần thêm vào component
  const isFormValid = () => {
    return (
      showtimeForm.movieId !== 0 &&
      selectedRoom?._id &&
      showtimeForm.startTime &&
      showtimeForm.endTime &&
      showtimeForm.price > 0
    )
  }

  // Function để kiểm tra form đã điền đầy đủ chưa (để hiện phần xác nhận)
  const isFormComplete = () => {
    return (
      showtimeForm.movieId !== 0 &&
      selectedRoom?._id &&
      showtimeForm.startTime &&
      showtimeForm.endTime &&
      showtimeForm.price >= 0
    )
  }

  // Function để tính thời gian kết thúc dựa trên thời gian bắt đầu và runtime
  const calculateEndTime = (startTime, runtimeMinutes) => {
    if (!startTime) return ""
    const date = new Date(startTime)
    date.setMinutes(date.getMinutes() + runtimeMinutes)

    // Format to datetime-local value
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16)
  }

  // Format datetime cho đẹp
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A"
    const date = new Date(dateTimeString)
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount)
  }

  // Tính thời lượng phim từ thời gian bắt đầu và kết thúc (phút)
  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return 0

    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationMs = end - start
    const durationMinutes = Math.round(durationMs / 60000) // Chuyển ms sang phút

    return durationMinutes
  }

  useEffect(() => {
    fetchCinemas()
    fetchMovies()
  }, [fetchCinemas, fetchMovies])

  // Hàm xử lý tìm kiếm phim
  const handleSearchMovies = async () => {
    if (!movieSearchQuery.trim()) return

    try {
      setIsSearching(true)
      const results = await MovieService.searchMovies(movieSearchQuery)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching movies:", error)
      toast({
        title: "Lỗi tìm kiếm",
        description: "Không thể tìm kiếm phim. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Hàm xử lý khi chọn phim từ kết quả tìm kiếm
  const handleSelectMovie = async (movie) => {
    try {
      // Kiểm tra xem phim đã tồn tại trong hệ thống chưa
      let existingMovie = movies.find((m) => m.tmdbId === movie.id)

      if (!existingMovie) {
        // Nếu phim chưa tồn tại, lưu vào cơ sở dữ liệu
        const movieToSave = {
          tmdbId: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path || null,
          backdrop_path: movie.backdrop_path || null,
          releaseDate: movie.release_date,
          genres: movie.genre_ids || [],
          runtime: movie.runtime || 120, // Giá trị mặc định nếu không có
        }

        existingMovie = await MovieService.saveMovie(movieToSave)

        // Cập nhật danh sách phim sau khi thêm mới
        setMovies((prevMovies) => [...prevMovies, existingMovie])
      }

      // Cập nhật form với phim đã chọn
      setShowtimeForm({
        ...showtimeForm,
        movieId: existingMovie.tmdbId,
      })

      // Lưu thông tin phim được chọn
      setSelectedMovie(existingMovie)

      // Đóng dialog tìm kiếm
      setMovieSearchDialog(false)

      toast({
        title: "Đã chọn phim",
        description: `Đã chọn phim "${existingMovie.title}"`,
      })
    } catch (error) {
      console.error("Error selecting movie:", error)
      toast({
        title: "Lỗi",
        description: "Không thể chọn phim. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesData = await MovieService.getAllMovies()
        setMovies(moviesData)
      } catch (error) {
        console.error("Error fetching movies:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách phim",
          variant: "destructive",
        })
      }
    }

    fetchMovies()
  }, [])

  // useEffect để tải thông tin phim khi thay đổi movieId trong form
  useEffect(() => {
    if (showtimeForm.movieId !== 0) {
      loadSelectedMovieDetails(showtimeForm.movieId)
    } else {
      setSelectedMovie(null)
    }
  }, [showtimeForm.movieId])

  // useEffect theo dõi thay đổi thời gian bắt đầu và kết thúc để tính thời lượng phim
  useEffect(() => {
    // Chỉ để cập nhật UI, không cần xử lý gì thêm
  }, [showtimeForm.startTime, showtimeForm.endTime])

  // Hàm tải dữ liệu phim dựa trên ID
  const loadSelectedMovieDetails = async (movieId) => {
    if (!movieId || movieId === 0) return

    try {
      const movie = movies.find((m) => m.tmdbId === movieId)

      if (movie) {
        setSelectedMovie(movie)
      } else {
        // Nếu không tìm thấy trong danh sách, gọi API để lấy thông tin
        const movieDetails = await MovieService.getMovieById(movieId)
        setSelectedMovie(movieDetails)
      }
    } catch (error) {
      console.error("Error loading movie details:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin phim. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const fetchRooms = async (cinemaId: string) => {
    try {
      const res = await getRoomsByCinemaId(cinemaId)
      if (res.rooms) {
        setRooms(Array.isArray(res.rooms) ? res.rooms : [])
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách phòng chiếu",
        variant: "destructive",
      })
    }
  }

  const fetchSeats = async (roomId: string) => {
    try {
      const res = await getSeatsByRoom(roomId)
      if (res.seats) {
        setSeats(Array.isArray(res.seats) ? res.seats : [])
      } else {
        setSeats([])
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách ghế ngồi",
        variant: "destructive",
      })
    }
  }

  const fetchShowtimes = async (roomId: string) => {
    try {
      const res = await getAllShowtimes()
      console.log("API Response:", res)
      const showtimes = Array.isArray(res.showtimes) ? res.showtimes : []
      const filteredShowtimes = showtimes.filter(
        (showtime: Showtime) => showtime.roomId._id === roomId
      )
      console.log("Filtered Showtimes:", filteredShowtimes)
      const enrichedShowtimes = await Promise.all(
        filteredShowtimes.map(async (showtime: Showtime) => {
          try {
            const movie = movies.find((m) => m.id === showtime.movieId)
            return { ...showtime, movie }
          } catch (error) {
            return showtime
          }
        })
      )
      setShowtimes(enrichedShowtimes)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách lịch chiếu",
        variant: "destructive",
      })
    }
  }

  const handleSelectCinema = (cinema: Cinema) => {
    setSelectedCinema(cinema)
    setSelectedRoom(null)
    setSelectedSeat(null)
    setSelectedShowtime(null)
    fetchRooms(cinema.id)
    setActiveTab("rooms")
  }

  const handleSelectRoom = (room: Room) => {
    setSelectedRoom(room)
    setSelectedSeat(null)
    setSelectedShowtime(null)
    fetchSeats(room._id)
    fetchShowtimes(room._id)
    setActiveTab("seats")
  }

  const handleAddCinema = async () => {
    try {
      await createCinema(cinemaForm)
      fetchCinemas()
      setCinemaDialog(false)
      setCinemaForm({ name: "", address: "" })
      toast({
        title: "Thành công",
        description: "Đã thêm rạp phim mới",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm rạp phim",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCinema = async () => {
    if (!selectedCinema) return
    try {
      await updateCinema(selectedCinema.id, cinemaForm)
      fetchCinemas()
      setCinemaDialog(false)
      toast({
        title: "Thành công",
        description: "Đã cập nhật rạp phim",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật rạp phim",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCinema = async (id: string) => {
    try {
      await deleteCinema(id)
      fetchCinemas()
      setSelectedCinema(null)
      toast({
        title: "Thành công",
        description: "Đã xóa rạp phim",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa rạp phim",
        variant: "destructive",
      })
    }
  }

  const handleAddRoom = async () => {
    try {
      if (selectedCinema) {
        const data = { ...roomForm, cinemaId: selectedCinema.id }
        await createRoom(data)
        fetchRooms(selectedCinema.id)
        setRoomDialog(false)
        setRoomForm({ cinemaId: "", roomNumber: "", capacity: 0 })
        toast({
          title: "Thành công",
          description: "Đã thêm phòng chiếu mới",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm phòng chiếu",
        variant: "destructive",
      })
    }
  }

  const handleUpdateRoom = async () => {
    if (!selectedRoom) return
    try {
      await updateRoom(selectedRoom._id, roomForm)
      if (selectedCinema) {
        fetchRooms(selectedCinema.id)
      }
      setRoomDialog(false)
      toast({
        title: "Thành công",
        description: "Đã cập nhật phòng chiếu",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật phòng chiếu",
        variant: "destructive",
      })
    }
  }

  const handleDeleteRoom = async (id: string) => {
    try {
      await deleteRoom(id)
      if (selectedCinema) {
        fetchRooms(selectedCinema.id)
      }
      setSelectedRoom(null)
      toast({
        title: "Thành công",
        description: "Đã xóa phòng chiếu",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa phòng chiếu",
        variant: "destructive",
      })
    }
  }

  const handleAddSeat = async () => {
    try {
      if (selectedRoom) {
        const data = { ...seatForm, roomId: selectedRoom._id }
        await createSeat(data)
        fetchSeats(selectedRoom._id)
        setSeatDialog(false)
        setSeatForm({
          roomId: "",
          seatNumber: "",
          row: "",
          column: 0,
          type: "standard",
        })
        toast({
          title: "Thành công",
          description: "Đã thêm ghế mới",
        })
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm ghế",
        variant: "destructive",
      })
    }
  }

  const handleUpdateSeat = async () => {
    if (!selectedSeat) return
    try {
      await updateSeat(selectedSeat._id, seatForm)
      if (selectedRoom) {
        fetchSeats(selectedRoom._id)
      }
      setSeatDialog(false)
      toast({
        title: "Thành công",
        description: "Đã cập nhật ghế",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật ghế",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSeat = async (id: string) => {
    try {
      await deleteSeat(id)
      if (selectedRoom) {
        fetchSeats(selectedRoom._id)
      }
      setSelectedSeat(null)
      toast({
        title: "Thành công",
        description: "Đã xóa ghế",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa ghế",
        variant: "destructive",
      })
    }
  }

  const handleAddShowtime = async () => {
    try {
      if (!selectedRoom) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn phòng chiếu",
          variant: "destructive",
        })
        return
      }

      const data = {
        movieId: showtimeForm.movieId,
        roomId: selectedRoom._id,
        startTime: showtimeForm.startTime,
        endTime: showtimeForm.endTime,
        price: showtimeForm.price,
      }

      // Validate required fields
      if (!data.movieId || data.movieId === 0) {
        console.log("chọn phim lmao")
        throw new Error("Vui lòng chọn phim hợp lệ")
      }
      if (!data.roomId) {
        throw new Error("Vui lòng chọn phòng chiếu")
      }
      if (!data.startTime) {
        throw new Error("Vui lòng nhập thời gian bắt đầu")
      }
      if (!data.endTime) {
        throw new Error("Vui lòng nhập thời gian kết thúc")
      }
      if (!data.price || data.price <= 0) {
        throw new Error("Vui lòng nhập giá vé hợp lệ")
      }

      console.log("Creating Showtime with Data:", data)

      await createShowtime(data)

      // Re-fetch showtimes
      await fetchShowtimes(selectedRoom._id)

      // Reset form and close dialog
      setShowtimeDialog(false)
      setShowtimeForm({
        movieId: 0,
        roomId: "",
        startTime: "",
        endTime: "",
        price: 0,
      })

      toast({
        title: "Thành công",
        description: "Đã thêm lịch chiếu mới",
      })
    } catch (error: any) {
      console.error("Error adding showtime:", error.message)
      toast({
        title: "Lỗi",
        description: error.message || "Không thể thêm lịch chiếu",
        variant: "destructive",
      })
    }
  }

  const handleDeleteShowtime = async (id: string) => {
    try {
      await deleteShowtime(id)
      if (selectedRoom) {
        fetchShowtimes(selectedRoom._id)
      }
      setSelectedShowtime(null)
      toast({
        title: "Thành công",
        description: "Đã xóa lịch chiếu",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể xóa lịch chiếu",
        variant: "destructive",
      })
    }
  }

  const openMovieSearchDialog = () => {
    // Reset query
    setMovieSearchQuery("")
    // Hiển thị tất cả phim có sẵn
    setSearchResults(movies)
    // Mở dialog
    setMovieSearchDialog(true)
  }

  const openEditCinemaDialog = (cinema: Cinema) => {
    setSelectedCinema(cinema)
    setCinemaForm({
      name: cinema.name,
      address: cinema.address,
    })
    setCinemaDialog(true)
  }

  const openEditRoomDialog = (room: Room) => {
    setSelectedRoom(room)
    setRoomForm({
      cinemaId: room.cinemaId,
      roomNumber: room.roomNumber,
      capacity: room.capacity,
    })
    setRoomDialog(true)
  }

  const openEditSeatDialog = (seat: Seat) => {
    setSelectedSeat(seat)
    setSeatForm({
      roomId: seat.roomId,
      seatNumber: seat.seatNumber,
      row: seat.row,
      column: seat.column,
      type: seat.type,
    })
    setSeatDialog(true)
  }

  const openEditShowtimeDialog = (showtime: Showtime) => {
    setSelectedShowtime(showtime)
    setShowtimeForm({
      movieId: showtime.movieId,
      roomId: showtime.roomId,
      startTime: new Date(showtime.startTime).toISOString().slice(0, 16),
      endTime: new Date(showtime.endTime).toISOString().slice(0, 16),
      price: showtime.price,
    })
    setShowtimeDialog(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  const getMovieTitle = (movieId: number) => {
    const movie = movies.find((m) => m.tmdbId === movieId)
    console.log("getMovieTitle:", {
      movieId,
      foundMovie: movie,
      title: movie?.title,
    })
    return movie ? movie.title : `Phim ID: ${movieId}`
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Quản Lý Rạp Phim</h1>

      <Tabs
        defaultValue="cinemas"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="cinemas">Rạp Phim</TabsTrigger>
          <TabsTrigger value="rooms" disabled={!selectedCinema}>
            Phòng Chiếu
          </TabsTrigger>
          <TabsTrigger value="seats" disabled={!selectedRoom}>
            Ghế Ngồi
          </TabsTrigger>
          <TabsTrigger value="showtimes" disabled={!selectedRoom}>
            Lịch Chiếu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cinemas">
          <CinemasTab
            cinemas={cinemas}
            selectedCinema={selectedCinema}
            fetchCinemas={fetchCinemas}
            handleSelectCinema={handleSelectCinema}
            openEditCinemaDialog={openEditCinemaDialog}
            handleDeleteCinema={handleDeleteCinema}
            setCinemaDialog={setCinemaDialog}
            setCinemaForm={setCinemaForm}
          />
        </TabsContent>

        <TabsContent value="rooms">
          <RoomsTab
            rooms={rooms}
            selectedCinema={selectedCinema}
            selectedRoom={selectedRoom}
            fetchRooms={fetchRooms}
            handleSelectRoom={handleSelectRoom}
            openEditRoomDialog={openEditRoomDialog}
            handleDeleteRoom={handleDeleteRoom}
            setRoomDialog={setRoomDialog}
            setRoomForm={setRoomForm}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="seats">
          <SeatsTab
            seats={seats}
            selectedRoom={selectedRoom}
            selectedSeat={selectedSeat}
            fetchSeats={fetchSeats}
            openEditSeatDialog={openEditSeatDialog}
            handleDeleteSeat={handleDeleteSeat}
            setSeatDialog={setSeatDialog}
            setSeatForm={setSeatForm}
            setActiveTab={setActiveTab}
          />
        </TabsContent>

        <TabsContent value="showtimes">
          <ShowtimesTab
            showtimes={showtimes}
            selectedRoom={selectedRoom}
            selectedShowtime={selectedShowtime}
            fetchShowtimes={fetchShowtimes}
            openEditShowtimeDialog={openEditShowtimeDialog}
            handleDeleteShowtime={handleDeleteShowtime}
            setShowtimeDialog={setShowtimeDialog}
            setShowtimeForm={setShowtimeForm}
            getMovieTitle={getMovieTitle}
            setActiveTab={setActiveTab}
          />
        </TabsContent>
      </Tabs>

      {/* Cinema Dialog */}
      <Dialog open={cinemaDialog} onOpenChange={setCinemaDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedCinema ? "Chỉnh Sửa Rạp Phim" : "Thêm Rạp Phim Mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết của rạp phim
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Tên Rạp
              </Label>
              <Input
                id="name"
                value={cinemaForm.name}
                onChange={(e) =>
                  setCinemaForm({ ...cinemaForm, name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Địa Chỉ
              </Label>
              <Input
                id="address"
                value={cinemaForm.address}
                onChange={(e) =>
                  setCinemaForm({ ...cinemaForm, address: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCinemaDialog(false)}>
              Hủy
            </Button>
            <Button
              onClick={selectedCinema ? handleUpdateCinema : handleAddCinema}
            >
              {selectedCinema ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Room Dialog */}
      <Dialog open={roomDialog} onOpenChange={setRoomDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedRoom ? "Chỉnh Sửa Phòng Chiếu" : "Thêm Phòng Chiếu Mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết của phòng chiếu
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="roomNumber" className="text-right">
                Số Phòng
              </Label>
              <Input
                id="roomNumber"
                value={roomForm.roomNumber}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, roomNumber: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Sức Chứa
              </Label>
              <Input
                id="capacity"
                type="number"
                value={roomForm.capacity}
                onChange={(e) =>
                  setRoomForm({
                    ...roomForm,
                    capacity: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoomDialog(false)}>
              Hủy
            </Button>
            <Button onClick={selectedRoom ? handleUpdateRoom : handleAddRoom}>
              {selectedRoom ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seat Dialog */}
      <Dialog open={seatDialog} onOpenChange={setSeatDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedSeat ? "Chỉnh Sửa Ghế" : "Thêm Ghế Mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết của ghế
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="seatNumber" className="text-right">
                Mã Ghế
              </Label>
              <Input
                id="seatNumber"
                value={seatForm.seatNumber}
                onChange={(e) =>
                  setSeatForm({ ...seatForm, seatNumber: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="row" className="text-right">
                Hàng
              </Label>
              <Input
                id="row"
                value={seatForm.row}
                onChange={(e) =>
                  setSeatForm({ ...seatForm, row: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="column" className="text-right">
                Cột
              </Label>
              <Input
                id="column"
                type="number"
                value={seatForm.column}
                onChange={(e) =>
                  setSeatForm({ ...seatForm, column: parseInt(e.target.value) })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Loại Ghế
              </Label>
              <Select
                defaultValue="standard"
                onValueChange={(value) =>
                  setSeatForm({ ...seatForm, type: value as "standard" })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn loại ghế" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Tiêu chuẩn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSeatDialog(false)}>
              Hủy
            </Button>
            <Button onClick={selectedSeat ? handleUpdateSeat : handleAddSeat}>
              {selectedSeat ? "Cập nhật" : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog Thêm Lịch Chiếu Cải Tiến */}
      <Dialog open={showtimeDialog} onOpenChange={setShowtimeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {selectedShowtime
                ? "Chỉnh Sửa Lịch Chiếu"
                : "Thêm Lịch Chiếu Mới"}
            </DialogTitle>
            <DialogDescription>
              Vui lòng nhập đầy đủ thông tin chi tiết cho lịch chiếu mới
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Phần thông tin phim */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">
                Thông tin phim
              </h3>

              {showtimeForm.movieId !== 0 && (
                <div className="bg-muted p-3 rounded-md mb-3 flex items-start gap-3">
                  {selectedMovie?.poster_path && (
                    <Image
                      src={`https://image.tmdb.org/t/p/w92${selectedMovie.poster_path}`}
                      alt={selectedMovie?.title}
                      className="h-20 w-auto rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-poster.png"
                      }}
                    />
                  )}
                  <div>
                    <h4 className="font-medium">{selectedMovie?.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      TMDB ID: {selectedMovie?.tmdbId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedMovie?.releaseDate?.split("-")[0] || "N/A"} •{" "}
                      {calculateDuration(
                        showtimeForm.startTime,
                        showtimeForm.endTime
                      ) || "N/A"}{" "}
                      phút
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        setShowtimeForm({ ...showtimeForm, movieId: 0 })
                      }}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Thay đổi phim
                    </Button>
                  </div>
                </div>
              )}

              {showtimeForm.movieId === 0 && (
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Select
                      onValueChange={(value) => {
                        const selectedMovie = movies.find(
                          (movie) => movie.tmdbId.toString() === value
                        )
                        console.log("Selected Movie:", {
                          tmdbId: selectedMovie?.tmdbId,
                          id: selectedMovie?.id,
                          _id: selectedMovie?._id,
                          title: selectedMovie?.title,
                        })
                        setShowtimeForm({
                          ...showtimeForm,
                          movieId: selectedMovie ? selectedMovie.tmdbId : 0,
                        })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn phim có sẵn" />
                      </SelectTrigger>
                      <SelectContent>
                        {movies.map((movie) => (
                          <SelectItem
                            key={movie.tmdbId}
                            value={movie.tmdbId.toString()}
                          >
                            {movie.title} (
                            {movie.releaseDate?.split("-")[0] || "N/A"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={() => setMovieSearchDialog(true)}>
                    <Search className="h-4 w-4 mr-1" />
                    Tìm phim mới
                  </Button>
                </div>
              )}
            </div>

            {/* Phần thông tin phòng chiếu */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">Phòng chiếu</h3>

              <div className="bg-muted p-3 rounded-md mb-3">
                <div>
                  <h4 className="font-medium">
                    {selectedRoom?.roomNumber || "Chưa chọn phòng"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoom
                      ? `Sức chứa: ${selectedRoom.capacity} ghế`
                      : "Vui lòng chọn phòng chiếu"}
                  </p>
                </div>
              </div>
            </div>

            {/* Phần thông tin lịch chiếu */}
            <div className="space-y-4">
              <h3 className="font-medium text-lg border-b pb-2">
                Thông tin suất chiếu
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">
                    Thời gian bắt đầu <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={showtimeForm.startTime}
                    onChange={(e) => {
                      const newStartTime = e.target.value
                      setShowtimeForm({
                        ...showtimeForm,
                        startTime: newStartTime,
                      })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">
                    Thời gian kết thúc <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={showtimeForm.endTime}
                    onChange={(e) => {
                      setShowtimeForm({
                        ...showtimeForm,
                        endTime: e.target.value,
                      })
                      // Dữ liệu thay đổi ở đây, nhưng không cần xử lý đặc biệt vì đã có hàm calculateDuration
                    }}
                  />
                  {showtimeForm.startTime &&
                    showtimeForm.endTime &&
                    new Date(showtimeForm.endTime) <=
                      new Date(showtimeForm.startTime) && (
                      <p className="text-red-500 text-sm mt-1">
                        Thời gian kết thúc phải sau thời gian bắt đầu
                      </p>
                    )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">
                    Giá vé (VND) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="10000"
                      value={showtimeForm.price}
                      onChange={(e) =>
                        setShowtimeForm({
                          ...showtimeForm,
                          price: parseInt(e.target.value),
                        })
                      }
                    />
                    <div className="absolute right-0 top-0 h-full flex items-center pr-3 pointer-events-none text-muted-foreground">
                      VND
                    </div>
                  </div>
                </div>

                {/* Hiển thị thời lượng phim tính từ thời gian bắt đầu và kết thúc */}
                <div className="space-y-2">
                  <Label>Thời lượng phim</Label>
                  <div className="h-10 flex items-center px-3 border rounded-md bg-muted/50">
                    {showtimeForm.startTime && showtimeForm.endTime
                      ? `${calculateDuration(
                          showtimeForm.startTime,
                          showtimeForm.endTime
                        )} phút`
                      : "Nhập thời gian bắt đầu và kết thúc"}
                  </div>
                </div>
              </div>
            </div>

            {/* Phần xác nhận thông tin */}
            {isFormComplete() && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-800">
                <h3 className="font-medium text-green-800 dark:text-green-300 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" /> Thông tin lịch chiếu
                </h3>
                <div className="mt-2 text-sm space-y-1 text-green-700 dark:text-green-400">
                  <p>
                    Phim:{" "}
                    <span className="font-medium">{selectedMovie?.title}</span>
                  </p>
                  <p>
                    Phòng:{" "}
                    <span className="font-medium">
                      {selectedRoom?.roomNumber}
                    </span>
                  </p>
                  <p>
                    Giờ chiếu:{" "}
                    <span className="font-medium">
                      {formatDateTime(showtimeForm.startTime)} -{" "}
                      {formatDateTime(showtimeForm.endTime)}
                    </span>
                  </p>
                  <p>
                    Giá vé:{" "}
                    <span className="font-medium">
                      {formatCurrency(showtimeForm.price)} VND
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 mt-2">
            <Button variant="outline" onClick={() => setShowtimeDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddShowtime} disabled={!isFormValid()}>
              {selectedShowtime ? "Lưu thay đổi" : "Thêm lịch chiếu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movie Search Dialog - giữ nguyên nhưng thêm chức năng hiển thị ảnh poster */}
      <Dialog open={movieSearchDialog} onOpenChange={setMovieSearchDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Tìm Kiếm Phim</DialogTitle>
            <DialogDescription>
              Tìm kiếm và chọn phim cho lịch chiếu
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nhập tên phim..."
                value={movieSearchQuery}
                onChange={(e) => setMovieSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchMovies()
                  }
                }}
              />
              <Button onClick={handleSearchMovies} disabled={isSearching}>
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tìm...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Tìm kiếm
                  </>
                )}
              </Button>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {searchResults.map((movie) => (
                    <div
                      key={movie.id}
                      className="border rounded-md overflow-hidden hover:border-primary transition-colors cursor-pointer"
                      onClick={() => handleSelectMovie(movie)}
                    >
                      <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                        {movie.poster_path ? (
                          <Image
                            src={`https://image.tmdb.org/t/p/w185${movie.poster_path}`}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder-poster.png"
                            }}
                          />
                        ) : (
                          <Film className="h-12 w-12 text-muted-foreground" />
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium line-clamp-1">
                          {movie.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {(movie.releaseDate || movie.release_date)?.split(
                            "-"
                          )[0] || "N/A"}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleSelectMovie(movie)}
                        >
                          Chọn phim này
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  {isSearching ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="h-8 w-8 animate-spin mb-2" />
                      <p>Đang tìm kiếm phim...</p>
                    </div>
                  ) : movieSearchQuery ? (
                    <div className="flex flex-col items-center">
                      {/* <FilmOff className="h-8 w-8 mb-2" /> */}
                      <p>Không tìm thấy phim phù hợp</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 mb-2" />
                      <p>Nhập tên phim để bắt đầu tìm kiếm</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMovieSearchDialog(false)}
            >
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
