const express = require('express');
const router = express.Router();
const featureController = require('../controllers/featureController');

router.get('/all', featureController.getAllFeatures);
router.get('/listing/:id', featureController.getListingFeatures);

module.exports = router;