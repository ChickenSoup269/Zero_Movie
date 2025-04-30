const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const seatsPerRow = 18;

interface SeatSelectionProps {
  onClose: () => void;
  onSeatSelect: (seatId: string) => void;
  selectedSeat: string | null;
}

export default function SeatSelection({
  onClose,
  onSeatSelect,
  selectedSeat,
}: SeatSelectionProps) {
  const handleSeatClick = (seatId: string) => {
    onSeatSelect(seatId);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-5xl mx-auto">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
      >
        X
      </button>

      <h2 className="text-xl font-bold text-center mb-4">Chọn ghế</h2>

      <div className="grid gap-2">
        {rows.map((row) => {
          const seats = Array.from({ length: seatsPerRow }, (_, i) => ({
            row,
            number: i + 1,
          }));

          const left = seats.slice(0, 4); // 4 ghế bên trái
          const middle = seats.slice(4, 14); // 10 ghế giữa
          const right = seats.slice(14); // 4 ghế bên phải

          return (
            <div key={row} className="flex items-center gap-2">
              <span className="text-gray-400 w-5 text-sm">{row}</span>
              <div className="flex justify-center gap-4 flex-1">
                <div className="flex gap-1">
                  {left.map((seat) => renderSeat(row, seat.number))}
                </div>
                <div className="w-6" /> {/* Lối đi bên trái */}
                <div className="flex gap-1">
                  {middle.map((seat) => renderSeat(row, seat.number))}
                </div>
                <div className="w-6" /> {/* Lối đi bên phải */}
                <div className="flex gap-1">
                  {right.map((seat) => renderSeat(row, seat.number))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  function renderSeat(row: string, number: number) {
    const seatId = `${row}${number}`;
    const isCurrent = selectedSeat === seatId;

    return (
      <button
        key={seatId}
        onClick={() => handleSeatClick(seatId)}
        className={`w-8 h-8 rounded-sm text-sm font-medium flex items-center justify-center transition
          ${
            isCurrent
              ? "bg-blue-600 text-white font-bold scale-110 ring-2 ring-blue-400 shadow-md"
              : "bg-gray-200 text-black hover:bg-gray-300"
          }`}
        title={seatId}
      >
        {number}
      </button>
    );
  }
}
