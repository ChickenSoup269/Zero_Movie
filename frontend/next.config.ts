/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "occ-0-58-325.1.nflxso.net",
      },
    ],
  },
}

module.exports = nextConfig
