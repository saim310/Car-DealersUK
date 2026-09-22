const express = require("express");
const router = express.Router();
const brandController = require("../controllers/brandController");
const brandUploadHandler = require("../middleware/brandUploadHandler");

router.get("/", brandController.getAllBrands);

router.post("/", brandUploadHandler, brandController.createBrand);

router.delete("/:id", brandController.deleteBrand);

module.exports = router;
