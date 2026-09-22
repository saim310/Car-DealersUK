const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/newsletterController');

router.get('/', getSubscribers);
router.post('/subscribe', subscribe);

module.exports = router;