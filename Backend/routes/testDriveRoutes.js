const express = require("express");
const {
  createTestDrive,
  getAllTestDrives,
  getTestDriveById,
  getTestDrivesByEmail,
  getTestDrivesByCarId,
  updateTestDrive,
  updateTestDriveStatus,
  deleteTestDrive,
} = require("../controllers/testDriveController");

const router = express.Router();

// POST - Create a new test drive request
router.post("/", createTestDrive);

// GET - Get all test drives
router.get("/", getAllTestDrives);

// GET - Get test drives by email
router.get("/by-email/:email", getTestDrivesByEmail);

// GET - Get test drives by car ID
router.get("/by-car/:carId", getTestDrivesByCarId);

// GET - Get a specific test drive by ID
router.get("/:id", getTestDriveById);

// PUT - Update a test drive
router.put("/:id", updateTestDrive);

// PUT - Update test drive status
router.put("/:id/status", updateTestDriveStatus);

// DELETE - Delete a test drive
router.delete("/:id", deleteTestDrive);

module.exports = router;
