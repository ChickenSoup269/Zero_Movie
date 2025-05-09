/* eslint-disable @typescript-eslint/no-explicit-any */
import { MovieService } from "@/services/movieService"
import { GenreService } from "@/services/genreService"

// Phiên bản cải tiến của hàm validateMovieData
const validateMovieData = (movie: any) => {
  const validatedMovie = { ...movie }
  if (
    validatedMovie.tmdbId === undefined ||
    validatedMovie.tmdbId === null ||
    Number.isNaN(Number(validatedMovie.tmdbId)) ||
    validatedMovie.tmdbId <= 0
  ) {
    console.warn(
      `Invalid tmdbId for movie ${validatedMovie.title || "unknown"}: ${
        validatedMovie.tmdbId
      }`
    )
    return null
  }
  validatedMovie.tmdbId = Number(validatedMovie.tmdbId)
  return validatedMovie
}

export class MovieQueryProcessor {
  /**
   * Process movie-related queries and return appropriate responses
   * @param query User's query string
   * @param userId User's ID for personalized recommendations
   * @returns Response to the query or null if not a movie-related query
   */
  static async processQuery(query: string, userId?: string): Promise<any> {
    const lowerQuery = query.toLowerCase().trim()

    // Kiểm tra truy vấn có chứa từ vô nghĩa dài
    const hasInvalidPrefix = /^\w{5,}\s/i.test(lowerQuery)
    if (hasInvalidPrefix) {
      console.log("Truy vấn không hợp lệ, chứa từ vô nghĩa:", lowerQuery)
      return null // Chuyển sang Gemini API
    }

    // Đặt vé phim (hỗ trợ biến thể "tôi muốn đặt vé" và "tôi muốn đặt vé phim")
    const ticketBookingRegex =
      /(?:tôi muốn đặt vé|đặt vé phim)(?:\s*phim)?\s+(.+)/i
    const ticketMatch = lowerQuery.match(ticketBookingRegex)
    if (ticketMatch) {
      const movieTitle = ticketMatch[1].trim()
      return this.processTicketBooking(movieTitle)
    }

    // Xem chi tiết phim
    if (
      lowerQuery.includes("tôi muốn xem chi tiết") ||
      lowerQuery.includes("xem chi tiết phim")
    ) {
      return this.getMovieDetailsWithLink(lowerQuery)
    }

    // Gợi ý phim
    if (
      lowerQuery.includes("phim phù hợp với tui") ||
      lowerQuery.includes("gợi ý phim cho tôi") ||
      lowerQuery.includes("phim đề xuất") ||
      lowerQuery.includes("phim nên xem")
    ) {
      return this.getPersonalizedRecommendations(userId)
    }

    // Phim theo thể loại
    if (
      lowerQuery.includes("phim thể loại") ||
      lowerQuery.includes("tìm phim thể loại") ||
      lowerQuery.includes("phim thuộc thể loại")
    ) {
      return this.getMoviesByGenre(lowerQuery)
    }

    // Số lượng phim
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

    // Phim nổi bật
    if (
      lowerQuery.includes("phim nổi bật") ||
      lowerQuery.includes("phim đáng xem") ||
      lowerQuery.includes("phim phổ biến") ||
      lowerQuery.includes("phim hay") ||
      lowerQuery.includes("phim được yêu thích")
    ) {
      return this.getFeaturedMovies()
    }

    // Phim mới nhất
    if (
      lowerQuery.includes("phim mới") ||
      lowerQuery.includes("phim mới nhất") ||
      lowerQuery.includes("phim gần đây") ||
      lowerQuery.includes("phim vừa ra mắt")
    ) {
      return this.getLatestMovies()
    }

    // Phim đánh giá cao
    if (
      lowerQuery.includes("phim đánh giá cao") ||
      lowerQuery.includes("phim hay nhất") ||
      lowerQuery.includes("phim top") ||
      lowerQuery.includes("phim xếp hạng cao")
    ) {
      return this.getHighestRatedMovies()
    }

    // Thông tin thể loại
    if (
      lowerQuery.includes("thể loại") ||
      lowerQuery.includes("loại phim") ||
      lowerQuery.includes("genre") ||
      lowerQuery.includes("danh mục")
    ) {
      return this.processGenreQuery(lowerQuery)
    }

    // Thông tin chi tiết phim
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

    // Tìm kiếm phim
    if (
      lowerQuery.includes("tìm phim") ||
      lowerQuery.includes("tìm kiếm phim") ||
      lowerQuery.includes("tìm bộ phim") ||
      lowerQuery.includes("phim có tên") ||
      lowerQuery.includes("phim tên là")
    ) {
      return this.searchMovies(lowerQuery)
    }

    // Phim sắp chiếu
    if (
      lowerQuery.includes("phim sắp chiếu") ||
      lowerQuery.includes("phim sắp ra mắt") ||
      lowerQuery.includes("phim sắp tới") ||
      lowerQuery.includes("lịch chiếu phim")
    ) {
      return this.getUpcomingMovies()
    }

    // Phim đang chiếu
    if (
      lowerQuery.includes("phim đang chiếu") ||
      lowerQuery.includes("phim hiện đang chiếu") ||
      lowerQuery.includes("phim hiện tại")
    ) {
      return this.getNowPlayingMovies()
    }

    // Hướng dẫn sử dụng
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

    return null
  }

  /**
   * Get movie details with a link and poster for "xem chi tiết" queries
   */
  private static async getMovieDetailsWithLink(
    lowerQuery: string
  ): Promise<any> {
    try {
      let movieTitle = ""
      if (lowerQuery.includes("tôi muốn xem chi tiết")) {
        movieTitle = lowerQuery.split("tôi muốn xem chi tiết")[1].trim()
      } else if (lowerQuery.includes("xem chi tiết phim")) {
        movieTitle = lowerQuery.split("xem chi tiết phim")[1].trim()
      }

      if (!movieTitle) {
        return { message: "Vui lòng cung cấp tên phim cụ thể để xem chi tiết." }
      }

      const movies = await MovieService.searchMovies(movieTitle)
      if (movies.length === 0) {
        return {
          message: `Không tìm thấy phim "${movieTitle}". Vui lòng kiểm tra lại tên phim.`,
        }
      }

      const movie = movies[0]
      if (!movie.tmdbId) {
        return { message: `Phim "${movie.title}" không có tmdbId hợp lệ.` }
      }

      const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
        : "/placeholder-image.jpg"
      const detailsLink = `http://localhost:3000/details-movies/${movie.tmdbId}`
      const message =
        `Thông tin phim "${movie.title}":\n\n` +
        `📅 Năm phát hành: ${
          movie.releaseDate
            ? movie.releaseDate.slice(0, 4)
            : "Không có thông tin"
        }`

      return {
        message,
        imageUrl: posterUrl,
        link: { url: detailsLink, text: "Xem chi tiết" },
      }
    } catch (error: any) {
      return {
        message: `Rất tiếc, không thể lấy thông tin chi tiết phim: ${error.message}`,
      }
    }
  }

  /**
   * Process ticket booking queries
   */
  private static async processTicketBooking(movieTitle: string): Promise<any> {
    try {
      // Kiểm tra tên phim hợp lệ
      if (!movieTitle || movieTitle.length < 2 || /^\W+$/.test(movieTitle)) {
        return { message: "Vui lòng cung cấp tên phim hợp lệ để đặt vé." }
      }

      const movies = await MovieService.searchMovies(movieTitle)
      if (movies.length === 0) {
        return {
          message: `Không tìm thấy phim "${movieTitle}". Vui lòng kiểm tra lại tên phim.`,
        }
      }

      const movie = movies[0]
      const validatedMovie = validateMovieData(movie)
      if (!validatedMovie) {
        return { message: `Phim "${movie.title}" không có tmdbId hợp lệ.` }
      }

      if (movie.status !== "nowPlaying") {
        return {
          message: `Phim "${movie.title}" hiện không phải phim đang chiếu. Vui lòng chọn phim khác hoặc xem lịch chiếu.`,
        }
      }

      const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
        : "/placeholder-image.jpg"
      const detailsLink = `http://localhost:3000/details-movies/${movie.tmdbId}`
      const message =
        `Để đặt vé xem phim "${movie.title}":\n\n` +
        `📋 Quy trình đặt vé:\n` +
        `1. Chọn rạp\n` +
        `2. Chọn phòng\n` +
        `3. Chọn thời gian chiếu\n` +
        `4. Chọn ghế\n` +
        `5. Thanh toán\n` +
        `⚠️ Lưu ý: Hiện nay chỉ nhận thanh toán PayPal`

      return {
        message,
        imageUrl: posterUrl,
        link: { url: detailsLink, text: "Xem chi tiết" },
      }
    } catch (error: any) {
      return {
        message: `Rất tiếc, không thể xử lý yêu cầu đặt vé: ${error.message}`,
      }
    }
  }

  /**
   * Get personalized movie recommendations
   */
  private static async getPersonalizedRecommendations(
    userId?: string
  ): Promise<any> {
    try {
      if (!userId) {
        return {
          message: "Vui lòng đăng nhập để nhận gợi ý phim phù hợp với bạn.",
        }
      }

      const movies = await MovieService.getRecommendations(userId)
      if (movies.length === 0) {
        return {
          message:
            "Hiện tại không có gợi ý phim nào phù hợp với bạn. Hãy thử tìm kiếm phim theo thể loại!",
        }
      }

      const movie = movies[0] // Show the top recommendation
      if (!movie.tmdbId) {
        return {
          message: `Phim gợi ý "${movie.title}" không có tmdbId hợp lệ.`,
        }
      }

      const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
        : "/placeholder-image.jpg"
      const detailsLink = `http://localhost:3000/details-movies/${movie.tmdbId}`
      const message =
        `Phim gợi ý cho bạn: "${movie.title}"\n\n` +
        `📅 Năm phát hành: ${
          movie.releaseDate
            ? movie.releaseDate.slice(0, 4)
            : "Không có thông tin"
        }\n` +
        `⭐ Đánh giá: ${movie.voteAverage.toFixed(1)}/10`

      return {
        message,
        imageUrl: posterUrl,
        link: { url: detailsLink, text: "Xem chi tiết" },
      }
    } catch (error: any) {
      return { message: `Rất tiếc, không thể lấy gợi ý phim: ${error.message}` }
    }
  }

  /**
   * Get movies by genre
   */
  private static async getMoviesByGenre(lowerQuery: string): Promise<any> {
    try {
      let genreName = ""
      if (lowerQuery.includes("phim thể loại")) {
        genreName = lowerQuery.split("phim thể loại")[1].trim()
      } else if (lowerQuery.includes("tìm phim thể loại")) {
        genreName = lowerQuery.split("tìm phim thể loại")[1].trim()
      } else if (lowerQuery.includes("phim thuộc thể loại")) {
        genreName = lowerQuery.split("phim thuộc thể loại")[1].trim()
      }

      if (!genreName) {
        return {
          message:
            "Vui lòng cung cấp thể loại phim cụ thể (ví dụ: hài, hành động).",
        }
      }

      const genres = await GenreService.getGenres()
      const matchedGenre = genres.find((g) =>
        g.name.toLowerCase().includes(genreName)
      )
      if (!matchedGenre) {
        return {
          message: `Không tìm thấy thể loại "${genreName}". Hãy thử với thể loại khác như hài, hành động, hoặc tình cảm.`,
        }
      }

      const movies = await GenreService.getMoviesByGenre(matchedGenre.name)
      if (movies.length === 0) {
        return {
          message: `Hiện tại không có phim nào thuộc thể loại "${matchedGenre.name}" trong hệ thống.`,
        }
      }

      const movie = movies[0] // Show the first movie
      if (!movie.tmdbId) {
        return { message: `Phim "${movie.title}" không có tmdbId hợp lệ.` }
      }

      const posterUrl = movie.posterPath
        ? `https://image.tmdb.org/t/p/w200${movie.posterPath}`
        : "/placeholder-image.jpg"
      const detailsLink = `http://localhost:3000/details-movies/${movie.tmdbId}`
      const message =
        `Phim thuộc thể loại "${matchedGenre.name}": "${movie.title}"\n\n` +
        `📅 Năm phát hành: ${
          movie.releaseDate
            ? movie.releaseDate.slice(0, 4)
            : "Không có thông tin"
        }\n` +
        `⭐ Đánh giá: ${movie.voteAverage.toFixed(1)}/10`

      return {
        message,
        imageUrl: posterUrl,
        link: { url: detailsLink, text: "Xem chi tiết" },
      }
    } catch (error: any) {
      return {
        message: `Rất tiếc, không thể tìm phim theo thể loại: ${error.message}`,
      }
    }
  }

  /**
   * Get the total count of movies in the system
   */
  private static async getMovieCount(): Promise<string> {
    try {
      const movies = await MovieService.getAllMovies()
      const validatedMovies = movies.map(validateMovieData).filter(Boolean)
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
      const validatedMovies = movies.map(validateMovieData).filter(Boolean)
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
      const latestMovies = [...movies]
        .filter((movie) => movie.releaseDate)
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
      const highRatedMovies = [...movies]
        .filter((movie) => movie.voteCount > 10)
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
          const movie = movies[0]
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
      const validatedMovies = movies
        .map(validateMovieData)
        .filter((movie) => movie !== null)

      if (validatedMovies.length > 0) {
        return `Tìm thấy ${
          validatedMovies.length
        } phim liên quan đến "${searchTerm}":\n${validatedMovies
          .slice(0, 7)
          .map(
            (m, i) =>
              `${i + 1}. ${m.title} (${m.releaseDate?.slice(0, 4) || "N/A"})`
          )
          .join("\n")}${
          validatedMovies.length > 7 ? "\n...và các phim khác." : ""
        }`
      } else {
        return `Không tìm thấy phim nào có tên "${searchTerm}".`
      }
    } catch (error: any) {
      console.error("Lỗi khi tìm kiếm phim:", error)
      if (
        error.message &&
        error.message.includes("Cast to Number failed") &&
        error.message.includes("tmdbId")
      ) {
        return `Rất tiếc, dữ liệu phim chứa lỗi (tmdbId không hợp lệ). Đã thông báo đội kỹ thuật. Vui lòng thử lại sau.`
      }
      return `Rất tiếc, không thể tìm kiếm phim: ${
        error.response?.data?.message || error.message || "Lỗi không xác định"
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

  private static getHelpMessage(): string {
    return `Tôi có thể giúp bạn với các thông tin về phim và nhiều chủ đề khác:

1. Số lượng phim: "Có bao nhiêu phim?"
2. Danh sách thể loại: "Liệt kê các thể loại phim"
3. Tìm phim theo tên: "Tìm phim Avengers"
4. Thông tin chi tiết: "Thông tin phim The Godfather"
5. Xem chi tiết phim: "Tôi muốn xem chi tiết The Godfather"
6. Đặt vé phim: "Tôi muốn đặt vé The Godfather"
7. Phim theo thể loại: "Phim thể loại hài"
8. Gợi ý phim: "Phim phù hợp với tui"
9. Phim mới nhất: "Phim mới nhất"
10. Phim được đánh giá cao: "Phim đánh giá cao"
11. Phim phổ biến: "Phim nổi bật"
12. Phim sắp chiếu: "Phim sắp chiếu"
13. Phim đang chiếu: "Phim đang chiếu"

Ngoài ra, bạn có thể hỏi bất kỳ câu hỏi nào, từ âm nhạc, lịch sử, đến công nghệ!`
  }
}
