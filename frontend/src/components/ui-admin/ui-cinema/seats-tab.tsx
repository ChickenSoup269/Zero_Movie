import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCcw, Plus, ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Seat {
  _id: string
  roomId: string
  seatNumber: string
  row: string
  column: number
  type: "standard" | "vip" | "couple"
  status?: "available" | "selected" | "booked"
  createdAt?: string
  updatedAt?: string
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

interface SeatsMapProps {
  seats: Seat[]
  selectedRoom: Room | null
  selectedSeat: Seat | null
  fetchSeats: (roomId: string) => Promise<void>
  openEditSeatDialog: (seat: Seat) => void
  handleDeleteSeat: (id: string) => Promise<void>
  setSeatDialog: (open: boolean) => void
  setSeatForm: (form: {
    roomId: string
    seatNumber: string
    row: string
    column: number
  }) => void
  setActiveTab: (tab: string) => void
}

export default function SeatsMap({
  seats,
  selectedRoom,
  selectedSeat,
  fetchSeats,
  openEditSeatDialog,
  handleDeleteSeat,
  setSeatDialog,
  setSeatForm,
  setActiveTab,
}: SeatsMapProps) {
  const [hoveredSeat, setHoveredSeat] = useState<Seat | null>(null)

  // Xác định tất cả các hàng và số ghế tối đa mỗi hàng
  const rows = Array.from(new Set(seats.map((seat) => seat.row))).sort()
  const maxColumn = Math.max(...seats.map((seat) => seat.column), 0)

  // Tạo một bản đồ ghế dựa trên hàng và cột
  const seatMap = {}
  seats.forEach((seat) => {
    if (!seatMap[seat.row]) {
      seatMap[seat.row] = {}
    }
    seatMap[seat.row][seat.column] = seat
  })

  const handleAddSeat = () => {
    setSeatForm({
      roomId: selectedRoom?._id || "",
      seatNumber: "",
      row: "",
      column: 0,
    })
    setSeatDialog(true)
  }

  const renderSeatTypeIndicator = () => {
    return (
      <div className="flex justify-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-slate-200 rounded"></div>
          <span className="text-sm">Tiêu chuẩn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-400 rounded"></div>
          <span className="text-sm">Đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-black rounded"></div>
          <span className="text-sm">Đã chọn</span>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Sơ đồ ghế - Phòng {selectedRoom?.roomNumber}</span>
          <div className="flex gap-2">
            <Button onClick={handleAddSeat}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm Ghế
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedRoom && fetchSeats(selectedRoom._id)}
            >
              <RefreshCcw className="h-4 w-4" />
            </Button>
            <Button variant="secondary" onClick={() => setActiveTab("rooms")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Quay lại
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          Quản lý thông tin các ghế trong phòng: {selectedRoom?.roomNumber}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {seats.length === 0 ? (
          <div className="text-center py-8">Không có dữ liệu ghế ngồi</div>
        ) : (
          <div className="flex flex-col items-center">
            {renderSeatTypeIndicator()}

            {/* Màn hình */}
            <div className="w-full max-w-4xl mb-12 relative">
              <div className="h-8 bg-gray-300 rounded-lg w-full mb-2 flex items-center justify-center text-gray-600">
                Màn hình
              </div>
              <div className="absolute -bottom-6 left-0 right-0 text-center text-gray-400 text-sm">
                (Phía trước)
              </div>
            </div>

            {/* Sơ đồ ghế */}
            <div className="mt-4 relative">
              {hoveredSeat && (
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-3 py-1 rounded text-sm">
                  Ghế: {hoveredSeat.seatNumber} - Hàng: {hoveredSeat.row} - Cột:{" "}
                  {hoveredSeat.column}
                </div>
              )}

              {rows.map((row) => (
                <div key={row} className="flex items-center mb-2 gap-2">
                  <div className="w-8 font-semibold text-center">{row}</div>
                  <div className="flex gap-2 flex-wrap justify-center">
                    {Array.from({ length: maxColumn }).map((_, colIndex) => {
                      const columnNum = colIndex + 1
                      const seat = seatMap[row]?.[columnNum]

                      return (
                        <div
                          key={`${row}-${columnNum}`}
                          className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer ${
                            !seat
                              ? "bg-transparent"
                              : selectedSeat?._id === seat._id
                              ? "bg-black text-white"
                              : "bg-slate-200 hover:bg-blue-400 hover:text-white"
                          }`}
                          onClick={() => seat && openEditSeatDialog(seat)}
                          onMouseEnter={() => seat && setHoveredSeat(seat)}
                          onMouseLeave={() => setHoveredSeat(null)}
                        >
                          {seat ? columnNum : ""}
                        </div>
                      )
                    })}
                  </div>
                  <div className="w-8 font-semibold text-center">{row}</div>
                </div>
              ))}
            </div>

            {/* Thông tin chi tiết ghế được chọn */}
            {selectedSeat && (
              <div className="mt-8 p-4 border rounded w-full max-w-md">
                <h3 className="font-medium mb-2">Thông tin ghế đang chọn:</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>Mã ghế:</div>
                  <div className="font-medium">{selectedSeat.seatNumber}</div>
                  <div>Hàng:</div>
                  <div className="font-medium">{selectedSeat.row}</div>
                  <div>Cột:</div>
                  <div className="font-medium">{selectedSeat.column}</div>
                  <div>Loại:</div>
                  <div className="font-medium">
                    {selectedSeat.type === "standard"
                      ? "Tiêu chuẩn"
                      : selectedSeat.type}
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditSeatDialog(selectedSeat)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSeat(selectedSeat._id)}
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
