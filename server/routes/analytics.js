const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAnalytics, trackEvent } = require('../controllers/analyticsController');

router.get('/', protect, getAnalytics);
router.post('/track', trackEvent);

module.exports = router;
