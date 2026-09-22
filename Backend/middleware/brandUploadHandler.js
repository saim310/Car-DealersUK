const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Define where brand logo uploads go
const uploadDir = path.join(__dirname, "..", "uploads", "brands");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `brand-${uniqueSuffix}${extension}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif|svg/;
  const isMimeValid = allowedTypes.test(file.mimetype);
  const isExtValid = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );

  if (isMimeValid && isExtValid) {
    return cb(null, true);
  }
  cb(new Error("Only images (jpeg, jpg, png, webp, gif, svg) are allowed"));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
}).single("image");

const brandUploadHandler = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      const message =
        err.code === "LIMIT_FILE_SIZE"
          ? "Brand logo must be 5MB or less"
          : err.message;
      return res.status(400).json({ message });
    }
    next();
  });
};

module.exports = brandUploadHandler;
