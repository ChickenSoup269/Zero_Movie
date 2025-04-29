"use client"
import { useState, useEffect } from "react"
import { getAllCinemas, getShowtimesByCinemaId } from "@/services/cinemaService"
import { Clock, MapPin, Film, CalendarDays } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Define interfaces for type safety
interface Cinema {
  id: string
  name: string
  address: string
}

interface Showtime {
  id: string
  movieId: string
  movieTitle: string
  startTime: string
  endTime: string
  roomNumber: string
  price: number
}

interface MovieShowtime {
  movieId: string
  movieTitle: string
  times: {
    id: string
    startTime: string
    endTime: string
    roomNumber: string
    price: number
  }[]
}

interface DateOption {
  value: string
  label: string
}

const CinemaPage = () => {
  // Define proper types for all state variables
  const [cinemas, setCinemas] = useState<Cinema[]>([])
  const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(null)
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(
    formatDateForAPI(new Date())
  )

  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true)
        const response = await getAllCinemas()
        setCinemas(response.cinemas || [])

        if (response.cinemas && response.cinemas.length > 0) {
          setSelectedCinema(response.cinemas[0])
        }

        setLoading(false)
      } catch (err) {
        setError("Failed to load cinemas")
        setLoading(false)
      }
    }

    fetchCinemas()
  }, [])

  useEffect(() => {
    const fetchShowtimes = async () => {
      if (!selectedCinema) return

      try {
        setLoading(true)
        const response = await getShowtimesByCinemaId(
          selectedCinema.id,
          selectedDate
        )
        setShowtimes(response.showtimes || [])
        setLoading(false)
      } catch (err) {
        setError("Failed to load showtimes")
        setLoading(false)
      }
    }

    fetchShowtimes()
  }, [selectedCinema, selectedDate])

  const handleSelectCinema = (cinemaId: string) => {
    const cinema = cinemas.find((c) => c.id === cinemaId)
    setSelectedCinema(cinema || null)
  }

  const generateGoogleMapsUrl = (address: string) => {
    if (!address) return ""
    const query = encodeURIComponent(address)
    return `https://www.google.com/maps/search/?api=1&query=${query}`
  }

  // Format date helpers (replacing date-fns functionality)
  function formatDateForAPI(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  function formatTimeFromISO(isoString: string): string {
    const date = new Date(isoString)
    const hours = String(date.getHours()).padStart(2, "0")
    const minutes = String(date.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes}`
  }

  function formatDateForDisplay(date: Date): string {
    const day = String(date.getDate()).padStart(2, "0")
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  }

  const generateDateOptions = (): DateOption[] => {
    const options: DateOption[] = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() + i)
      const value = formatDateForAPI(date)
      const label = i === 0 ? "Hôm nay" : formatDateForDisplay(date)

      options.push({ value, label })
    }

    return options
  }

  const groupShowtimesByMovie = (): MovieShowtime[] => {
    const groupedShowtimes: Record<string, MovieShowtime> = {}

    showtimes.forEach((showtime) => {
      if (!groupedShowtimes[showtime.movieId]) {
        groupedShowtimes[showtime.movieId] = {
          movieId: showtime.movieId,
          movieTitle: showtime.movieTitle,
          times: [],
        }
      }

      groupedShowtimes[showtime.movieId].times.push({
        id: showtime.id,
        startTime: showtime.startTime,
        endTime: showtime.endTime,
        roomNumber: showtime.roomNumber,
        price: showtime.price,
      })
    })

    return Object.values(groupedShowtimes)
  }

  const dateOptions = generateDateOptions()
  const movieShowtimes = groupShowtimesByMovie()

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-lg mx-auto mt-8">
        <AlertTitle>Lỗi</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Rạp Chiếu Phim</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Chọn Rạp</CardTitle>
              <CardDescription>
                Chọn rạp chiếu phim bạn muốn xem
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading && !cinemas.length ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {cinemas.map((cinema) => (
                    <div
                      key={cinema.id}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedCinema?.id === cinema.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary hover:bg-primary/10"
                      }`}
                      onClick={() => handleSelectCinema(cinema.id)}
                    >
                      <h3 className="font-medium">{cinema.name}</h3>
                      <div className="flex items-center text-sm mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{cinema.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          {selectedCinema && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedCinema.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedCinema.address}
                    </CardDescription>
                  </div>
                  <a
                    href={generateGoogleMapsUrl(selectedCinema.address)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      Xem trên Google Maps
                    </Button>
                  </a>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2 flex items-center">
                    <CalendarDays className="w-5 h-5 mr-2" />
                    Chọn ngày xem phim
                  </h3>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger className="w-full md:w-72">
                      <SelectValue placeholder="Chọn ngày" />
                    </SelectTrigger>
                    <SelectContent>
                      {dateOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {loading ? (
                  <div className="space-y-6">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                ) : movieShowtimes.length > 0 ? (
                  <div className="space-y-6">
                    {movieShowtimes.map((movie) => (
                      <div
                        key={movie.movieId}
                        className="border rounded-lg p-4"
                      >
                        <div className="flex items-center mb-3">
                          <Film className="w-5 h-5 mr-2" />
                          <h3 className="text-lg font-medium">
                            {movie.movieTitle}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                          {movie.times.map((time) => (
                            <Sheet key={time.id}>
                              <SheetTrigger asChild>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                >
                                  <Clock className="w-4 h-4 mr-2" />
                                  {formatTimeFromISO(time.startTime)}
                                </Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>{movie.movieTitle}</SheetTitle>
                                  <SheetDescription>
                                    Chi tiết suất chiếu
                                  </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 space-y-4">
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">
                                      Thời gian:
                                    </h4>
                                    <div className="flex space-x-2">
                                      <Badge>
                                        {formatTimeFromISO(time.startTime)}
                                      </Badge>
                                      <span>-</span>
                                      <Badge variant="outline">
                                        {formatTimeFromISO(time.endTime)}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium mb-1">
                                      Phòng chiếu:
                                    </h4>
                                    <Badge variant="secondary">
                                      Phòng {time.roomNumber}
                                    </Badge>
                                  </div>
                                  {time.price && (
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">
                                        Giá vé:
                                      </h4>
                                      <p>
                                        {time.price.toLocaleString("vi-VN")} VNĐ
                                      </p>
                                    </div>
                                  )}
                                  <Button className="w-full mt-4">
                                    Đặt vé
                                  </Button>
                                </div>
                              </SheetContent>
                            </Sheet>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertTitle>Không có suất chiếu</AlertTitle>
                    <AlertDescription>
                      Không có suất chiếu nào cho ngày đã chọn tại rạp này.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default CinemaPage
