export default function Home() {
  return (
    <div className="min-h-screen  text-black  dark:text-white">
      {/* Nội dung chính */}
      <div className="pt-20 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Trang chủ</h1>

        {/* Nội dung giả để scroll */}
        <section className="max-w-3xl mx-auto space-y-6">
          <p className="text-lg">
            Chào mừng bạn đến với trang chủ! Đây là một đoạn văn mẫu để kiểm tra
            hiệu ứng cuộn của navbar. Bạn có thể cuộn xuống để xem navbar thay
            đổi từ trong suốt sang màu đen.
          </p>

          <div className="h-96 bg-blue-200 dark:bg-blue-800 rounded-lg flex items-center justify-center">
            <span className="text-xl">Khối nội dung cao 96 đơn vị</span>
          </div>

          <p className="text-lg">
            Tiếp tục cuộn xuống để xem thêm nội dung. Navbar sẽ đổi màu khi bạn
            cuộn quá 50px từ đầu trang. Nội dung này chỉ là giả lập để tạo chiều
            dài cho trang.
          </p>

          <div className="h-96 bg-green-200 dark:bg-green-800 rounded-lg flex items-center justify-center">
            <span className="text-xl">Khối nội dung khác</span>
          </div>

          <p className="text-lg">
            Đây là đoạn cuối cùng. Bạn có thể thấy navbar đã đổi màu khi cuộn
            đến đây. Nếu muốn điều chỉnh, cứ bảo mình nhé!
          </p>

          <div className="h-96 bg-red-200 dark:bg-red-800 rounded-lg flex items-center justify-center">
            <span className="text-xl">Khối nội dung cuối</span>
          </div>
        </section>
      </div>
    </div>
  )
}
