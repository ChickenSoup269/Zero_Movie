import multer from "multer"
import path from "path"
import fs from "fs"

// Đường dẫn đến thư mục uploads (thư mục gốc backend)
const uploadDir = path.join(__dirname, "..", "..", "uploads")

// Tạo thư mục uploads nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

// Log để kiểm tra đường dẫn
console.log("Multer uploadDir:", uploadDir)

// Config file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(
      null,
      `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`
    )
  },
})

// Cấu hình multer
export const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (extname && mimetype) {
      return cb(null, true)
    }
    cb(new Error("Chỉ hỗ trợ file ảnh JPG, JPEG, PNG!"))
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn 5MB
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
])
