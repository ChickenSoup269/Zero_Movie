/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Danh sách domain được phép tải ảnh (đã được tối ưu)
    domains: [
      "image.tmdb.org",
      "raw.githubusercontent.com",
      "www.edigitalagency.com.au",
    ],

    // Cấu hình nâng cao cho các host cụ thể
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3001",
        pathname: "/uploads/**",
      },
      // Thêm pattern cho TMDB
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        pathname: "/t/p/**",
      },
      // Pattern cho Netflix
    ],

    // Tối ưu hiệu năng hình ảnh
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60, // 60 giây
    formats: ["image/webp"], // Ưu tiên webp
    dangerouslyAllowSVG: false, // Tắt SVG nếu không cần
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Tắt cảnh báo eslint trong quá trình build (nếu cần)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Tắt cảnh báo typescript (nếu cần)
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig
