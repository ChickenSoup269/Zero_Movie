import SeatSelection from "@/components/seat-selection"

export default function SeatSelectionPage() {
  return (
    <div className="seatSealect">
      <SeatSelection params={Promise.resolve({ id: "some-id" })} />
    </div>
  )
}
