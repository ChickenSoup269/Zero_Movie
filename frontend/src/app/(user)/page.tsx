"use client"

import FullImageSlider from "@/components/ui-home/full-image-slider"
import Movies from "@/components/ui-home/movies"
import { moviesData } from "@/data/moviesData"

export default function Home() {
  return (
    <div className="min-h-screen  text-white">
      {/* SLide ảnh full componeent */}
      <FullImageSlider slides={moviesData} />
      <Movies slides={moviesData} />
    </div>
  )
}
