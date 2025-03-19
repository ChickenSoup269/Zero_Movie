import FullImageSlider from "@/components/ui-home/full-image-slider"
import Movies from "@/components/ui-home/movies"

export default function Home() {
  const slides = [
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
  return (
    <div className="min-h-screen  text-white">
      {/* SLide ảnh full componeent */}
      <FullImageSlider slides={slides} />
      <Movies slides={slides} />
    </div>
  )
}
