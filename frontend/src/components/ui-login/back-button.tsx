import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "@heroicons/react/24/outline"

import { useRouter } from "next/navigation"

const BackButton = () => {
  const router = useRouter()

  const handleBack = () => {
    router.push("/")
  }

  return (
    <Button
      variant="ghost"
      className="absolute top-4 left-4 p-2  text-white "
      onClick={handleBack}
    >
      <ArrowLeftIcon className="h-6 w-6 z-10" /> Go Back
    </Button>
  )
}

export default BackButton
