const multer = require("multer");
const path = require("path");
const fs = require("fs");

/**
 * Master Reusable Upload Middleware
 * @param {string} type - 'hero', 'avatar', or 'listings'
 */
const uploadHandler = (type) => {
  const root = path.join(__dirname, "..", "uploads");

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let dest = path.join(root, type);

      // Special logic for car listings to separate images from PDFs
      if (type === "listings") {
        dest =
          file.fieldname === "attachments"
            ? path.join(root, "listings", "attachments")
            : path.join(root, "listings", "images");
      }

      // Ensure directory exists
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${type}-${uniqueSuffix}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const isImage = /jpeg|jpg|png|webp|gif|avif/.test(file.mimetype);
    const isPdf = file.mimetype === "application/pdf";

    if (type === "finance") {
      return isImage || isPdf
        ? cb(null, true)
        : cb(new Error("Only images and PDF files are allowed"));
    }
    if (file.fieldname === "attachments") {
      return isPdf
        ? cb(null, true)
        : cb(new Error("Only PDF attachments allowed"));
    }
    return isImage ? cb(null, true) : cb(new Error("Only images are allowed"));
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB global limit
  });

  return (req, res, next) => {
    let execution;

    // Logic to determine which Multer method to call
    if (type === "listings") {
      execution = upload.fields([
        { name: "images", maxCount: 30 },
        { name: "attachments", maxCount: 10 },
      ]);
    } else if (type === "hero") {
      execution = upload.single("banner"); // Matches Hero Editor
    } else if (type === "avatar") {
      execution = upload.single("avatar"); // Matches Profile Editor
    } else if (type === "blogs" || type === "reviews") {
      execution = upload.array("files", 30); // Matches blog/review image uploads (up to 30 files)
    } else if (type === "testamonials") {
      execution = upload.array("images", 30); // Matches testimonial image uploads (up to 30 files)
    } else if (type === "finance") {
      execution = upload.array("files", 20); // Handles finance enquiry uploads (up to 20 files)
    } else {
      // Default: handle as array upload
      execution = upload.array("files", 30);
    }

    execution(req, res, (err) => {
      if (err) {
        console.error("Upload error:", err.message);
        return res.status(400).json({ message: err.message });
      }
      console.log("Files uploaded successfully:", {
        type: type,
        files: req.files || req.file ? "Yes" : "No",
        fileCount: req.files?.length || (req.file ? 1 : 0),
      });
      next();
    });
  };
};

module.exports = uploadHandler;
