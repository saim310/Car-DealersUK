const express = require("express");
const router = express.Router();
const listingController = require("../controllers/listingController");
const uploadHandler = require("../middleware/uploadMiddleware");

const listingMediaUploadHandler = uploadHandler("listings");

router.post("/", listingMediaUploadHandler, listingController.createListing);
router.get("/", listingController.getAllListings);
router.get("/locations", listingController.getListingLocations);
router.get("/:id", listingController.getListingById);
router.put("/:id", listingMediaUploadHandler, listingController.updateListing);
router.delete("/:id", listingController.deleteListing);

module.exports = router;
