import FullImageSlider from "@/components/ui-home/full-image-slider"
import Movies from "@/components/ui-home/movies"

export default function Home() {
  const slides = [
    // Now Showing (5 phim)
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
      status: "nowShowing",
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
      status: "nowShowing",
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
      status: "nowShowing",
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
      status: "nowShowing",
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
      status: "nowShowing",
    },

    // Upcoming (5 phim)
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
      status: "nowShowing",
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
      status: "nowShowing",
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
      status: "nowShowing",
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
      status: "upcoming",
    },
    {
      title: "A Bug's Life",
      description:
        "Flik, an inventive ant, accidentally destroys the food offering for a gang of oppressive grasshoppers. To save his colony, he recruits a group of misfit bugs posing as warriors. This hilarious adventure unfolds as Flik and his new friends outsmart the grasshoppers, proving that even the smallest creatures can make a big difference.",
      image: "/images/abl_wall.jpg",
      poster: "/images/02_abl.jpg",
      duration: "95 min", // Đã thêm duration thực tế
      genre: "Animation, Adventure, Comedy",
      releaseYear: 1998, // Năm thực tế
      ageRating: "0+",
      starring: "Dave Foley, Kevin Spacey, Julia Louis-Dreyfus",
      status: "nowShowing", // Chuyển sang nowShowing để cân bằng
    },
    {
      title: "Ratatouille",
      description:
        "Remy, a rat with a passion for cooking, teams up with a clumsy human, Linguini, to pursue his culinary dreams in a prestigious Parisian restaurant. Together, they overcome prejudice and chaos to create extraordinary dishes, showing that great talent can come from the most unexpected places.",
      image: "/images/rat_wall.jpg",
      poster: "/images/08_rat.jpg",
      duration: "111 min", // Đã thêm duration thực tế
      genre: "Animation, Comedy, Family",
      releaseYear: 2007, // Năm thực tế
      ageRating: "0+",
      starring: "Patton Oswalt, Ian Holm, Lou Romano",
      status: "nowShowing", // Chuyển sang nowShowing để cân bằng
    },
    {
      title: "Monsters University",
      description:
        "Mike Wazowski and James P. Sullivan meet as college freshmen at Monsters University, starting as rivals before becoming best friends. Through scare competitions and unexpected challenges, they learn the value of teamwork and determination in this prequel to Monsters, Inc.",
      image: "/images/mu_wall.jpg",
      poster: "/images/14_MU_stroke.jpg",
      duration: "104 min", // Đã thêm duration thực tế
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2013, // Năm thực tế, thay vì "Elio"
      ageRating: "0+",
      starring: "Billy Crystal, John Goodman, Steve Buscemi",
      status: "nowShowing", // Chuyển sang nowShowing để cân bằng
    },
    {
      title: "Elemental",
      description:
        "In a city where fire, water, earth, and air residents live together, Ember (a fiery young woman) and Wade (a go-with-the-flow water guy) form an unlikely bond. Their journey explores love, identity, and the beauty of embracing differences in a vibrant, elemental world.",
      image: "/images/elemental_wall.jpg",
      poster: "/images/elemental.jpg",
      duration: "101 min", // Đã thêm duration thực tế
      genre: "Animation, Adventure, Romance",
      releaseYear: 2023, // Năm thực tế
      ageRating: "7+",
      starring: "Leah Lewis, Mamoudou Athie, Ronnie del Carmen",
      status: "nowShowing", // Chuyển sang nowShowing để cân bằng
    },
    {
      title: "Inside Out",
      description:
        "Riley, an 11-year-old girl, navigates life’s changes as her emotions—Joy, Sadness, Anger, Fear, and Disgust—work together in her mind’s headquarters. When Joy and Sadness get lost, they embark on a colorful adventure to restore balance, revealing the importance of every feeling.",
      image: "/images/io_wall.jpg",
      poster: "/images/15_io.jpg",
      duration: "95 min", // Đã thêm duration thực tế
      genre: "Animation, Adventure, Comedy",
      releaseYear: 2015, // Năm thực tế
      ageRating: "7+",
      starring: "Amy Poehler, Phyllis Smith, Bill Hader",
      status: "nowShowing", // Chuyển sang nowShowing để cân bằng
    },
    {
      title: "Lightyear",
      description:
        "Buzz Lightyear, the real space ranger behind the toy, embarks on a high-stakes mission to return home after being marooned on a hostile planet. Facing robots, time dilation, and his own limits, this sci-fi adventure redefines the hero’s origin with thrilling action.",
      image: "/images/lightyear_wall.jpg",
      poster: "/images/lightyear.jpg",
      duration: "105 min", // Đã thêm duration thực tế
      genre: "Animation, Adventure, Sci-Fi",
      releaseYear: 2022, // Năm thực tế
      ageRating: "7+",
      starring: "Chris Evans, Keke Palmer, Peter Sohn",
      status: "upcoming",
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
      status: "upcoming",
    },
    {
      title: "Incredibles 2",
      description:
        "The Parr family returns as Helen takes the spotlight as Elastigirl to fight crime, while Bob struggles with domestic life and super-kids. A new villain’s plot tests their powers and teamwork, delivering action-packed fun and family dynamics in a retro-futuristic world.",
      image: "/images/incredibles_wall.jpg",
      poster: "/images/20_i2.jpg",
      duration: "118 min", // Đã thêm duration thực tế
      genre: "Animation, Action, Adventure",
      releaseYear: 2018, // Năm thực tế
      ageRating: "7+",
      starring: "Craig T. Nelson, Holly Hunter, Sarah Vowell",
      status: "upcoming",
    },
    {
      title: "Soul",
      description:
        "Joe Gardner, a middle-school music teacher, gets a chance to play jazz professionally but ends up in the Great Before after an accident. Teaming up with a soul named 22, he explores life’s meaning in a soulful, existential journey between Earth and the afterlife.",
      image: "/images/22_soul_wall.jpg",
      poster: "/images/22_soul.jpg",
      duration: "100 min", // Đã thêm duration thực tế
      genre: "Animation, Adventure, Fantasy",
      releaseYear: 2020, // Năm thực tế
      ageRating: "7+",
      starring: "Jamie Foxx, Tina Fey, Graham Norton",
      status: "upcoming",
    },
    {
      title: "Onward",
      description:
        "Two elf brothers, Ian and Barley, embark on a magical quest to spend one last day with their late father using a spell that goes half-right. In a suburban fantasy world, they race against time, facing mythical creatures and personal doubts in a heartfelt tale of brotherhood.",
      image: "/images/onward_wall.jpg",
      poster: "/images/onward.jpg",
      duration: "102 min", // Đã thêm duration thực tế
      genre: "Animation, Adventure, Fantasy",
      releaseYear: 2020, // Năm thực tế
      ageRating: "7+",
      starring: "Tom Holland, Chris Pratt, Julia Louis-Dreyfus",
      status: "upcoming",
    },
    {
      title: "Turning Red",
      description:
        "Mei Lee, a 13-year-old girl, transforms into a giant red panda whenever she gets too excited, thanks to an ancestral curse. Balancing teenage life, family expectations, and her wild side, she learns to embrace her true self in this quirky coming-of-age story.",
      image: "/images/turning_red_wall.jpg",
      poster: "/images/turning_red.jpg",
      duration: "100 min", // Đã thêm duration thực tế
      genre: "Animation, Comedy, Family",
      releaseYear: 2022, // Năm thực tế
      ageRating: "7+",
      starring: "Rosalie Chiang, Sandra Oh, Ava Morse",
      status: "upcoming",
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
