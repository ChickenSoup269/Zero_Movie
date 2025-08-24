"use client"
import SeatSelection from "@/components/ui-360/SeatSelection"

export default function SeatSelectionPage() {
    return (
      <div className="seatSealect">
        <SeatSelection
          onClose={() => {}}
          onSeatSelect={() => {}}
          selectedSeat={null}
        />
      </div>
    )
  }