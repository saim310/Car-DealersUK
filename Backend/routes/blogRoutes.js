const express = require("express");
const blogController = require("../controllers/blogController");
const blogImageUploadHandler = require("../middleware/blogUploadMiddleware");

const router = express.Router();

router.get("/categories", blogController.getCategories);
router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.post("/", blogImageUploadHandler, blogController.createBlog);
router.put("/:id", blogImageUploadHandler, blogController.updateBlog);
router.delete("/:id", blogController.deleteBlog);

module.exports = router;
