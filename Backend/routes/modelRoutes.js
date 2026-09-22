const express = require("express");
const router = express.Router();
const modelController = require("../controllers/modelController");

router.get("/brand/:brandId", modelController.getModelsByBrand);
router.post("/", modelController.createModel);

module.exports = router;
