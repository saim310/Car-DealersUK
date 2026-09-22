const express = require("express");
const uploadHandler = require("../middleware/uploadMiddleware");
const {
  createFinanceEnquiry,
  getAllFinanceEnquiries,
  getFinanceEnquiryById,
  updateFinanceEnquiry,
  deleteFinanceEnquiry,
} = require("../controllers/financeEnquiryController");

const router = express.Router();

// POST - Create a new finance enquiry
router.post("/", uploadHandler("finance"), createFinanceEnquiry);

// GET - Get all finance enquiries
router.get("/", getAllFinanceEnquiries);

// GET - Get a specific finance enquiry by ID
router.get("/:id", getFinanceEnquiryById);

// PUT - Update a finance enquiry
router.put("/:id", updateFinanceEnquiry);

// DELETE - Delete a finance enquiry
router.delete("/:id", deleteFinanceEnquiry);

module.exports = router;
