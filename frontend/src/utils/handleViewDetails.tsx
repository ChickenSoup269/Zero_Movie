// src/utils/movie-utils.ts
import { useRouter } from "next/navigation"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface Movie {
  status: "nowPlaying" | "upcoming"
  tmdbId: number
  title?: string
}

export const handleViewDetails = (
  movie: Movie,
  router: ReturnType<typeof useRouter>,
  toast: ReturnType<typeof useToast>
) => {
  console.log("Navigating to details with tmdbId:", movie.tmdbId)
  if (movie.status === "upcoming") {
    toast({
      title: "Hey!",
      description: "The movie has no release date yet :(",
      variant: "default",
      action: <ToastAction altText="Try again">I'm cook</ToastAction>,
    })
  } else {
    router.push(`/details-movies/${movie.tmdbId}`)
  }
}
