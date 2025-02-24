import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button"
import { Link } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <Button asChild>
        <Link href="/login">Login</Link>
      </Button> */}
      <Button>xin chào</Button>
      <Switch />

      <Link className={buttonVariants({ variant: "outline" })}>Click here</Link>
    </div>
  )
}
