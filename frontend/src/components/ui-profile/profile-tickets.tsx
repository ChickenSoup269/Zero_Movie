/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Ticket } from "lucide-react"
import { ErrorToast } from "@/components/ui-notification/error-toast"
import axios from "axios"

const axiosJWT = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token")
  }
  return null
}

axiosJWT.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

interface ProfileTicketsProps {
  isActive: boolean // Để biết tab tickets có đang được chọn không
}

const ProfileTickets = ({ isActive }: ProfileTicketsProps) => {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const errorToast = ErrorToast({
    title: "Error",
    description: "Failed to load tickets.",
    duration: 3000,
  })

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true)
      try {
        const response = await axiosJWT.get("/bookings/my-bookings")
        setTickets(response.data.bookings || [])
      } catch (error: any) {
        errorToast.showToast({
          description:
            error.response?.data?.message ||
            error.message ||
            "Failed to load tickets.",
        })
      } finally {
        setIsLoading(false)
      }
    }
    if (isActive) {
      fetchTickets()
    }
  }, [isActive])

  const tabVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  }

  return (
    <motion.div
      variants={tabVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="absolute w-full py-6"
    >
      <h3 className="text-lg font-medium">My Tickets</h3>
      {isLoading ? (
        <p className="text-muted-foreground mt-2">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-muted-foreground mt-2">
          You don't have any tickets yet.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="p-4 bg-gray-800 rounded-lg shadow-md"
            >
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5 text-blue-400" />
                <h4 className="font-semibold">
                  {ticket.movie?.title || "Unknown Movie"}
                </h4>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Rạp: {ticket.cinema?.name || "N/A"}
              </p>
              <p className="text-sm text-gray-400">
                Ghế:{" "}
                {ticket.seats?.map((s: any) => s.seatNumber).join(", ") ||
                  "N/A"}
              </p>
              <p className="text-sm text-gray-400">
                Thời gian:{" "}
                {new Date(ticket.showtime?.startTime).toLocaleString() || "N/A"}
              </p>
              <p className="text-sm text-gray-400">Ticket ID: {ticket._id}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default ProfileTickets
