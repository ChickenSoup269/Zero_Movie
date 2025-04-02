import { useToast } from "@/hooks/use-toast"

interface ErrorToastProps {
  title?: string
  description?: string
  duration?: number
}

export const ErrorToast = ({
  title = "Error",
  description = "Something went wrong.",
  duration = 3000,
}: ErrorToastProps) => {
  const { toast } = useToast()

  const showToast = () => {
    toast({
      title,
      description,
      variant: "destructive",
      duration,
    })
  }

  return { showToast } // Trả về hàm để gọi thủ công
}
