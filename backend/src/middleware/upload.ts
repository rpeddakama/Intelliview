import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Corrected directory path
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  const fileTypes = /wav|mp3|m4a/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /audio\/mpeg|audio\/wav|audio\/x-m4a|audio\/m4a/.test(
    file.mimetype
  );

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Error: Audio files only!"));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10000000 }, // 10MB
  fileFilter,
});

export default upload;
