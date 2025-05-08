import cron from "node-cron"
import { Movie } from "../models/movieModel"

export const startMovieStatusCron = () => {
  // Chạy hàng ngày lúc 0:00
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running movie status update cron job")
    try {
      const currentDate = new Date()
      const movies = await Movie.find({
        $or: [
          { status: { $in: ["upcoming", "nowPlaying"] } },
          { status: { $exists: false } },
        ],
      })

      for (const movie of movies) {
        if (
          !movie.activePeriod ||
          !movie.activePeriod.start ||
          !movie.activePeriod.end
        ) {
          continue // Bỏ qua nếu thiếu activePeriod
        }

        const startDate = new Date(movie.activePeriod.start)
        const endDate = new Date(movie.activePeriod.end)

        if (currentDate < startDate) {
          if (movie.status !== "upcoming") {
            movie.status = "upcoming"
            await movie.save()
            console.log(`Updated ${movie.title} to upcoming`)
          }
        } else if (currentDate >= startDate && currentDate <= endDate) {
          if (movie.status !== "nowPlaying") {
            movie.status = "nowPlaying"
            await movie.save()
            console.log(`Updated ${movie.title} to nowPlaying`)
          }
        } else if (currentDate > endDate) {
          if (movie.status !== "discontinued") {
            movie.status = "discontinued"
            await movie.save()
            console.log(`Updated ${movie.title} to discontinued`)
          }
        }
      }
    } catch (error) {
      console.error("Error in movie status cron job:", error)
    }
  })
}
