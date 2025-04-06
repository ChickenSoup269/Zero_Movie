import { format } from "date-fns"

/* eslint-disable @typescript-eslint/no-unused-vars */
interface PaymentSummaryProps {
  selectedSeats: string[]
  selectedTime: string
  selectedDate: Date | undefined
  originalPrice: number
  savings: number
  totalAmount: number
}

export const PaymentSummary = ({
  selectedSeats,
  selectedTime,
  selectedDate,
  originalPrice,
  savings,
  totalAmount,
}: PaymentSummaryProps) => {
  return (
    <div className="bg-white text-black rounded-md shadow-lg shadow-blue-500/30 p-4 sm:p-5 border border-gray-200">
      <h3 className="text-lg sm:text-xl font-bold text-[#4599e3] mb-3 sm:mb-4">
        Payment Summary
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Cột thông tin */}
        <div className="space-y-2 sm:space-y-3">
          <div>
            <p className="text-gray-500 text-sm sm:text-base">Date & Time</p>
            <p className="font-semibold text-sm sm:text-base">
              {selectedDate
                ? format(selectedDate, "EEE, dd MMM yyyy")
                : "Not selected"}{" "}
              • {selectedTime}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm sm:text-base">Selected Seats</p>
            <p className="font-semibold text-sm sm:text-base">
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </p>
          </div>
        </div>

        {/* Cột thanh toán */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm sm:text-base">
              Original Price
            </span>
            <span className="font-semibold text-sm sm:text-base">
              ${originalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500 text-sm sm:text-base">Savings</span>
            <span className="text-green-500 font-semibold text-sm sm:text-base">
              -${savings.toFixed(2)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-gray-700 font-bold text-sm sm:text-base">
                Total
              </span>
              <span className="text-[#4599e3] font-bold text-lg sm:text-xl">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin khuyến mãi */}
      <div className="mt-4 sm:mt-5 bg-blue-50 p-2 sm:p-3 rounded text-xs sm:text-sm text-blue-700">
        <p>🎟️ You saved ${savings.toFixed(2)} with our special discount!</p>
      </div>
    </div>
  )
}
