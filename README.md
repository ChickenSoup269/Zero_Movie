# Zero Movie - Next.js Project

## Giới thiệu

Đây là dự án **Zero Movie** được xây dựng bằng **Next.js** với **TypeScript** và **Tailwind CSS**. Dưới đây là cấu trúc thư mục và giải thích về từng phần trong dự án.

## Cấu trúc thư mục

```
/zero-movies
├── /src
│   ├── /app               # (Next.js App Router)
│   │   ├── page.tsx       # Trang chính (Home Page)
│   │   ├── layout.tsx     # Layout chung cho ứng dụng
│   │   ├── /dashboard     # Một route con (ví dụ: /dashboard)
│   │   ├── /api           # Route API (backend)
│   │   │   ├── route.ts   # API Handler
│   │   ├── /components    # Các component dùng chung
│   ├── /lib               # Code logic (fetch data, helper functions)
│   ├── /services          # Gọi API bên ngoài hoặc database
├── /public                # File tĩnh (hình ảnh, favicon, v.v.)
├── next.config.js         # Cấu hình Next.js
├── package.json           # Dependencies

```

### 1. Root Directory (Thư mục gốc)

- **README.md**: Tài liệu hướng dẫn và mô tả dự án.
- **eslint.config.mjs**: Cấu hình ESLint để kiểm tra và format mã nguồn.
- **next.config.ts**: Cấu hình chung của Next.js, ví dụ như tối ưu hóa hình ảnh, biến môi trường, v.v.
- **package.json**: Chứa thông tin về dự án và danh sách dependencies.
- **postcss.config.mjs**: Cấu hình PostCSS, thường dùng kết hợp với Tailwind CSS.
- **tailwind.config.ts**: Cấu hình Tailwind CSS để tùy chỉnh giao diện.
- **tsconfig.json**: Cấu hình TypeScript cho dự án.

### 2. Thư mục `public/`

- Chứa các tệp tĩnh như hình ảnh, favicon, và các tệp cần thiết cho frontend.

### 3. Thư mục `src/app/`

Đây là nơi chứa mã nguồn chính của ứng dụng Next.js theo **App Router (Next.js 13 trở lên)**.

- **globals.css**: File CSS chứa các kiểu dáng toàn cục cho ứng dụng.
- **layout.tsx**: Component chứa bố cục chính của ứng dụng, được sử dụng cho tất cả các trang.
- **page.tsx**: Trang chính của ứng dụng (tương đương với `index.tsx` trong phiên bản trước của Next.js).

## Hướng dẫn cài đặt và chạy dự án

### 1. Cài đặt dependencies

Chạy lệnh sau để cài đặt tất cả dependencies cần thiết:

```bash
npm install
```

### 2. Chạy dự án

Khởi chạy server phát triển bằng lệnh:

```bash
npm run dev
```

Sau đó, truy cập `http://localhost:3000` để xem ứng dụng.

### 3. Build dự án

Để build dự án cho môi trường production, chạy lệnh:

```bash
npm run build
```

### 44. Check dữ liệu tại đây

https://gitingest.com/ChickenSoup269/Zero_Movie

## Kết luận

=> đây là phần sẽ nói về dự án này sẽ cập nhật sau
