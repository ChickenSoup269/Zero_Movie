import type { Metadata } from "next"
import { Roboto } from "next/font/google"
import "./globals.css"

// thêm font
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-roboto",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Zero Movies",
  description: "Generated by create next app",
  icons: [
    { rel: "icon", type: "image/png", url: "/logo2.png" }, // icon web
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable}  antialiased`}>{children}</body>
    </html>
  )
}
