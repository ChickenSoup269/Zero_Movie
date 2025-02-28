export default function AboutUs() {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Phần hình ảnh bên trái */}
          <div className="w-full md:w-1/2">
            {/* <img
              src="" // Thay bằng đường dẫn hình ảnh thực tế
              alt="Zero Movies Experience"
              className="w-full h-auto rounded-lg shadow-lg object-cover"
              style={{ maxHeight: "400px" }}
            /> */}
          </div>

          {/* Phần chữ bên phải */}
          <div className="w-full md:w-1/2 space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">
              About Zero Movies
            </h2>

            <p className="text-gray-600 leading-relaxed">
              Zero Movies là một nền tảng đặt vé xem phim trực tuyến, giúp cho
              người dùng dễ dàng tìm kiếm, đặt vé và trải nghiệm rạp chiếu phim
              theo cách hiện đại nhất. Với sự kết hợp giữa AI và công nghệ 3D
              View, người dùng không chỉ đặt vé mà còn có thể xem trước góc nhìn
              thực tế từ ghế mình chọn hướng về màn hình.
            </p>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Các tính năng chính
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#DF0707] mr-2 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Đặt vé xem phim online:</strong> Chọn phim, suất
                    chiếu, ghế ngồi và thanh toán dễ dàng.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#DF0707] mr-2 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Tích hợp AI:</strong> Đề xuất phim dựa trên sở thích
                    và lịch sử xem của người dùng.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#DF0707] mr-2 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>3D View từ ghế ngồi:</strong> Trải nghiệm góc nhìn
                    thực tế từ ghế đã chọn trước khi đặt vé.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#DF0707] mr-2 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Quản lý tài khoản:</strong> Lịch sử đặt vé, ưu đãi
                    thành viên, ví điện tử.
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-5 h-5 text-[#DF0707] mr-2 mt-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>
                    <strong>Tích hợp API rạp phim:</strong> Cập nhật suất chiếu
                    theo thời gian thực.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
