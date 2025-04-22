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
import { RefreshCcw, Plus, Edit, Trash2 } from "lucide-react"

interface Room {
  _id: string
  roomId: string
  cinemaId: string
  roomNumber: string
  capacity: number
  createdAt?: string
  updatedAt?: string
}

interface Cinema {
  id: string
  name: string
  address: string
  createdAt: string
  updatedAt?: string
}

interface RoomsTabProps {
  rooms: Room[]
  selectedCinema: Cinema | null
  selectedRoom: Room | null
  fetchRooms: (cinemaId: string) => Promise<void>
  handleSelectRoom: (room: Room) => void
  openEditRoomDialog: (room: Room) => void
  handleDeleteRoom: (id: string) => Promise<void>
  setRoomDialog: (open: boolean) => void
  setRoomForm: (form: {
    cinemaId: string
    roomNumber: string
    capacity: number
  }) => void
  setActiveTab: (tab: string) => void
}

export default function RoomsTab({
  rooms,
  selectedCinema,
  selectedRoom,
  fetchRooms,
  handleSelectRoom,
  openEditRoomDialog,
  handleDeleteRoom,
  setRoomDialog,
  setRoomForm,
  setActiveTab,
}: RoomsTabProps) {
  const formatDate = (dateString?: string) => {
    return dateString ? new Date(dateString).toLocaleString("vi-VN") : "N/A"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Danh Sách Phòng Chiếu - {selectedCinema?.name}</span>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                setRoomForm({ cinemaId: "", roomNumber: "", capacity: 0 })
                setRoomDialog(true)
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm Phòng
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedCinema && fetchRooms(selectedCinema.id)}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => setActiveTab("cinemas")}>
              Quay lại
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Quản lý thông tin các phòng chiếu của rạp: {selectedCinema?.name}
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
                className={selectedRoom?._id === room._id ? "bg-muted" : ""}
              >
                <TableCell className="font-medium">{room.roomNumber}</TableCell>
                <TableCell>{room.capacity} ghế</TableCell>
                <TableCell>{formatDate(room.createdAt)}</TableCell>
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
  )
}
