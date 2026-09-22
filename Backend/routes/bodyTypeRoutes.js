const express = require("express");
const router = express.Router();
const bodyTypeController = require("../controllers/bodyTypeController");

router.get("/", bodyTypeController.getAllBodyTypes);
router.post("/", bodyTypeController.createBodyType);

module.exports = router;
