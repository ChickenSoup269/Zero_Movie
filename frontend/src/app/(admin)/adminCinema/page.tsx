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
import { Search } from "lucide-react"

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
import { MovieService, Movie } from "@/services/movieService"

// Import tab components
import CinemasTab from "@/components/ui-admin/ui-cinema/cinemas-tab"
import RoomsTab from "@/components/ui-admin/ui-cinema/rooms-tab"
import SeatsTab from "@/components/ui-admin/ui-cinema/seats-tab"
import ShowtimesTab from "@/components/ui-admin/ui-cinema/showtimes-tab"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

  useEffect(() => {
    fetchCinemas()
    fetchMovies()
  }, [fetchCinemas, fetchMovies])

  const handleSearchMovies = async () => {
    setIsSearching(true)
    try {
      // Nếu query rỗng, lấy tất cả phim
      if (!movieSearchQuery.trim()) {
        setSearchResults(movies)
      } else {
        // Kiểm tra xem query có phải là ID (số) không
        const isNumeric = /^\d+$/.test(movieSearchQuery.trim())

        // Nếu là số, tìm theo ID
        if (isNumeric) {
          const movieId = parseInt(movieSearchQuery.trim())
          const movie = movies.find(
            (m) => m.id === movieId || m.tmdbId === movieId
          )
          setSearchResults(movie ? [movie] : [])
        } else {
          // Ngược lại tìm theo tên
          console.log("Searching for:", movieSearchQuery)
          const results = await MovieService.searchMovies(movieSearchQuery)
          console.log("Search results:", results)
          setSearchResults(results)
        }
      }
    } catch (error) {
      console.error("Error searching movies:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tìm kiếm phim",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Function to handle movie selection
  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie)
    // Sửa từ setFormData thành setShowtimeForm
    setShowtimeForm((prev) => ({
      ...prev,
      movieId: movie.id,
    }))
    setMovieSearchDialog(false)
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
    const movie = movies.find((m) => m.id === movieId)
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

      {/* Showtime Dialog */}
      <Dialog open={showtimeDialog} onOpenChange={setShowtimeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedShowtime
                ? "Chỉnh Sửa Lịch Chiếu"
                : "Thêm Lịch Chiếu Mới"}
            </DialogTitle>
            <DialogDescription>
              Nhập thông tin chi tiết của lịch chiếu
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="movie" className="text-right">
                Phim
              </Label>
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
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn phim" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem
                      key={movie.tmdbId}
                      value={movie.tmdbId.toString()}
                    >
                      {movie.title} (TMDB ID: {movie.tmdbId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startTime" className="text-right">
                Thời Gian Bắt Đầu
              </Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={showtimeForm.startTime}
                onChange={(e) =>
                  setShowtimeForm({
                    ...showtimeForm,
                    startTime: e.target.value,
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endTime" className="text-right">
                Thời Gian Kết Thúc
              </Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={showtimeForm.endTime}
                onChange={(e) =>
                  setShowtimeForm({ ...showtimeForm, endTime: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Giá Vé
              </Label>
              <Input
                id="price"
                type="number"
                value={showtimeForm.price}
                onChange={(e) =>
                  setShowtimeForm({
                    ...showtimeForm,
                    price: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowtimeDialog(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddShowtime}>Thêm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movie Search Dialog */}
      <Dialog open={movieSearchDialog} onOpenChange={setMovieSearchDialog}>
        <DialogContent>
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
              />
              <Button onClick={handleSearchMovies} disabled={isSearching}>
                {isSearching ? "Đang tìm..." : "Tìm kiếm"}
              </Button>
            </div>
            <div className="max-h-64 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Phim</TableHead>
                    <TableHead>Năm</TableHead>
                    <TableHead>Tác Vụ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchResults.map((movie) => (
                    <TableRow key={movie.id}>
                      <TableCell>{movie.title}</TableCell>
                      <TableCell>
                        {(movie.releaseDate || movie.release_date)?.split(
                          "-"
                        )[0] || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSelectMovie(movie)}
                        >
                          Chọn
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {searchResults.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8">
                        Không tìm thấy phim
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
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
