"use client"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import CustomSwitch from "@/components/ui-navbar/switch-theme"
import SearchBar from "@/components/ui-navbar/search-navbar"
import LanguageSelector from "@/components/ui-navbar/language-selector"
import Link from "next/link"
import Image from "next/legacy/image"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X as CloseIcon, Film, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import TicketComponent from "@/components/ui-details-movies/ticket"
import { Skeleton } from "@/components/ui/skeleton"
import { useUser } from "@/hooks/use-user"
import UserProfileDropdown from "@/components/ui-profile/user-profile-dropdown"

interface NavItem {
  href: string
  label: string
}

interface TicketData {
  theater: { id: number; name: string; address: string }
  movieInfo: { movieTitle: string; type: string; director: string }
  selectedSeats: string[]
  selectedTime: string
  selectedDate: Date | undefined
  ticketId: string
  selectedRoom: string
  selectedType: string
  purchaseTime: string
}

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<TicketData[]>([])

  const pathname = usePathname()
  const { user, isLoggedIn, loading } = useUser()

  const navItems: NavItem[] = [
    { href: "/", label: "home" },
    { href: "/movies", label: "movies" },
    { href: "/cinema", label: "cinema" },
  ]

  useEffect(() => {
    console.log("isLoggedIn:", isLoggedIn, "user:", user) // Debug login state
    const storedTickets = JSON.parse(
      localStorage.getItem("purchasedTickets") || "[]"
    )
    setCartItems(storedTickets)
  }, [isLoggedIn, user])

  useEffect(() => {
    const handleStorageChange = () => {
      const storedTickets = JSON.parse(
        localStorage.getItem("purchasedTickets") || "[]"
      )
      setCartItems(storedTickets)
    }
    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true"
    setDarkMode(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  const handleRemoveTicket = (ticketId: string) => {
    const updatedCartItems = cartItems.filter(
      (item) => item.ticketId !== ticketId
    )
    setCartItems(updatedCartItems)
    localStorage.setItem("purchasedTickets", JSON.stringify(updatedCartItems))
  }

  const mobileMenuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
  }

  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: 10,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  }

  return (
    <>
      <nav
        className={`fixed left-4 right-4 z-50 flex items-center justify-between transition-all duration-300 rounded-md ${
          isScrolled
            ? "top-0 bg-white/10 dark:bg-transparent backdrop-blur-lg text-white shadow-lg pt-2 pb-4 px-5"
            : "top-1 text-white dark:text-white p-4"
        }`}
      >
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Zero Movies Logo"
              width={isScrolled ? 80 : 100}
              height={isScrolled ? 50 : 80}
              className="cursor-pointer transition-transform duration-300 hover:scale-105"
            />
          </Link>

          <div className="hidden md:flex space-x-6 text-md">
            {navItems.map((item) => (
              <motion.div
                key={item.href}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={item.href}
                  className={`hover:[text-shadow:_0_2px_4px_rgb(255_255_255_/_0.8)] capitalize transition-colors duration-300 px-2 py-1 ${
                    pathname === item.href
                      ? isScrolled
                        ? "bg-[#4599e3] text-white font-bold rounded-b-lg -mt-2 pt-5 pb-2"
                        : "bg-[#4599e3] text-white font-bold rounded-lg"
                      : ""
                  }`}
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-8 w-8 p-0 hover:bg-gray-500"
            >
              {isMobileMenuOpen ? (
                <CloseIcon className="h-6 w-6 text-white" />
              ) : (
                <Menu className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <SearchBar />
          {!isLoggedIn && <LanguageSelector />}
          <CustomSwitch checked={darkMode} onCheckedChange={setDarkMode} />

          <div
            className="relative cursor-pointer"
            onClick={() => setIsCartOpen(true)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <Film className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </motion.div>
          </div>

          {loading ? (
            <Skeleton className="h-8 w-8 rounded-full" />
          ) : isLoggedIn ? (
            <UserProfileDropdown isLoggedIn={isLoggedIn} user={user} />
          ) : (
            <Link href="/login">
              <Button className="bg-[#4599e3] hover:bg-[#287ac3] dark:hover:bg-[#dfdfdf] dark:bg-white dark:text-black duration-300">
                Sign in
              </Button>
            </Link>
          )}
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-16 left-0 w-full bg-white/90 dark:bg-gray-800 shadow-lg rounded-b-md z-40 p-4"
            >
              <div className="flex flex-col space-y-4 text-lg text-black dark:text-white">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`hover:text-gray-300 capitalize transition-colors duration-300 px-2 py-1 ${
                      pathname === item.href
                        ? "bg-[#4599e3] text-white font-bold rounded-lg"
                        : ""
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <AnimatePresence>
          {isCartOpen && (
            <motion.div
              variants={dialogVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <DialogContent className="sm:max-w-[620px] w-[90%] overflow-visible p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-center text-base sm:text-lg font-bold">
                    Your Purchased Tickets
                  </DialogTitle>
                </DialogHeader>
                <div className="py-3 sm:py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                  {cartItems.length === 0 ? (
                    <p className="text-center text-gray-500 text-sm sm:text-base">
                      No tickets purchased yet.
                    </p>
                  ) : (
                    cartItems.map((ticket, index) => (
                      <div key={index} className="space-y-2 relative">
                        <p className="text-sm sm:text-base text-gray-500">
                          Purchased at:{" "}
                          {format(
                            new Date(ticket.purchaseTime),
                            "dd/MM/yyyy HH:mm:ss"
                          )}
                        </p>
                        <TicketComponent
                          theater={ticket.theater}
                          movieInfo={ticket.movieInfo}
                          selectedSeats={ticket.selectedSeats}
                          selectedTime={ticket.selectedTime}
                          selectedDate={
                            ticket.selectedDate
                              ? new Date(ticket.selectedDate)
                              : undefined
                          }
                          ticketId={ticket.ticketId}
                          selectedRoom={ticket.selectedRoom}
                          selectedType={ticket.selectedType}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-0 right-0 text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveTicket(ticket.ticketId)}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
                <DialogFooter className="flex justify-center gap-2 sm:gap-3">
                  <Button
                    onClick={() => setIsCartOpen(false)}
                    className="px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base bg-gray-300 text-black rounded-lg hover:bg-gray-400"
                  >
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  )
}
