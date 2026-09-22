const fs = require("fs");
const path = require("path");
const multer = require("multer");

const uploadDir = path.join(__dirname, "..", "uploads", "blogs", "images");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const imageMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname || "").toLowerCase();
    const safeBaseName = (
      path.basename(file.originalname, extension) || "image"
    )
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40);

    cb(null, `${Date.now()}-${safeBaseName || "blog-image"}${extension}`);
  },
});

const uploadBlogImage = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    if (!imageMimeTypes.has(file.mimetype)) {
      cb(new Error("Only JPG, PNG, WEBP and GIF images are allowed"));
      return;
    }

    cb(null, true);
  },
  limits: {
    fileSize: 8 * 1024 * 1024,
    files: 1,
  },
}).single("image");

const blogImageUploadHandler = (req, res, next) => {
  uploadBlogImage(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image must be 8MB or less"
        : error.message || "Failed to upload blog image";

    res.status(400).json({ message });
  });
};

module.exports = blogImageUploadHandler;
