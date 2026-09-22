const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const uploadHandler = require("../middleware/uploadMiddleware");

// Profile Routes
router.get("/admin/profile", authMiddleware, userController.getAdminProfile);
router.put(
  "/admin/profile",
  authMiddleware,
  uploadHandler("avatar"), // Clean and reusable
  userController.updateAdminProfile,
);

module.exports = router;
