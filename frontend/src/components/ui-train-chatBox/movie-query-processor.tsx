/* eslint-disable @typescript-eslint/no-explicit-any */
// MovieQueryProcessor.ts
import { MovieService } from "@/services/movieService"
import { GenreService } from "@/services/genreService"

// Phiên bản cải tiến của hàm validateMovieData
const validateMovieData = (movie) => {
  // Tạo một bản sao để tránh thay đổi object gốc nếu là tham chiếu
  const validatedMovie = { ...movie }

  // Kiểm tra tmdbId là undefined, null, hoặc không phải số
  if (
    validatedMovie.tmdbId === undefined ||
    validatedMovie.tmdbId === null ||
    Number.isNaN(Number(validatedMovie.tmdbId))
  ) {
    // Đặt giá trị mặc định là ID khác hoặc 0
    validatedMovie.tmdbId = validatedMovie.id ? Number(validatedMovie.id) : 0
  } else {
    // Chuyển đổi tmdbId thành số
    const numericTmdbId = Number(validatedMovie.tmdbId)

    // Kiểm tra lại để đảm bảo đã chuyển đổi thành công
    validatedMovie.tmdbId = Number.isNaN(numericTmdbId) ? 0 : numericTmdbId
  }

  return validatedMovie
}
export class MovieQueryProcessor {
  /**
   * Process movie-related queries and return appropriate responses
   * @param query User's query string
   * @returns Response to the query or null if not a movie-related query
   */
  static async processQuery(query: string): Promise<string | null> {
    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase().trim()

    // Movie count query
    if (
      lowerQuery.includes("bao nhiêu phim") ||
      lowerQuery.includes("số lượng phim") ||
      lowerQuery.includes("đếm số phim") ||
      lowerQuery.includes("tổng số phim") ||
      lowerQuery.includes("có mấy phim") ||
      lowerQuery.includes("có bao nhiêu bộ phim")
    ) {
      return this.getMovieCount()
    }

    // Featured movies query
    if (
      lowerQuery.includes("phim nổi bật") ||
      lowerQuery.includes("phim đáng xem") ||
      lowerQuery.includes("phim phổ biến") ||
      lowerQuery.includes("phim hay") ||
      lowerQuery.includes("phim được yêu thích")
    ) {
      return this.getFeaturedMovies()
    }

    // Latest movies query
    if (
      lowerQuery.includes("phim mới") ||
      lowerQuery.includes("phim mới nhất") ||
      lowerQuery.includes("phim gần đây") ||
      lowerQuery.includes("phim vừa ra mắt")
    ) {
      return this.getLatestMovies()
    }

    // Highest rated movies query
    if (
      lowerQuery.includes("phim đánh giá cao") ||
      lowerQuery.includes("phim hay nhất") ||
      lowerQuery.includes("phim top") ||
      lowerQuery.includes("phim xếp hạng cao")
    ) {
      return this.getHighestRatedMovies()
    }

    // Genre-related queries
    if (
      lowerQuery.includes("thể loại") ||
      lowerQuery.includes("loại phim") ||
      lowerQuery.includes("genre") ||
      lowerQuery.includes("danh mục")
    ) {
      return this.processGenreQuery(lowerQuery)
    }

    // Movie details query
    if (
      lowerQuery.includes("thông tin về phim") ||
      lowerQuery.includes("thông tin phim") ||
      lowerQuery.includes("chi tiết phim") ||
      lowerQuery.includes("nội dung phim") ||
      lowerQuery.includes("phim gì") ||
      lowerQuery.includes("mô tả phim")
    ) {
      return this.getMovieDetails(lowerQuery)
    }

    // Search for movies
    if (
      lowerQuery.includes("tìm phim") ||
      lowerQuery.includes("tìm kiếm phim") ||
      lowerQuery.includes("tìm bộ phim") ||
      lowerQuery.includes("phim có tên") ||
      lowerQuery.includes("phim tên là")
    ) {
      return this.searchMovies(lowerQuery)
    }

    // Upcoming movies query
    if (
      lowerQuery.includes("phim sắp chiếu") ||
      lowerQuery.includes("phim sắp ra mắt") ||
      lowerQuery.includes("phim sắp tới") ||
      lowerQuery.includes("lịch chiếu phim")
    ) {
      return this.getUpcomingMovies()
    }

    // Now playing movies query
    if (
      lowerQuery.includes("phim đang chiếu") ||
      lowerQuery.includes("phim hiện đang chiếu") ||
      lowerQuery.includes("phim hiện tại")
    ) {
      return this.getNowPlayingMovies()
    }

    // Help message for movie-related functionality
    if (
      lowerQuery.includes("bạn biết gì") ||
      lowerQuery.includes("bạn có thể làm gì") ||
      lowerQuery.includes("hướng dẫn") ||
      lowerQuery.includes("trợ giúp") ||
      lowerQuery.includes("help") ||
      lowerQuery.includes("giúp đỡ") ||
      lowerQuery === "help"
    ) {
      return this.getHelpMessage()
    }

    // If nothing matches, return null to use Gemini API
    return null
  }

  /**
   * Get the total count of movies in the system
   */
  private static async getMovieCount(): Promise<string> {
    try {
      const movies = await MovieService.getAllMovies()
      // Kiểm tra và sửa dữ liệu
      const validatedMovies = movies.map(validateMovieData)
      return `Hiện tại hệ thống có ${validatedMovies.length} phim.`
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về số lượng phim: ${error.message}`
    }
  }

  /**
   * Get the most featured/popular movies
   */
  private static async getFeaturedMovies(): Promise<string> {
    try {
      const movies = await MovieService.getAllMovies()
      // Validate dữ liệu trước khi sử dụng
      const validatedMovies = movies.map(validateMovieData)
      const featuredMovies = [...validatedMovies]
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 5)

      let response = "Những phim nổi bật hiện tại:\n"
      featuredMovies.forEach((movie, index) => {
        response += `${index + 1}. ${movie.title} (${movie.releaseDate.slice(
          0,
          4
        )}) - Đánh giá: ${movie.voteAverage.toFixed(1)}/10\n`
      })
      return response
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim nổi bật: ${error.message}`
    }
  }

  /**
   * Get the latest released movies
   */
  private static async getLatestMovies(): Promise<string> {
    try {
      const movies = await MovieService.getAllMovies()
      // Sort by release date
      const latestMovies = [...movies]
        .filter((movie) => movie.releaseDate) // Ensure release date exists
        .sort(
          (a, b) =>
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
        )
        .slice(0, 5)

      let response = "Những phim mới nhất:\n"
      latestMovies.forEach((movie, index) => {
        const releaseDate = new Date(movie.releaseDate)
        response += `${index + 1}. ${
          movie.title
        } - Ra mắt: ${releaseDate.toLocaleDateString("vi-VN")}\n`
      })
      return response
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim mới: ${error.message}`
    }
  }

  /**
   * Get the highest rated movies
   */
  private static async getHighestRatedMovies(): Promise<string> {
    try {
      const movies = await MovieService.getAllMovies()
      // Sort by vote average but only consider movies with sufficient votes
      const highRatedMovies = [...movies]
        .filter((movie) => movie.voteCount > 10) // Only movies with more than 10 votes
        .sort((a, b) => b.voteAverage - a.voteAverage)
        .slice(0, 5)

      let response = "Những phim có đánh giá cao nhất:\n"
      highRatedMovies.forEach((movie, index) => {
        response += `${index + 1}. ${
          movie.title
        } - Đánh giá: ${movie.voteAverage.toFixed(1)}/10 (${
          movie.voteCount
        } lượt)\n`
      })
      return response
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim đánh giá cao: ${error.message}`
    }
  }

  /**
   * Process queries related to movie genres
   */
  private static async processGenreQuery(lowerQuery: string): Promise<string> {
    // If asking for list of genres
    if (
      lowerQuery.includes("danh sách") ||
      lowerQuery.includes("liệt kê") ||
      lowerQuery.includes("tất cả") ||
      lowerQuery.includes("có những") ||
      lowerQuery.includes("là gì") ||
      lowerQuery.match(/^thể loại/)
    ) {
      try {
        const genres = await GenreService.getGenres()
        return `Hệ thống có ${genres.length} thể loại phim: ${genres
          .map((g) => g.name)
          .join(", ")}.`
      } catch (error: any) {
        return `Rất tiếc, tôi không thể lấy thông tin về thể loại phim: ${error.message}`
      }
    }

    // If asking for movies by genre
    const genreWords = lowerQuery.split(/\s+/)
    try {
      const genres = await GenreService.getGenres()
      const genreNames = genres.map((g) => g.name.toLowerCase())

      for (const genreWord of genreWords) {
        const matchedGenre = genreNames.find(
          (name) =>
            name.includes(genreWord) ||
            name.includes(genreWord.replace("phim", "").trim())
        )

        if (matchedGenre) {
          const exactGenre = genres.find(
            (g) => g.name.toLowerCase() === matchedGenre
          )
          if (exactGenre) {
            const movies = await GenreService.getMoviesByGenre(exactGenre.name)
            if (movies.length > 0) {
              return `Có ${movies.length} phim thuộc thể loại ${
                exactGenre.name
              }. Một số phim tiêu biểu:\n${movies
                .slice(0, 5)
                .map(
                  (m, i) =>
                    `${i + 1}. ${m.title} (${
                      m.releaseDate?.slice(0, 4) || "N/A"
                    })`
                )
                .join("\n")}${
                movies.length > 5 ? "\n...và nhiều phim khác." : ""
              }`
            } else {
              return `Hiện tại không có phim nào thuộc thể loại ${exactGenre.name}.`
            }
          }
        }
      }
      return "Không tìm thấy thể loại phim phù hợp với yêu cầu của bạn."
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim theo thể loại: ${error.message}`
    }
  }

  /**
   * Get detailed information about a specific movie
   */
  private static async getMovieDetails(lowerQuery: string): Promise<string> {
    try {
      // Extract movie title
      let movieTitle = ""
      if (lowerQuery.includes("thông tin về phim")) {
        movieTitle = lowerQuery.split("thông tin về phim")[1].trim()
      } else if (lowerQuery.includes("thông tin phim")) {
        movieTitle = lowerQuery.split("thông tin phim")[1].trim()
      } else if (lowerQuery.includes("chi tiết phim")) {
        movieTitle = lowerQuery.split("chi tiết phim")[1].trim()
      } else if (lowerQuery.includes("nội dung phim")) {
        movieTitle = lowerQuery.split("nội dung phim")[1].trim()
      } else if (lowerQuery.includes("mô tả phim")) {
        movieTitle = lowerQuery.split("mô tả phim")[1].trim()
      }

      if (movieTitle) {
        const movies = await MovieService.searchMovies(movieTitle)
        if (movies.length > 0) {
          const movie = movies[0] // Get the first match

          // Get genre names
          const genreMap = await GenreService.getGenreMap()
          const genreNames = movie.genreIds
            .map((id) => genreMap[id] || "")
            .filter(Boolean)

          let response = `Thông tin chi tiết về phim "${movie.title}":\n\n`
          response += `📅 Năm phát hành: ${
            movie.releaseDate
              ? movie.releaseDate.slice(0, 4)
              : "Không có thông tin"
          }\n`
          response += `⭐ Đánh giá: ${movie.voteAverage.toFixed(1)}/10 (${
            movie.voteCount
          } lượt)\n`
          response += `🎭 Thể loại: ${
            genreNames.join(", ") || "Không có thông tin"
          }\n`

          if (movie.director) {
            response += `🎬 Đạo diễn: ${movie.director}\n`
          }

          if (movie.runtime) {
            const hours = Math.floor(movie.runtime / 60)
            const minutes = movie.runtime % 60
            response += `⏱️ Thời lượng: ${hours > 0 ? `${hours} giờ ` : ""}${
              minutes > 0 ? `${minutes} phút` : ""
            }\n`
          }

          if (movie.overview) {
            response += `\n📝 Tóm tắt: ${movie.overview}\n`
          }

          return response
        } else {
          return `Không tìm thấy thông tin về phim "${movieTitle}".`
        }
      }
      return "Vui lòng cung cấp tên phim cụ thể để tìm thông tin chi tiết."
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin chi tiết về phim: ${error.message}`
    }
  }

  /**
   * Search for movies by name
   */
  /**
   * Search for movies by name - phiên bản cải tiến với xử lý lỗi tốt hơn
   */
  private static async searchMovies(lowerQuery: string): Promise<string> {
    let searchTerm = ""

    if (lowerQuery.includes("tìm phim")) {
      searchTerm = lowerQuery.split("tìm phim")[1].trim()
    } else if (lowerQuery.includes("tìm kiếm phim")) {
      searchTerm = lowerQuery.split("tìm kiếm phim")[1].trim()
    } else if (lowerQuery.includes("tìm bộ phim")) {
      searchTerm = lowerQuery.split("tìm bộ phim")[1].trim()
    } else if (lowerQuery.includes("phim có tên")) {
      searchTerm = lowerQuery.split("phim có tên")[1].trim()
    } else if (lowerQuery.includes("phim tên là")) {
      searchTerm = lowerQuery.split("phim tên là")[1].trim()
    }

    if (!searchTerm) {
      return "Vui lòng cung cấp tên phim cần tìm kiếm."
    }

    try {
      console.log(`Đang tìm kiếm phim với từ khóa: "${searchTerm}"`)
      const movies = await MovieService.searchMovies(searchTerm)

      // Kiểm tra và xác thực các phim trả về
      if (!movies || !Array.isArray(movies)) {
        console.error("Định dạng dữ liệu không đúng khi tìm kiếm phim:", movies)
        return `Có lỗi xảy ra khi tìm kiếm phim "${searchTerm}". Vui lòng thử lại sau.`
      }

      if (movies.length > 0) {
        return `Tìm thấy ${
          movies.length
        } phim liên quan đến "${searchTerm}":\n${movies
          .slice(0, 7)
          .map(
            (m, i) =>
              `${i + 1}. ${m.title} (${m.releaseDate?.slice(0, 4) || "N/A"})`
          )
          .join("\n")}${movies.length > 7 ? "\n...và các phim khác." : ""}`
      } else {
        return `Không tìm thấy phim nào có tên "${searchTerm}".`
      }
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm phim:", error)

      // Xử lý lỗi cụ thể liên quan đến tmdbId
      if (
        error.message &&
        error.message.includes("Cast to Number failed") &&
        error.message.includes("tmdbId")
      ) {
        return `Rất tiếc, đã xảy ra lỗi khi xử lý dữ liệu phim. Đội ngũ kỹ thuật sẽ khắc phục sớm.`
      }

      return `Rất tiếc, tôi không thể tìm kiếm phim: ${
        error.message || "Đã xảy ra lỗi không xác định"
      }`
    }
  }

  /**
   * Get upcoming movies
   */
  private static async getUpcomingMovies(): Promise<string> {
    try {
      const movies = await MovieService.getAllMovies()
      const upcomingMovies = movies
        .filter((movie) => movie.status === "upcoming")
        .slice(0, 5)

      if (upcomingMovies.length > 0) {
        let response = "Phim sắp chiếu:\n"
        upcomingMovies.forEach((movie, index) => {
          response += `${index + 1}. ${movie.title} - Dự kiến: ${
            movie.releaseDate
              ? new Date(movie.releaseDate).toLocaleDateString("vi-VN")
              : "Chưa công bố"
          }\n`
        })
        return response
      } else {
        return "Hiện tại không có thông tin về phim sắp chiếu."
      }
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim sắp chiếu: ${error.message}`
    }
  }

  /**
   * Get now playing movies
   */
  private static async getNowPlayingMovies(): Promise<string> {
    try {
      const movies = await MovieService.getAllMovies()
      const nowPlayingMovies = movies
        .filter((movie) => movie.status === "nowPlaying")
        .slice(0, 5)

      if (nowPlayingMovies.length > 0) {
        let response = "Phim đang chiếu:\n"
        nowPlayingMovies.forEach((movie, index) => {
          response += `${index + 1}. ${movie.title}\n`
        })
        return response
      } else {
        return "Hiện tại không có thông tin về phim đang chiếu."
      }
    } catch (error: any) {
      return `Rất tiếc, tôi không thể lấy thông tin về phim đang chiếu: ${error.message}`
    }
  }

  /**
   * Get help message with available commands
   */
  private static getHelpMessage(): string {
    return `Tôi có thể giúp bạn với các thông tin về phim:

1. Số lượng phim: "Có bao nhiêu phim?"
2. Danh sách thể loại: "Liệt kê các thể loại phim"
3. Tìm phim theo tên: "Tìm phim Avengers"
4. Thông tin chi tiết: "Thông tin phim The Godfather"
5. Phim theo thể loại: "Phim hành động"
6. Phim mới nhất: "Phim mới nhất"
7. Phim được đánh giá cao: "Phim đánh giá cao"
8. Phim phổ biến: "Phim nổi bật"
9. Phim sắp chiếu: "Phim sắp chiếu"
10. Phim đang chiếu: "Phim đang chiếu"

Bạn có thể hỏi bất kỳ câu hỏi nào liên quan đến phim!`
  }
}
