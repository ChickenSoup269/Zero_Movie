import FullImageSlider from "@/components/ui-home/full-image-slider"

export default function Home() {
  const slides = [
    {
      title: "Monsters, Inc.",
      description: "Monsters generate power by scaring kids in Monstropolis.",
      image: "/images/monster's.jpg",
      poster: "/images/04_monsters_stroke.jpg",
      duration: "92 min",
      genre: "Animation, Family, Comedy",
      releaseYear: 2001,
    },
    {
      title: "The Good Dinosaur",
      description:
        "A young dinosaur and his human friend embark on an adventure.",
      image: "/images/the-good-dinosaur.jpg",
      poster: "/images/16_dino.jpg",
      duration: "93 min",
      genre: "Animation, Adventure, Family",
      releaseYear: 2015,
    },
    {
      title: "Up",
      description:
        "An old man flies his house with balloons to Paradise Falls.",
      image: "/images/up.jpg",
      poster: "/images/10_up.jpg",
      duration: "96 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2009,
    },
    {
      title: "Coco",
      description: "A boy explores the Land of the Dead to find his roots.",
      image: "/images/coco.jpg",
      poster: "/images/19_coco.jpg",
      duration: "105 min",
      genre: "Animation, Family, Fantasy",
      releaseYear: 2017,
    },
    {
      title: "Luca",
      description: "A sea monster boy enjoys a summer on the Italian Riviera.",
      image: "/images/luca.jpg",
      poster: "/images/23_luca.jpg",
      duration: "95 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2021,
    },
    {
      title: "Cars 3",
      description: "Lightning McQueen races against a new generation.",
      image: "/images/car-3.jpg",
      poster: "/images/18_cars3.jpg",
      duration: "102 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2017,
    },
    {
      title: "Finding Dory",
      description: "Dory searches for her parents with Nemo and Marlin.",
      image: "/images/finding-dory.jpg",
      poster: "/images/17_dory.jpg",
      duration: "97 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2016,
    },
    {
      title: "WALL-E",
      description: "A robot’s journey shapes humanity’s future.",
      image: "/images/wall-e.jpg",
      poster: "/images/09_walle.jpg",
      duration: "98 min",
      genre: "Animation, Adventure, Sci-Fi",
      releaseYear: 2008,
    },
    {
      title: "Elio",
      description: "A boy connects with aliens as Earth’s ambassador.",
      image: "/images/elio-2024.jpg",
      poster: "/images/ELIO_Teaser.jpg",
      duration: "N/A",
      genre: "Animation, Adventure, Sci-Fi",
      releaseYear: 2025,
    },
    {
      title: "Toy Story 4",
      description: "Woody and friends go on a road trip with Forky.",
      image: "/images/toy-story-4.jpg",
      poster: "/images/21_ts4.jpg",
      duration: "100 min",
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2019,
    },
  ]
  return (
    <div className="min-h-screen  text-white">
      {/* SLide ảnh full componeent */}
      <FullImageSlider slides={slides} />
      <h1>lamo</h1>
      <h1>lamo</h1>
      <h1>lamo</h1>
      <h1>lamo</h1>
      <h1>lamo</h1>
      <h1>lamo</h1>
      <h1>lamo</h1>
      <h1>lamo</h1>
      <h1>lamo</h1>
      <h1>lamo</h1>
    </div>
  )
}
