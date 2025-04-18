// config/multerConfig.js
import multer from "multer"
import path from "path"
import fs from "fs"

const uploadDir = path.join(__dirname, "..", "..", "uploads") // Đổi thành chữ thường

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

console.log("Multer uploadDir:", uploadDir)

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
  limits: { fileSize: 6 * 1024 * 1024 }, // Tăng lên 6MB
}).fields([
  { name: "avatar", maxCount: 1 },
  { name: "backgroundImage", maxCount: 1 },
])
