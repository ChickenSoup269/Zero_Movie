"use client"

import { useState } from "react"
import ThreeModel from "@/components/ui-360/threeModel" // Component chứa canvas + mô hình 3D + camera
import SeatSelection from "@/components/ui-360/SeatSelection" // Giao diện chọn ghế (popup)

export default function Home() {
  // Trạng thái: mở popup chọn ghế hay không
  const [showSeats, setShowSeats] = useState(false)

  // Trạng thái: ghế đã chọn (dùng để lấy tọa độ camera bay tới)
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null)

  // Bản đồ: ghế => tọa độ camera (tuỳ biến theo từng ghế)
  const seatToPositionMap: Record<string, [number, number, number]> = {
    // Hàng A
    A1: [5.9, 1.3, -1.36],
    A2: [5.38, 1.3, -1.36],
    A3: [4.86, 1.3, -1.36],
    A4: [4.33, 1.3, -1.36],
    A5: [2, 1.3, -1.36],
    A6: [1.47, 1.3, -1.36],
    A7: [0.94, 1.3, -1.36],
    A8: [0.43, 1.3, -1.36],
    A9: [-0.1, 1.3, -1.36],
    A10: [-0.6, 1.3, -1.36],
    A11: [-1.13, 1.3, -1.36],
    A12: [-1.64, 1.3, -1.36],
    A13: [-2.17, 1.3, -1.36],
    A14: [-2.69, 1.3, -1.36],
    A15: [-5.03, 1.3, -1.36],
    A16: [-5.54, 1.3, -1.36],
    A17: [-6.06, 1.3, -1.36],
    A18: [-6.6, 1.3, -1.36],
    // Hàng B
    B1: [5.89, 1.86, -2.24],
    B2: [5.38, 1.86, -2.24],
    B3: [4.86, 1.86, -2.24],
    B4: [4.33, 1.86, -2.24],
    B5: [2, 1.86, -2.24],
    B6: [1.47, 1.86, -2.24],
    B7: [0.94, 1.86, -2.24],
    B8: [0.43, 1.86, -2.24],
    B9: [-0.1, 1.86, -2.24],
    B10: [-0.6, 1.86, -2.24],
    B11: [-1.13, 1.86, -2.24],
    B12: [-1.64, 1.86, -2.24],
    B13: [-2.17, 1.86, -2.24],
    B14: [-2.69, 1.86, -2.24],
    B15: [-5.03, 1.86, -2.24],
    B16: [-5.54, 1.86, -2.24],
    B17: [-6.06, 1.86, -2.24],
    B18: [-6.6, 1.86, -2.24],
    // Hàng C
    C1: [5.89, 2.33, -3.13],
    C2: [5.38, 2.33, -3.13],
    C3: [4.86, 2.33, -3.13],
    C4: [4.33, 2.33, -3.13],
    C5: [2, 2.33, -3.13],
    C6: [1.47, 2.33, -3.13],
    C7: [0.94, 2.33, -3.13],
    C8: [0.43, 2.33, -3.13],
    C9: [-0.1, 2.33, -3.13],
    C10: [-0.6, 2.33, -3.13],
    C11: [-1.13, 2.33, -3.13],
    C12: [-1.64, 2.33, -3.13],
    C13: [-2.17, 2.33, -3.13],
    C14: [-2.69, 2.33, -3.13],
    C15: [-5.03, 2.33, -3.13],
    C16: [-5.54, 2.33, -3.13],
    C17: [-6.06, 2.33, -3.13],
    C18: [-6.6, 2.33, -3.13],
    // Hàng D
    D1: [5.89, 2.83, -4.03],
    D2: [5.38, 2.83, -4.03],
    D3: [4.86, 2.83, -4.03],
    D4: [4.33, 2.83, -4.03],
    D5: [2, 2.83, -4.03],
    D6: [1.47, 2.83, -4.03],
    D7: [0.94, 2.83, -4.03],
    D8: [0.43, 2.83, -4.03],
    D9: [-0.1, 2.83, -4.03],
    D10: [-0.6, 2.83, -4.03],
    D11: [-1.13, 2.83, -4.03],
    D12: [-1.64, 2.83, -4.03],
    D13: [-2.17, 2.83, -4.03],
    D14: [-2.69, 2.83, -4.03],
    D15: [-5.03, 2.83, -4.03],
    D16: [-5.54, 2.83, -4.03],
    D17: [-6.06, 2.83, -4.03],
    D18: [-6.6, 2.83, -4.03],
    // Hàng E
    E1: [5.89, 3.29, -4.9],
    E2: [5.38, 3.29, -4.9],
    E3: [4.86, 3.29, -4.9],
    E4: [4.33, 3.29, -4.9],
    E5: [2, 3.29, -4.9],
    E6: [1.47, 3.29, -4.9],
    E7: [0.94, 3.29, -4.9],
    E8: [0.43, 3.29, -4.9],
    E9: [-0.1, 3.29, -4.9],
    E10: [-0.6, 3.29, -4.9],
    E11: [-1.13, 3.29, -4.9],
    E12: [-1.64, 3.29, -4.9],
    E13: [-2.17, 3.29, -4.9],
    E14: [-2.69, 3.29, -4.9],
    E15: [-5.03, 3.3, -4.9],
    E16: [-5.54, 3.3, -4.9],
    E17: [-6.06, 3.3, -4.9],
    E18: [-6.6, 3.3, -4.9],
    // Hàng F
    F1: [5.9, 3.75, -5.8],
    F2: [5.39, 3.75, -5.8],
    F3: [4.87, 3.75, -5.8],
    F4: [4.33, 3.75, -5.8],
    F5: [2, 3.75, -5.8],
    F6: [1.47, 3.75, -5.8],
    F7: [0.94, 3.75, -5.8],
    F8: [0.43, 3.75, -5.8],
    F9: [-0.1, 3.75, -5.8],
    F10: [-0.6, 3.75, -5.8],
    F11: [-1.13, 3.75, -5.8],
    F12: [-1.64, 3.75, -5.8],
    F13: [-2.17, 3.75, -5.8],
    F14: [-2.69, 3.75, -5.8],
    F15: [-5.03, 3.75, -5.8],
    F16: [-5.54, 3.75, -5.8],
    F17: [-6.06, 3.75, -5.8],
    F18: [-6.6, 3.75, -5.8],
    //Hàng G
    G1: [5.9, 4.15, -6.66],
    G2: [5.39, 4.15, -6.66],
    G3: [4.87, 4.15, -6.66],
    G4: [4.33, 4.15, -6.66],
    G5: [2, 4.15, -6.66],
    G6: [1.47, 4.15, -6.66],
    G7: [0.94, 4.15, -6.66],
    G8: [0.43, 4.15, -6.66],
    G9: [-0.1, 4.15, -6.66],
    G10: [-0.6, 4.15, -6.66],
    G11: [-1.13, 4.15, -6.66],
    G12: [-1.64, 4.15, -6.66],
    G13: [-2.17, 4.15, -6.66],
    G14: [-2.69, 4.15, -6.66],
    G15: [-5.03, 4.15, -6.66],
    G16: [-5.54, 4.15, -6.66],
    G17: [-6.06, 4.15, -6.66],
    G18: [-6.6, 4.15, -6.66],
    //Hàng H
    H1: [5.9, 4.7, -7.58],
    H2: [5.39, 4.7, -7.58],
    H3: [4.87, 4.7, -7.58],
    H4: [4.33, 4.7, -7.58],
    H5: [2, 4.7, -7.58],
    H6: [1.47, 4.7, -7.58],
    H7: [0.94, 4.7, -7.58],
    H8: [0.43, 4.7, -7.58],
    H9: [-0.1, 4.7, -7.58],
    H10: [-0.6, 4.7, -7.58],
    H11: [-1.13, 4.7, -7.58],
    H12: [-1.64, 4.7, -7.58],
    H13: [-2.17, 4.7, -7.58],
    H14: [-2.69, 4.7, -7.58],
    H15: [-5.03, 4.7, -7.58],
    H16: [-5.54, 4.7, -7.58],
    H17: [-6.06, 4.7, -7.58],
    H18: [-6.6, 4.7, -7.58],
  }

  // Vị trí camera hiện tại: nếu đã chọn ghế thì dùng tọa độ tương ứng, nếu chưa thì mặc định
  const targetPosition = (selectedSeat && seatToPositionMap[selectedSeat]) || [
    0, 3.3, -4.9,
  ]

  // Hàm mở popup chọn ghế
  const openSeatSelection = () => {
    setShowSeats(true) // Mở giao diện chọn ghế
  }

  // Hàm đóng popup chọn ghế
  const closeSeatSelection = () => {
    setShowSeats(false) // Đóng giao diện chọn ghế
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Phần hiển thị canvas (3D), nằm dưới cùng */}
      <div className="absolute inset-0 z-0">
        <ThreeModel
          modelPath="/CinemaTheater.glb.json"
          targetPosition={targetPosition} // Gửi vị trí camera mục tiêu xuống
          controlsEnabled={!showSeats} // Bật điều khiển nếu popup chưa mở
        />
      </div>

      {/* Phần UI nổi bên trên (nút chọn ghế + popup), không ảnh hưởng canvas */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Nút chọn ghế, có pointer-events để click được */}
        <div className="absolute bottom-4 left-4 pointer-events-auto">
          <button
            className="bg-blue-400 text-white px-4 py-2 rounded duration-300"
            onClick={openSeatSelection}
          >
            Chọn ghế
          </button>
        </div>

        {/* Popup chọn ghế (SeatSelection) */}
        {showSeats && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center pointer-events-auto"
            onClick={(e) => e.stopPropagation()} // Ngăn click lan xuống canvas
          >
            <SeatSelection
              onClose={closeSeatSelection}
              onSeatSelect={(seatId) => {
                setSelectedSeat(seatId)
                closeSeatSelection()
              }}
              selectedSeat={selectedSeat}
            />
          </div>
        )}
      </div>
    </div>
  )
}
