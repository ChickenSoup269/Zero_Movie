import { useToast } from "@/hooks/use-toast"

interface SuccessToastProps {
  title?: string
  description?: string
  duration?: number
}

export const SuccessToast = ({
  title = "Success!",
  description = "Operation completed successfully.",
  duration = 3000,
}: SuccessToastProps) => {
  const { toast } = useToast()

  const showToast = (p0?: { description: string }) => {
    toast({
      title,
      description,
      variant: "default",
      duration,
    })
  }

  return { showToast } // Trả về hàm để gọi thủ công
}
