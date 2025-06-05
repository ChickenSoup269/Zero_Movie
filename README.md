<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/logo.png?raw=true" alt="drawing" width="500"/> </p>

# Zero Movie - Next.js Project [![My Skills](https://skillicons.dev/icons?i=nextjs)](https://skillicons.dev)

<p align="center">
   
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/) 
</p>

# Mục lục dự án Zero Movie

## 1. Giới thiệu

- [Thông tin tổng quan về Zero Movie](#giới-thiệu)
- [Mục tiêu dự án](#giới-thiệu)

## 2. Tính năng chính

- [Đặt vé xem phim online](#các-tính-năng-chính)
- [Tích hợp AI gợi ý phim](#các-tính-năng-chính)
- [3D View từ ghế ngồi](#các-tính-năng-chính)
- [Quản lý tài khoản](#các-tính-năng-chính)
- [Tích hợp API rạp phim](#các-tính-năng-chính)
- [Tích hợp API Gemini hỗ trợ người dùng](#các-tính-năng-chính)

## 3. Công nghệ sử dụng

- [Danh sách công nghệ và phiên bản](#công-nghệ-sử-dụng)
- [Framework và thư viện chính](#công-nghệ-sử-dụng)

## 4. Hướng dẫn cài đặt và chạy dự án

- [Cài đặt dependencies](#1-cài-đặt-dependencies-của-frontend--backend)
- [Chạy dự án](#2-chạy-dự-án)
- [Build dự án](#3-build-dự-án)
- [Clone dự án](#bổ-sung-nếu-clone-về-máy)
- [Cài đặt module AI gợi ý phim](#4-cần-tải-thêm-folder-python-này-có-hướng-dẫn-ở-readmemd-nằm-cùng-cấp-với-zeromovies)

## 5. Cấu hình môi trường

- [Cấu hình .env frontend](#file-env-frontend)
- [Cấu hình .env backend](#file-env-backend)

## 6. Cấu trúc thư mục

- [Sơ đồ tổng quan thư mục dự án](#6-tổng-quan-về-thư-mục-đồ-án)

## 7. Ảnh chụp màn hình

- [Trang chính](#7-screenshots)
- [Chi tiết phim](#7-screenshots)
- [Xem trailer](#7-screenshots)
- [Bình luận](#7-screenshots)
- [Chi tiết rạp](#7-screenshots)

## 8. Thông tin khác

- [Tổng số code](#8-tổng-số-code)
- [Kiểm tra dữ liệu](#9-check-dữ-liệu-tại-đây)
- [Tài khoản PayPal sandbox](#10-tài-khoản-paypal-ở-môi-trường-sanbox-nếu-cần-hãy-liên-hệ)

## Giới thiệu

**Zero Movie** là một nền tảng đặt vé xem phim trực tuyến, giúp cho người dùng dễ dàng tìm kiếm, đặt vé và trải nghiệm rạp chiếu phim theo cách hiện đại nhất. Với sự kết hợp giữa AI và công nghệ 3D View, người dùng không chỉ đặt vé mà còn có thể xem trước góc nhìn thực tế từ ghế mình chọn hướng về màn hình.

## Các tính năng chính

- **Đặt vé xem phim online:** Chọn phim, suất chiếu, ghế ngồi và thanh toán dễ dàng.

- **Tích hợp AI:** Đề xuất phim dựa trên sở thích và lịch sử xem của người dùng.

- **3D View từ ghế ngồi:** Trải nghiệm góc nhìn thực tế từ ghế đã chọn trước khi đặt vé.

- **Quản lý tài khoản:** Lịch sử đặt vé, ưu đãi thành viên, ví điện tử.

- **Tích hợp API rạp phim:** Cập nhật suất chiếu theo thời gian thực.

- **Tích hợp API Gemini để hỗ trợ user:** User có thể hỏi tất cả những gì liên quan đến phim

## Công nghệ sử dụng

**Tech & version:**  
[![Generic badge](https://img.shields.io/badge/nextjs-15.3.0-white.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/tailwind-3.4.1-blue.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/react-19.0.0-blue.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/framer--motion-12.4.10-purple.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/three.js-0.176.0-green.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/typescript-5-blue.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/MongoDB-none-1abc9c.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/shadcn%2Fui-latest-black.svg)](https://shields.io/)
[![Generic badge](https://img.shields.io/badge/emailjs-4.4.1-orange.svg)](https://shields.io/)

- **Next.js:** Xây dựng giao diện web nhanh chóng và tối ưu.

- **Tailwind CSS:** Tùy chỉnh giao diện đẹp mắt, hiện đại.

- **Three.js:** Hiển thị mô phỏng 3D View ghế ngồi.

- **API AI Gemini:** Giải đáp thắc mắc cho người dùng

- **AI Recommendation System:** Gợi ý phim phù hợp với người dùng.

- **MongoDB:** Lưu trữ dữ liệu người dùng, vé đặt, lịch chiếu.

## Hướng dẫn cài đặt và chạy dự án

## 1. Cần tải thêm folder python này có hướng dẫn ở README.md [nằm cùng cấp với zeroMovies]

https://github.com/ChickenSoup269/recommendationMovies

### Nếu có lỗi do python thì copy đoạn này vào folder backend src/conntrollers/movieController.ts

```bash
 // Gọi script Python
      const { stdout } = await execPromise(
        `python3 ..\\..\\recommendationMovies-main\\models\\recommend.py ${userId}`
      )
```

## 2. Bổ sung file .env

Để chạy được đồ án bạn các bạn cần liên hệ với nhóm để lấy được key api

### file .env [frontend]

```bash
NEXT_PUBLIC_API_URL = "your_api_url_here"
NEXT_PUBLIC_IMAGES_API_URL = "your_images_api_url_here"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY = "your_emailjs_public_key_here"
NEXT_PUBLIC_EMAILJS_SERVICE_ID = "your_emailjs_service_id_here"
NEXT_PUBLIC_EMAILJS_TEMPLATE_PASSWORD_ID = "your_emailjs_template_password_id_here"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ORDER_MOVIE_ID = "your_emailjs_template_order_movie_id_here"
NEXT_PUBLIC_GEMINI_API_KEY = "your_gemini_api_key_here"
```

### file .env [backend]

```bash
MONGO_URI = 'your_mongo_uri_here'
TMDB_API_KEY = 'your_tmdb_api_key_here'
JWT_SECRET = 'your_jwt_secret_here'
JWT_REFRESH_SECRET = 'your_jwt_refresh_secret_here'
PAYPAL_CLIENT_ID = 'your_paypal_client_id_here'
PAYPAL_SECRET = 'your_paypal_secret_here'
PAYPAL_API_URL = 'your_paypal_api_url_here'
EMAIL_USER = 'your_email_user_here'
EMAIL_PASS = 'your_email_pass_here'
```

## 3. Tổng quan về thư mục đồ án

```bash
Directory structure:
└── chickensoup269-zero_movie/
    ├── README.md
    ├── backend/
    │   ├── package-lock.json
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── .gitignore
    │   ├── src/
    │   └── uploads/
    └── frontend/
        ├── README.md
        ├── components.json
        ├── eslint.config.mjs
        ├── next.config.ts
        ├── package-lock.json
        ├── package.json
        ├── postcss.config.mjs
        ├── tailwind.config.ts
        ├── tsconfig.json
        ├── .gitignore
        ├── public/
        │   ├── CinemaTheater.glb.json
        │   └── images/
        └── src/
```

## 4. Screenshots

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/trangchinh.png" alt="drawing" width="800"/> </p>

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/chitietphim.png" alt="drawing" width="800"/> </p>

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/trailer.png" alt="drawing" width="800"/> </p>

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/binhluan.png" alt="drawing" width="800"/> </p>

<p align="center"> <img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/chitietrap.png" alt="drawing" width="800"/> </p>

## 5. Tổng số code

[![Generic badge](https://img.shields.io/badge/frontend-19.7.0-blue.svg)](https://shields.io/)

<img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/frontend.png" alt="drawing" width="500">
  
[![Generic badge](https://img.shields.io/badge/backend-19.7.0-orange.svg)](https://shields.io/)

<img src="https://github.com/ChickenSoup269/Zero_Movie/blob/main/frontend/public/screenshots/backend.png" alt="drawing" width="500">
                     
## 6. Check dữ liệu tại đây

https://gitingest.com/ChickenSoup269/Zero_Movie

**CHÚ Ý**:<p style="color: red">Tài khoản paypal ở môi trường sanbox nếu cần hãy liên hệ</p>

### 7. Cài đặt dependencies của frontend & backend

Chạy lệnh sau để cài đặt tất cả dependencies cần thiết:

```bash
npm install
```

### 8. Chạy dự án

Khởi chạy server phát triển bằng lệnh:

frontend

```bash
npm run dev
```

backend

```bash
npm run start now
```

Sau đó tại frontend cmd, truy cập `http://localhost:3000` để xem ứng dụng.

### 9. Build dự án

Để build dự án cho môi trường production, chạy lệnh:

```bash
npm run build
```

## [BỔ SUNG] Nếu clone về máy

Clone the project

```bash
  git clone https://github.com/ChickenSoup269/Zero_Movie.git
```

Go to the project directory

```bash
  cd my-project
```

## 10. Video demo & và full ảnh đồ án

link: https://www.youtube.com/watch?v=Hv5FI1u5by8
