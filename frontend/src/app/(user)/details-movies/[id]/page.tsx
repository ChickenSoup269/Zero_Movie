export default function MovieDetails({ params }: { params: { id: string } }) {
  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Chi tiết phim</h1>
      <p className="text-lg mt-2">ID phim: {params.id}</p>
    </div>
  )
}
