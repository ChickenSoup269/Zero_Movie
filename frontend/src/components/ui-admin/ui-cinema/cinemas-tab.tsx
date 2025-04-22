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

interface Cinema {
  id: string
  name: string
  address: string
  createdAt: string
  updatedAt?: string
}

interface CinemasTabProps {
  cinemas: Cinema[]
  selectedCinema: Cinema | null
  fetchCinemas: () => Promise<void>
  handleSelectCinema: (cinema: Cinema) => void
  openEditCinemaDialog: (cinema: Cinema) => void
  handleDeleteCinema: (id: string) => Promise<void>
  setCinemaDialog: (open: boolean) => void
  setCinemaForm: (form: { name: string; address: string }) => void
}

export default function CinemasTab({
  cinemas,
  selectedCinema,
  fetchCinemas,
  handleSelectCinema,
  openEditCinemaDialog,
  handleDeleteCinema,
  setCinemaDialog,
  setCinemaForm,
}: CinemasTabProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Danh Sách Rạp Phim</span>
          <div className="flex gap-2">
            <Button
              onClick={() => {
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
                className={selectedCinema?.id === cinema.id ? "bg-muted" : ""}
              >
                <TableCell className="font-medium">{cinema.name}</TableCell>
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
  )
}
