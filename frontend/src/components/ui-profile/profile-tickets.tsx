// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client"

// import { useState, useEffect } from "react"
// import { motion } from "framer-motion"
// import { Ticket, Trash2, AlertTriangle } from "lucide-react"
// import { ErrorToast } from "@/components/ui-notification/error-toast"
// import { SuccessToast } from "@/components/ui-notification/success-toast"
// import { Button } from "@/components/ui/button"
// import { getUserBookings, deleteBooking } from "@/services/bookingService"
// import { Badge } from "@/components/ui/badge"

// // Define interface for booking data from backend
// interface Booking {
//   _id: string
//   movieTitle: string
//   cinemaName: string
//   cinemaAddress: string
//   roomNumber: string
//   seats: { seatId: string; seatNumber: string; row: string; column: number }[]
//   showtime: { startTime: string; endTime: string; price: number }
//   totalPrice: number
//   status: string
// }

// interface EnrichedTicket {
//   _id: string
//   movieTitle: string
//   cinemaName: string
//   cinemaAddress: string
//   roomNumber: string
//   seatNumbers: string[]
//   startTime: string
//   price: number
//   status: string
// }

// interface ProfileTicketsProps {
//   isActive: boolean
// }

// const ProfileTickets = ({ isActive }: ProfileTicketsProps) => {
//   const [tickets, setTickets] = useState<EnrichedTicket[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const errorToast = ErrorToast({
//     title: "Lỗi",
//     description: "Không thể tải danh sách vé.",
//     duration: 3000,
//   })
//   const successToast = SuccessToast({
//     title: "Thành công!",
//     description: "Đã xóa vé thành công.",
//     duration: 3000,
//   })

//   useEffect(() => {
//     const fetchTickets = async () => {
//       setIsLoading(true)
//       try {
//         const response = await getUserBookings()
//         console.log("Bookings data:", JSON.stringify(response.data, null, 2))

//         // Only include bookings with status "confirmed"
//         const bookings = (response.data || []).filter(
//           (ticket: Booking) => ticket.status === "confirmed"
//         )

//         // Transform bookings into EnrichedTicket format
//         const enrichedTickets: EnrichedTicket[] = bookings.map(
//           (booking: Booking) => {
//             console.log(`Processing booking ${booking._id}:`, {
//               movieTitle: booking.movieTitle,
//               cinemaName: booking.cinemaName,
//               cinemaAddress: booking.cinemaAddress,
//               roomNumber: booking.roomNumber,
//               seatIds: booking.seats,
//               showtime: booking.showtime,
//               seats: booking.seats,
//               status: booking.status,
//             })

//             return {
//               _id: booking._id,
//               movieTitle: booking.movieTitle || "Phim không xác định",
//               cinemaName: booking.cinemaName || "N/A",
//               cinemaAddress: booking.cinemaAddress || "N/A",
//               roomNumber: booking.roomNumber || "N/A",
//               seatNumbers: booking.seats?.map((seat) => seat.seatNumber) || [
//                 "N/A",
//               ],
//               startTime: booking.showtime?.startTime
//                 ? new Date(booking.showtime.startTime).toLocaleString("vi-VN", {
//                     dateStyle: "short",
//                     timeStyle: "short",
//                   })
//                 : "N/A",
//               price: booking.totalPrice || booking.showtime?.price || 0,
//               status: booking.status,
//             }
//           }
//         )

//         setTickets(enrichedTickets)
//       } catch (error: any) {
//         errorToast.showToast({
//           description: error.message || "Không thể tải danh sách vé.",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (isActive) {
//       fetchTickets()
//     }
//   }, [isActive])

//   const handleDeleteTicket = async (bookingId: string) => {
//     if (!window.confirm("Bạn có chắc chắn muốn xóa vé này?")) {
//       return
//     }

//     try {
//       setIsLoading(true)
//       await deleteBooking(bookingId)
//       setTickets((prev) => prev.filter((ticket) => ticket._id !== bookingId))
//       successToast.showToast({
//         description: "Đã xóa vé thành công.",
//       })
//     } catch (error: any) {
//       errorToast.showToast({
//         description: error.message || "Không thể xóa vé. Vui lòng thử lại.",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const tabVariants = {
//     hidden: { opacity: 0, y: 20, scale: 0.95 },
//     visible: { opacity: 1, y: 0, scale: 1 },
//     exit: { opacity: 0, y: -20, scale: 0.95 },
//   }

//   return (
//     <motion.div
//       variants={tabVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       className="absolute w-full py-6"
//     >
//       <h3 className="text-lg font-medium">Vé của tôi</h3>
//       {isLoading ? (
//         <p className="text-muted-foreground mt-2">Đang tải vé...</p>
//       ) : tickets.length === 0 ? (
//         <p className="text-muted-foreground mt-2">
//           Bạn chưa có vé nào đã thanh toán.
//         </p>
//       ) : (
//         <div className="mt-4 space-y-4">
//           {tickets.map((ticket) => (
//             <div
//               key={ticket._id}
//               className="p-4  shadow-lg rounded-lg  border-2 border-dashed outline-border flex justify-between items-center"
//             >
//               <div>
//                 <div className="flex items-center gap-2">
//                   <Ticket className="h-5 w-5 text-blue-400 " />
//                   <h4 className="text-lg font-bold">
//                     Phim / <span className="">{ticket.movieTitle}</span>
//                   </h4>
//                 </div>
//                 {ticket.cinemaName === "N/A" || ticket.roomNumber === "N/A" ? (
//                   <p className="text-sm text-yellow-400 mt-1 flex items-center gap-1">
//                     <AlertTriangle className="h-4 w-4" />
//                     Thông tin rạp/phòng không đầy đủ. Vui lòng liên hệ hỗ trợ.
//                   </p>
//                 ) : (
//                   <>
//                     <p className="text-sm  mt-1">
//                       <span className="font-bold">Rạp: </span>
//                       {ticket.cinemaName}
//                     </p>
//                     <p className="text-sm ">
//                       <span className="font-bold">Địa chỉ: </span>
//                       {ticket.cinemaAddress}
//                     </p>
//                     <p className="text-sm ">
//                       <span className="font-bold">Phòng: </span>
//                       {ticket.roomNumber}
//                     </p>
//                   </>
//                 )}
//                 <p className="text-sm ">
//                   <span className="font-bold">Ghế: </span>
//                   <Badge variant="outline" className="bg-blue-400 text-white">
//                     {ticket.seatNumbers.join(", ")}
//                   </Badge>
//                 </p>
//                 <p className="text-sm ">
//                   <span className="font-bold">Thời gian: </span>
//                   {ticket.startTime}
//                 </p>
//                 <p className="text-sm ">
//                   <span className="font-bold">Giá: </span>
//                   {ticket.price.toLocaleString("vi-VN")}đ
//                 </p>
//                 <p className="text-sm ">
//                   <span className="font-bold">Mã vé: </span>
//                   {ticket._id}
//                 </p>
//                 <p className="text-sm ">
//                   <span className="font-bold">Trạng thái: </span>{" "}
//                   <Badge variant="outline" className="bg-green-400 text-white">
//                     Đã xác nhận
//                   </Badge>
//                 </p>
//               </div>
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 onClick={() => handleDeleteTicket(ticket._id)}
//                 disabled={isLoading}
//                 className="text-red-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900"
//               >
//                 <Trash2 className="h-4 w-4" />
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//     </motion.div>
//   )
// }

// export default ProfileTickets
