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
    <div className="bg-white text-black flex flex-col sm:flex-row overflow-hidden ticket-wrapper relative rounded-md">
      {/* Bên trái: Thông tin vé */}
      <div className="w-full sm:w-2/3 p-3 sm:p-4 border-b-2 sm:border-b-0 sm:border-r-2 border-dotted border-black shadow-lg shadow-blue-500/50">
        <h4 className="text-base sm:text-lg font-bold text-[#4599e3]">
          {theater.name}
        </h4>
        <p className="text-xs text-gray-500">{theater.address}</p>
        <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">MOVIE</span>
            <p className="font-semibold text-sm sm:text-base">
              {movieInfo.movieTitle}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">CUSTOMER</span>
            <p className="font-semibold text-sm sm:text-base">Thien dep trai</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">TYPE</span>
            <p className="font-semibold text-sm sm:text-base">
              {movieInfo.type}
            </p>
          </div>
        </div>
        <div className="mt-1 sm:mt-2 flex flex-col sm:flex-row sm:justify-between gap-2 sm:gap-0">
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">SEAT</span>
            <p className="font-semibold text-sm sm:text-base">
              {selectedSeats.join(", ") || "None"}
            </p>
          </div>
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">TIME</span>
            <p className="font-semibold text-sm sm:text-base">{selectedTime}</p>
          </div>
          <div>
            <span className="text-gray-500 text-xs sm:text-sm">DATE</span>
            <p className="font-semibold text-sm sm:text-base">
              {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "12/07/2022"}
            </p>
          </div>
        </div>
      </div>

      {/* Bên phải: ROOM, TICKET ID, và QR code */}
      <div className="w-full sm:w-1/3 p-3 sm:p-4 bg-[#4599e3] shadow-lg shadow-blue-500/50 text-white flex flex-col items-center justify-between rounded-b-md sm:rounded-b-none sm:rounded-r-md">
        <div className="text-center">
          <p className="text-2xl sm:text-4xl font-bold">{selectedRoom}</p>
          <p className="text-xs sm:text-sm">ROOM</p>
          <p className="text-xs sm:text-sm mt-1">
            Ticket ID: {ticketId || "None"}
          </p>
        </div>
        <div className="bg-white p-1 rounded">
          <QRCodeSVG
            value={qrCodeContent}
            size={60}
            className="sm:w-[80px] sm:h-[80px]"
          />
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
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          background-color: #0f1116;
          border-radius: 50%;
          z-index: 1;
          display: none;
        }
        .ticket-wrapper::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 16px;
          background-color: #0f1116;
          border-radius: 50%;
          z-index: 1;
          display: none;
        }
        @media (min-width: 640px) {
          .ticket-wrapper::before {
            top: 50%;
            left: -12px;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            display: block;
          }
          .ticket-wrapper::after {
            top: 50%;
            right: -12px;
            bottom: auto;
            left: auto;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            display: block;
          }
        }
      `}</style>
    </div>
  )
}

export default Ticket
