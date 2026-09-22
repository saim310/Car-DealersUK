const express = require("express");
const router = express.Router();
const heroController = require("../controllers/heroController");
const singleUpload = require("../middleware/singleUpload");

router.post("/upload", singleUpload, heroController.updateHero);

router.get("/", heroController.getHero);

module.exports = router;
