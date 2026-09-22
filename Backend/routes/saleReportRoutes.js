const express = require("express");
const router = express.Router();
const saleReportController = require("../controllers/saleReportController");

router.get("/", saleReportController.getSaleReports);
router.post("/", saleReportController.createSaleReport);
router.put("/:id", saleReportController.updateSaleReport);
router.delete("/:id", saleReportController.deleteSaleReport);

module.exports = router;
