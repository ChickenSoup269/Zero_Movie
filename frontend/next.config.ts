/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "occ-0-58-325.1.nflxso.net",
      "raw.githubusercontent.com",
      "cdn-icons-png.flaticon.com",
      "www.edigitalagency.com.au",
      "image.tmdb.org",
      "localhost",
    ],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/api/uploads/**",
      },
    ],

    // Cho phép tải ảnh từ Netflix CDN
  },
}

module.exports = nextConfig
