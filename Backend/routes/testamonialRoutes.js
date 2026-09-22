const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/testamonialController");

const uploadHandler = require("../middleware/uploadMiddleware");

const testamonialMediaUploadHandler =
  uploadHandler("testamonials");

// Create Testamonial
router.post(
  "/",
  testamonialMediaUploadHandler,
  reviewController.createReview
);

// Get All Testamonials
router.get(
  "/",
  reviewController.getAlltestamonials
);

// Get Testamonials by Listing ID
router.get(
  "/listing/:listing_id",
  reviewController.gettestamonialsByListing
);

// Get Single Testamonial
router.get(
  "/:id",
  reviewController.getReviewById
);

// Update Testamonial
router.put(
  "/:id",
  testamonialMediaUploadHandler,
  reviewController.updateReview
);

// Delete Testamonial
router.delete(
  "/:id",
  reviewController.deleteReview
);

module.exports = router;