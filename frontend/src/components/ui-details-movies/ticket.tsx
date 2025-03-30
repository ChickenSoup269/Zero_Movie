import { format } from "date-fns"
import { QRCodeSVG } from "qrcode.react"

interface Theater {
  id: number
  name: string
  address: string
}

interface MovieInfo {
  type: string
  movieTitle: string
  director: string
}

interface TicketProps {
  theater: Theater
  movieInfo: MovieInfo
  selectedSeats: string[]
  selectedTime: string
  selectedDate: Date | undefined
  ticketId: string
  selectedRoom: string
  selectedType: string
}

const Ticket = ({
  theater,
  movieInfo,
  selectedSeats,
  selectedTime,
  selectedDate,
  ticketId,
  selectedRoom,
  selectedType,
}: TicketProps) => {
  const qrCodeContent = JSON.stringify({
    cinema: theater.name,
    movie: movieInfo.movieTitle,
    director: movieInfo.director,
    name: "Thien dep trai",
    seats: selectedSeats.join(", ") || "None",
    time: selectedTime,
    ticketId: ticketId || "None",
    date: selectedDate ? format(selectedDate, "dd/MM/yyyy") : "12/07/2022",
    room: selectedRoom,
    type: selectedType,
  })

  return (
    <div className="bg-white text-black flex overflow-hidden ticket-wrapper relative rounded-md">
      {/* Bên trái: Thông tin vé */}
      <div className="w-2/3 p-4 border-r-2 border-dotted border-black">
        <h4 className="text-lg font-bold text-[#4599e3]">{theater.name}</h4>
        <p className="text-xs text-gray-500">{theater.address}</p>
        <div className="mt-2 flex justify-between">
          <div>
            <span className="text-gray-500 text-sm">MOVIE</span>
            <p className="font-semibold">{movieInfo.movieTitle}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">CUSTOMER</span>
            <p className="font-semibold">Thien dep trai</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">TYPE</span>
            <p className="font-semibold">{movieInfo.type}</p>
          </div>
        </div>
        <div className="mt-2 flex justify-between">
          <div>
            <span className="text-gray-500 text-sm">SEAT</span>
            <p className="font-semibold">
              {selectedSeats.join(", ") || "None"}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">TIME</span>
            <p className="font-semibold">{selectedTime}</p>
          </div>
          <div>
            <span className="text-gray-500 text-sm">DATE</span>
            <p className="font-semibold">
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "12/07/2022"}
            </p>
          </div>
        </div>
      </div>

      {/* Bên phải: ROOM, TICKET ID, và QR code */}
      <div className="w-1/3 p-4 bg-[#4599e3] text-white flex flex-col items-center justify-between rounded-r-md">
        <div className="text-center">
          <p className="text-4xl font-bold">{selectedRoom}</p>
          <p className="text-sm">ROOM</p>
          <p className="text-sm mt-1">Ticket ID: {ticketId || "None"}</p>
        </div>
        <div className="bg-white p-1 rounded">
          <QRCodeSVG value={qrCodeContent} size={80} />
        </div>
      </div>

      {/* CSS cho hiệu ứng vé */}
      <style jsx>{`
        .ticket-wrapper {
          position: relative;
          overflow: visible !important;
        }
        .ticket-wrapper::before {
          content: "";
          position: absolute;
          top: 50%;
          left: -12px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-color: #0f1116;
          border-radius: 50%;
          z-index: 1;
        }
        .ticket-wrapper::after {
          content: "";
          position: absolute;
          top: 50%;
          right: -12px;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          background-color: #0f1116;
          border-radius: 50%;
          z-index: 1;
        }
      `}</style>
    </div>
  )
}

export default Ticket
