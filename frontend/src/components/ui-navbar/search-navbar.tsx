"use client"
import { useState, useEffect } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import SearchPopup from "@/components/ui-navbar/search-popup"

// Định nghĩa kiểu cho một phim
interface Movie {
  title: string
  description: string
  image: string
  poster: string
  duration: string
  genre: string
  releaseYear: number
  ageRating: string
  starring: string
}

export default function SearchBar() {
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false)
  const [searchText, setSearchText] = useState<string>("")
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Dữ liệu phim từ slides (với các thuộc tính giả định)
  const slides: Movie[] = [
    {
      title: "Monsters, Inc.",
      description:
        "In the whimsical city of Monstropolis, cheerful monsters generate power by scaring children at night. James P. Sullivan (Sulley) and his coworker Mike Wazowski stumble upon a dark conspiracy when little Boo sneaks into their world. A hilarious adventure unfolds as they try to get Boo home, discovering the true power of laughter along the way.",
      image: "/images/monster's.jpg",
      poster: "/images/04_monsters_stroke.jpg",
      duration: "92 min",
      genre: "Animation, Family, Comedy",
      releaseYear: 2001,
      ageRating: "0+",
      starring: "John Goodman, Billy Crystal, Mary Gibbs",
    },
    {
      title: "The Good Dinosaur",
      description:
        "Set in a world where dinosaurs never went extinct, the film follows Arlo, a timid dinosaur, and Spot, a prehistoric human boy. After a flood sweeps Arlo away from his family, he must overcome his fears to find his way home with Spot. This emotional journey explores an unlikely friendship between two different species, delivering lessons on courage and growth.",
      image: "/images/the-good-dinosaur.jpg",
      poster: "/images/16_dino.jpg",
      duration: "93 min",
      genre: "Animation, Adventure, Family",
      releaseYear: 2015,
      ageRating: "7+",
      starring: "Raymond Ochoa, Jack Bright, Jeffrey Wright",
    },
    {
      title: "Up",
      description:
        "Carl Fredricksen, a widowed old man, fulfills his childhood dream by tying thousands of balloons to his house to fly to Paradise Falls. The trip takes an unexpected turn when a young scout, Russell, accidentally joins him. This touching journey is not just an airborne adventure but a story of love, loss, and friendship that bridges generations.",
      image: "/images/up.jpg",
      poster: "/images/10_up.jpg",
      duration: "96 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2009,
      ageRating: "7+",
      starring: "Ed Asner, Christopher Plummer, Jordan Nagai",
    },
    {
      title: "Coco",
      description:
        "Miguel, a music-loving boy, accidentally enters the Land of the Dead during Día de los Muertos. To return home, he must uncover family secrets and confront his ancestors. The film is a vibrant, musical journey celebrating Mexican culture, family love, and the power of dreams, proving that death cannot sever bonded hearts.",
      image: "/images/coco.jpg",
      poster: "/images/19_coco.jpg",
      duration: "105 min",
      genre: "Animation, Family, Fantasy",
      releaseYear: 2017,
      ageRating: "7+",
      starring: "Anthony Gonzalez, Gael García Bernal, Benjamin Bratt",
    },
    {
      title: "Luca",
      description:
        "On the stunning Italian Riviera, Luca—a sea monster boy—spends an unforgettable summer with his friend Alberto. They explore the human world, enjoying gelato, bike races, and dreams of freedom. But their true identities threaten their peaceful existence, making this a sweet tale of youth, friendship, and self-acceptance.",
      image: "/images/luca.jpg",
      poster: "/images/23_luca.jpg",
      duration: "95 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2021,
      ageRating: "7+",
      starring: "Jacob Tremblay, Jack Dylan Grazer, Emma Berman",
    },
    {
      title: "Cars 3",
      description:
        "Legendary racer Lightning McQueen faces his biggest challenge as a new generation of faster, stronger cars overtakes him. After a serious crash, he teams up with trainer Cruz Ramirez to reclaim his glory and prove he can still win. The film is a story of perseverance, change, and an unyielding spirit in a dazzling world of speed.",
      image: "/images/car-3.jpg",
      poster: "/images/18_cars3.jpg",
      duration: "102 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2017,
      ageRating: "0+",
      starring: "Owen Wilson, Cristela Alonzo, Chris Cooper",
    },
    {
      title: "Finding Dory",
      description:
        "Dory, the forgetful fish, sets out to find her parents with Nemo and Marlin by her side. From familiar coral reefs to a marine institute in California, she uncovers her past with help from friends and a quirky octopus. This oceanic adventure is full of heart, highlighting family ties and the power of patience.",
      image: "/images/finding-dory.jpg",
      poster: "/images/17_dory.jpg",
      duration: "97 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2016,
      ageRating: "7+",
      starring: "Ellen DeGeneres, Albert Brooks, Ed O'Neill",
    },
    {
      title: "WALL-E",
      description:
        "WALL-E, a tiny waste-collecting robot, lives alone on a trash-covered, abandoned Earth. Everything changes when he meets EVE, a sleek modern robot, and they embark on a space adventure. Beyond a love story between robots, the film serves as a warning about the environment and humanity’s responsibility to the planet.",
      image: "/images/wall-e.jpg",
      poster: "/images/09_walle.jpg",
      duration: "98 min",
      genre: "Animation, Adventure, Sci-Fi",
      releaseYear: 2008,
      ageRating: "0+",
      starring: "Ben Burtt, Elissa Knight, Jeff Garlin",
    },
    {
      title: "Elio",
      description:
        "Elio, an imaginative boy, becomes Earth’s ambassador after being abducted by aliens. Traveling among the stars, he connects with strange creatures and learns to represent humanity. This sci-fi adventure promises a creative tale of bravery and understanding across civilizations.",
      image: "/images/elio-2024.jpg",
      poster: "/images/ELIO_Teaser.jpg",
      duration: "N/A",
      genre: "Animation, Adventure, Sci-Fi",
      releaseYear: 2025,
      ageRating: "7+",
      starring: "Yonas Kibreab, Zoe Saldaña, Brad Garrett",
    },
    {
      title: "Toy Story 4",
      description:
        "Woody, Buzz, and the toy gang return for a road trip adventure with Forky, a quirky homemade toy. Reuniting with Bo Peep, Woody grapples with what it truly means to be a toy. This emotional farewell to the iconic series offers lessons on change and everlasting friendship.",
      image: "/images/toy-story-4.jpg",
      poster: "/images/21_ts4.jpg",
      duration: "100 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2019,
      ageRating: "0+",
      starring: "Tom Hanks, Tim Allen, Annie Potts",
    },
  ]

  // Lọc phim dựa trên từ khóa tìm kiếm
  const filteredMovies: Movie[] = slides.filter((movie) =>
    movie.title.toLowerCase().includes(debouncedSearchText.toLowerCase())
  )

  // Animation variants cho search box
  const searchVariants = {
    closed: {
      width: "40px",
      opacity: 1,
      transition: { duration: 0.3 },
    },
    open: {
      width: "300px",
      opacity: 1,
      transition: { duration: 0.3 },
    },
  }

  // Debounce search text
  useEffect(() => {
    if (isSearchOpen && searchText) {
      // Chỉ debounce khi có text
      setIsLoading(true)
      const timer = setTimeout(() => {
        setDebouncedSearchText(searchText)
        setIsLoading(false)
      }, 1000) // Chờ 1 giây trước khi hiển thị kết quả
      return () => clearTimeout(timer)
    } else {
      setIsLoading(false) // Đảm bảo isLoading là false khi mở nhưng chưa nhập
    }
  }, [searchText, isSearchOpen])

  // Hàm xóa text
  const clearSearch = () => {
    setSearchText("")
    setDebouncedSearchText("")
  }

  // Hàm toggle search
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
    if (!isSearchOpen) {
      setSearchText("")
      setDebouncedSearchText("")
    }
  }

  return (
    <div className="flex items-center relative">
      <AnimatePresence>
        <motion.div
          variants={searchVariants}
          initial="closed"
          animate={isSearchOpen ? "open" : "closed"}
          exit="closed"
          className="relative"
        >
          <div
            className="ml-2 bg-transparent shadow-xl border border-white backdrop-blur-lg rounded-md"
            style={{
              backgroundImage: "url('/path-to-your-pattern.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearch}
                className="h-8 w-8 hover:bg-gray-500"
              >
                <Search className="h-4 w-4 text-white" />
              </Button>

              {/* Đường phân cách */}
              <div className="h-4 w-px bg-white/50 mx-2"></div>

              {isSearchOpen && (
                <>
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="w-full ml-1 bg-transparent border-none focus:outline-none text-white pr-12"
                  />
                  <div className="relative">
                    {isLoading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 p-0 flex items-center justify-center text-white"
                        disabled
                      >
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      </Button>
                    )}
                    {searchText && !isLoading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 p-0 hover:bg-gray-500 flex items-center justify-center"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4 text-white" />
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sử dụng component SearchPopup */}
          <SearchPopup
            filteredMovies={filteredMovies}
            isSearchOpen={isSearchOpen}
            debouncedSearchText={debouncedSearchText}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
