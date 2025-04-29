import { format } from "date-fns"

interface PaymentSummaryProps {
  selectedSeats: string[]
  selectedTime: string
  selectedDate: Date | undefined
  originalPrice: number
  savings: number
  totalAmount: number
  currency?: string
}

// Hàm đọc số thành chữ
const readNumber = (number: number): string => {
  const unitTest = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ]
  const scaleTexts = [
    "",
    "nghìn",
    "triệu",
    "tỷ",
    "nghìn tỷ",
    "triệu tỷ",
    "tỷ tỷ",
  ]

  const readThreeDigits = (num: number, hasScale: boolean = false): string => {
    const hundreds = Math.floor(num / 100)
    const remainder = num % 100
    const tens = Math.floor(remainder / 10)
    const units = remainder % 10

    let result = ""

    if (hundreds > 0) {
      result += unitTest[hundreds] + " trăm "
    } else if (hasScale && (tens > 0 || units > 0)) {
      result += "không trăm "
    }

    if (tens > 1) {
      result += unitTest[tens] + " mươi "
    } else if (tens === 1) {
      result += "mười "
    } else if (hasScale && units > 0) {
      result += "lẻ "
    }

    if (tens > 1 && units === 1) {
      result += "mốt "
    } else if (tens > 0 && units === 5) {
      result += "lăm "
    } else if (units > 0) {
      result += unitTest[units] + " "
    }

    return result.trim()
  }

  let result = ""
  let index = 0
  let absNumber = Math.abs(number)
  const lastIndex = Math.floor(String(absNumber).length / 3)

  if (!absNumber) return "Không đồng"

  do {
    const hasScale = index !== lastIndex
    const threeDigits = readThreeDigits(absNumber % 1000, hasScale)

    if (threeDigits) {
      result = `${threeDigits} ${scaleTexts[index]} ${result}`
    }

    absNumber = Math.floor(absNumber / 1000)
    index++
  } while (absNumber > 0)

  result = (number < 0 ? "âm " : "") + result.trim() + " đồng"

  return result.charAt(0).toUpperCase() + result.slice(1)
}

export const PaymentSummary = ({
  selectedSeats,
  selectedTime,
  selectedDate,
  originalPrice,
  savings,
  totalAmount,
  currency = "đ",
}: PaymentSummaryProps) => {
  return (
    <div className="bg-transparent text-gray-500 rounded-md p-4 sm:p-5">
      <h3 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
        Payment Summary
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-2 sm:space-y-3">
          <div>
            <p className="text-white font-bold text-sm sm:text-base">
              Date & Time
            </p>
            <p className="font-semibold text-sm sm:text-base">
              {selectedDate
                ? format(selectedDate, "EEE, dd MMM yyyy")
                : "Not selected"}{" "}
              • {selectedTime || "Not selected"}
            </p>
          </div>
          <div>
            <p className="text-white font-bold text-sm sm:text-base">
              Selected Seats
            </p>
            <p className="font-semibold text-sm sm:text-base">
              {selectedSeats.length > 0 ? selectedSeats.join(", ") : "None"}
            </p>
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between">
            <span className="text-white font-bold text-sm sm:text-base">
              Original Price
            </span>
            <span className="text-white font-semibold text-sm sm:text-base">
              {originalPrice.toLocaleString("vi-VN")}
              {currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white font-bold text-sm sm:text-base">
              Savings
            </span>
            <span className="text-green-500 font-semibold text-sm sm:text-base">
              -{savings.toLocaleString("vi-VN")}
              {currency}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2 mt-2">
            <div className="flex justify-between">
              <span className="text-white font-bold text-sm sm:text-base">
                Total
              </span>
              <span className="text-white font-bold text-lg sm:text-xl">
                {totalAmount.toLocaleString("vi-VN")}
                {currency}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 sm:mt-5  rounded sm:text-sm text-white">
        <p className="mt-1 font-medium text-blue-400">
          Thành tiền:{" "}
          <span className="text-white">{readNumber(totalAmount)}</span>
        </p>
      </div>
    </div>
  )
}
