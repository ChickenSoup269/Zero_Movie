/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RefreshCcw, Calendar, Edit, Trash2 } from "lucide-react"

interface Showtime {
  id: string
  movieId: number
  roomId: string
  startTime: string
  endTime: string
  price: number
  movie?: any
}

interface Room {
  _id: string
  roomId: string
  cinemaId: string
  roomNumber: string
  capacity: number
  createdAt?: string
  updatedAt?: string
}

interface ShowtimesTabProps {
  showtimes: Showtime[]
  selectedRoom: Room | null
  selectedShowtime: Showtime | null
  fetchShowtimes: (roomId: string) => Promise<void>
  openEditShowtimeDialog: (showtime: Showtime) => void
  handleDeleteShowtime: (id: string) => Promise<void>
  setShowtimeDialog: (open: boolean) => void
  setShowtimeForm: (form: {
    movieId: number
    roomId: string
    startTime: string
    endTime: string
    price: number
  }) => void
  getMovieTitle: (movieId: number) => string
  setActiveTab: (tab: string) => void
}

export default function ShowtimesTab({
  showtimes,
  selectedRoom,
  selectedShowtime,
  fetchShowtimes,
  openEditShowtimeDialog,
  handleDeleteShowtime,
  setShowtimeDialog,
  setShowtimeForm,
  getMovieTitle,
  setActiveTab,
}: ShowtimesTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Lịch Chiếu - Phòng {selectedRoom?.roomNumber}</span>
          <div className="flex gap-2">
            <Button
              onClick={() => {
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
              onClick={() => selectedRoom && fetchShowtimes(selectedRoom._id)}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => setActiveTab("rooms")}>
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
                key={showtime.id}
                className={
                  selectedShowtime?.id === showtime.id ? "bg-muted" : ""
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
                      onClick={() => handleDeleteShowtime(showtime.id)}
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
  )
}
