const express = require("express");
const router = express.Router();
const analyticsController = require("../controllers/analyticsController");

router.post("/page-visit", analyticsController.logPageVisit);
router.post("/property-view", analyticsController.logPropertyView);
router.get("/stats", analyticsController.getAnalyticsStats);

module.exports = router;
