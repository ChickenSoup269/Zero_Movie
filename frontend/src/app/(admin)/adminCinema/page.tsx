/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Label } from "@/components/ui/label"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/toaster"
import { RefreshCcw, Plus, Edit, Trash2, Calendar, Search } from "lucide-react"

// Import services
import {
  getAllCinemas,
  getCinemaById,
  createCinema,
  updateCinema,
  deleteCinema,
} from "@/services/cinemaService"

import {
  getAllRooms,
  getRoomsByCinemaId,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/services/roomService"

import {
  getSeatsByRoom,
  createSeat,
  updateSeat,
  deleteSeat,
} from "@/services/seatService"

import {
  getAllShowtimes,
  getShowtimesByMovie,
  getShowtimesByRoom,
  createShowtime,
  updateShowtime,
  deleteShowtime,
} from "@/services/showtimeService"

import { MovieService, Movie } from "@/services/movieService"

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
  createdAt?: string
  updatedAt?: string
  movie?: Movie
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
  })
  const [showtimeForm, setShowtimeForm] = useState({
    movieId: 0,
    roomId: "",
    startTime: "",
    endTime: "",
    price: 0,
  })
  const [cinemaDialog, setCinemaDialog] = useState(false)
  const [roomDialog, setRoomDialog] = useState(false)
  const [seatDialog, setSeatDialog] = useState(false)
  const [showtimeDialog, setShowtimeDialog] = useState(false)
  const [movieSearchDialog, setMovieSearchDialog] = useState(false)
  const [movieSearchQuery, setMovieSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Movie[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchCinemas()
    fetchMovies()
  }, [])

  const fetchMovies = async () => {
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
  }

  const handleSearchMovies = async () => {
    if (!movieSearchQuery.trim()) return
    setIsSearching(true)
    try {
      const results = await MovieService.searchMovies(movieSearchQuery)
      setSearchResults(results)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tìm kiếm phim",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleSelectMovie = (movie: Movie) => {
    setShowtimeForm({ ...showtimeForm, movieId: movie.id })
    setMovieSearchDialog(false)
  }

  const fetchCinemas = async () => {
    try {
      const res = await getAllCinemas()
      if (res.cinemas) {
        setCinemas(res.cinemas)
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách rạp phim",
        variant: "destructive",
      })
    }
  }

  const fetchRooms = async (cinemaId: string) => {
    try {
      const res = await getRoomsByCinemaId(cinemaId)
      if (res.data) {
        setRooms(res.data)
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
      if (res.data) {
        setSeats(res.data)
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
      const res = await getShowtimesByRoom(roomId)
      if (res.data) {
        const enrichedShowtimes = await Promise.all(
          res.data.map(async (showtime: Showtime) => {
            try {
              const movie = movies.find((m) => m.id === showtime.movieId)
              return { ...showtime, movie }
            } catch (error) {
              return showtime
            }
          })
        )
        setShowtimes(enrichedShowtimes)
      }
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
        setSeatForm({ roomId: "", seatNumber: "", row: "", column: 0 })
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
      if (selectedRoom) {
        const data = { ...showtimeForm, roomId: selectedRoom._id }
        await createShowtime(data)
        fetchShowtimes(selectedRoom._id)
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
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể thêm lịch chiếu",
        variant: "destructive",
      })
    }
  }

  const handleUpdateShowtime = async () => {
    if (!selectedShowtime) return
    try {
      await updateShowtime(selectedShowtime._id, showtimeForm)
      if (selectedRoom) {
        fetchShowtimes(selectedRoom._id)
      }
      setShowtimeDialog(false)
      toast({
        title: "Thành công",
        description: "Đã cập nhật lịch chiếu",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật lịch chiếu",
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
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Danh Sách Rạp Phim</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedCinema(null)
                      setCinemaForm({ name: "", address: "" })
                      setCinemaDialog(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Rạp Phim
                  </Button>
                  <Button variant="outline" onClick={fetchCinemas}>
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Quản lý thông tin các rạp phim của hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Rạp</TableHead>
                    <TableHead>Địa Chỉ</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead className="text-right">Tác Vụ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {cinemas.map((cinema) => (
                    <TableRow
                      key={cinema.id}
                      className={
                        selectedCinema?.id === cinema.id ? "bg-muted" : ""
                      }
                    >
                      <TableCell className="font-medium">
                        {cinema.name}
                      </TableCell>
                      <TableCell>{cinema.address}</TableCell>
                      <TableCell>{formatDate(cinema.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectCinema(cinema)}
                          >
                            Chọn
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditCinemaDialog(cinema)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCinema(cinema.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {cinemas.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Không có dữ liệu rạp phim
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Danh Sách Phòng Chiếu - {selectedCinema?.name}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedRoom(null)
                      setRoomForm({ cinemaId: "", roomNumber: "", capacity: 0 })
                      setRoomDialog(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Phòng
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      selectedCinema && fetchRooms(selectedCinema.id)
                    }
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab("cinemas")}
                  >
                    Quay lại
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Quản lý thông tin các phòng chiếu của rạp:{" "}
                {selectedCinema?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phòng Số</TableHead>
                    <TableHead>Sức Chứa</TableHead>
                    <TableHead>Ngày Tạo</TableHead>
                    <TableHead className="text-right">Tác Vụ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((room) => (
                    <TableRow
                      key={room._id}
                      className={
                        selectedRoom?._id === room._id ? "bg-muted" : ""
                      }
                    >
                      <TableCell className="font-medium">
                        {room.roomNumber}
                      </TableCell>
                      <TableCell>{room.capacity} ghế</TableCell>
                      <TableCell>
                        {room.createdAt ? formatDate(room.createdAt) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSelectRoom(room)}
                          >
                            Chọn
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditRoomDialog(room)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRoom(room._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {rooms.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        Không có dữ liệu phòng chiếu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seats">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Danh Sách Ghế - Phòng {selectedRoom?.roomNumber}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedSeat(null)
                      setSeatForm({
                        roomId: "",
                        seatNumber: "",
                        row: "",
                        column: 0,
                      })
                      setSeatDialog(true)
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm Ghế
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => selectedRoom && fetchSeats(selectedRoom._id)}
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab("rooms")}
                  >
                    Quay lại
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Quản lý thông tin các ghế trong phòng:{" "}
                {selectedRoom?.roomNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã Ghế</TableHead>
                    <TableHead>Hàng</TableHead>
                    <TableHead>Cột</TableHead>
                    <TableHead>Loại Ghế</TableHead>
                    <TableHead className="text-right">Tác Vụ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {seats.map((seat) => (
                    <TableRow
                      key={seat._id}
                      className={
                        selectedSeat?._id === seat._id ? "bg-muted" : ""
                      }
                    >
                      <TableCell className="font-medium">
                        {seat.seatNumber}
                      </TableCell>
                      <TableCell>{seat.row}</TableCell>
                      <TableCell>{seat.column}</TableCell>
                      <TableCell>
                        {seat.type === "standard" ? "Tiêu chuẩn" : seat.type}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditSeatDialog(seat)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteSeat(seat._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {seats.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Không có dữ liệu ghế ngồi
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="showtimes">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Lịch Chiếu - Phòng {selectedRoom?.roomNumber}</span>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setSelectedShowtime(null)
                      setShowtimeForm({
                        movieId: 0,
                        roomId: "",
                        startTime: "",
                        endTime: "",
                        price: 0,
                      })
                      setShowtimeDialog(true)
                    }}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Thêm Lịch Chiếu
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      selectedRoom && fetchShowtimes(selectedRoom._id)
                    }
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setActiveTab("rooms")}
                  >
                    Quay lại
                  </Button>
                </div>
              </CardTitle>
              <CardDescription>
                Quản lý lịch chiếu phim trong phòng: {selectedRoom?.roomNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Phim</TableHead>
                    <TableHead>Bắt Đầu</TableHead>
                    <TableHead>Kết Thúc</TableHead>
                    <TableHead>Giá Vé</TableHead>
                    <TableHead className="text-right">Tác Vụ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {showtimes.map((showtime) => (
                    <TableRow
                      key={showtime._id}
                      className={
                        selectedShowtime?._id === showtime._id ? "bg-muted" : ""
                      }
                    >
                      <TableCell className="font-medium">
                        {getMovieTitle(showtime.movieId)}
                      </TableCell>
                      <TableCell>{formatDate(showtime.startTime)}</TableCell>
                      <TableCell>{formatDate(showtime.endTime)}</TableCell>
                      <TableCell>
                        {showtime.price.toLocaleString("vi-VN")} VNĐ
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditShowtimeDialog(showtime)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteShowtime(showtime._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {showtimes.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Không có dữ liệu lịch chiếu
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
              Nh-entry thông tin chi tiết của phòng chiếu
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
              <Label htmlFor="movieId" className="text-right">
                Phim
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="movieId"
                  value={getMovieTitle(showtimeForm.movieId)}
                  disabled
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setMovieSearchDialog(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
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
            <Button
              onClick={
                selectedShowtime ? handleUpdateShowtime : handleAddShowtime
              }
            >
              {selectedShowtime ? "Cập nhật" : "Thêm"}
            </Button>
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
                      <TableCell>{movie.release_date?.split("-")[0]}</TableCell>
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
