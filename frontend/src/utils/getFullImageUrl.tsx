export const getFullImageUrl = (path: string): string => {
  if (!path) return "/default-avatar.png"
  if (path.startsWith("http") || path.startsWith("data:")) return path
  return `${process.env.NEXT_PUBLIC_IMAGES_API_URL}${path}`
}
