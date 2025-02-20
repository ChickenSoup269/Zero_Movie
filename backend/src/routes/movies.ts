import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";
const MAX_PAGES = 5;

router.get("/all", async (req, res) => {
  try {
    let allMovies: any[] = [];
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages && currentPage <= MAX_PAGES) {
      const response = await axios.get(`${BASE_URL}/movie/popular`, {
        params: { api_key: TMDB_API_KEY, language: "vi-VN", page: currentPage },
      });

      allMovies = [...allMovies, ...response.data.results];
      totalPages = response.data.total_pages;
      currentPage++;
    }

    res.json({ movies: allMovies, total: allMovies.length });
  } catch (error) {
    console.error("Lỗi khi fetch dữ liệu từ TMDB:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
});

export default router;
