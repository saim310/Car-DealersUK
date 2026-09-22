const express = require("express");
const router = express.Router();
const footerController = require("../controllers/footerController");

router.get("/", footerController.getFooter);
router.post("/", footerController.updateFooter);

module.exports = router;
