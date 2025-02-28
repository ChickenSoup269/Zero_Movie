/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["occ-0-58-325.1.nflxso.net", "raw.githubusercontent.com"],
    // Cho phép tải ảnh từ Netflix CDN
  },
}

module.exports = nextConfig
