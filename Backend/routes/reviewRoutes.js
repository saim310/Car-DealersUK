const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const uploadHandler = require("../middleware/uploadMiddleware");

const reviewMediaUploadHandler = uploadHandler("reviews"); // Handle review image uploads

// Create Review
router.post("/", reviewMediaUploadHandler, reviewController.createReview);

// Get All Reviews (Admin)
router.get("/", reviewController.getAllReviews);

// Get Reviews by Listing ID
router.get("/listing/:listing_id", reviewController.getReviewsByListing);

// Get Single Review
router.get("/:id", reviewController.getReviewById);

// Update Review
router.put("/:id", reviewMediaUploadHandler, reviewController.updateReview);

// Delete Review
router.delete("/:id", reviewController.deleteReview);

module.exports = router;
