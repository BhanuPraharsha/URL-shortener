const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getAnalytics } = require('../controllers/urlController');
const { validateUrl } = require('../middleware/validator');
const { shortenLimiter, analyticsLimiter } = require('../middleware/rateLimiter');

router.post('/api/shorten', shortenLimiter, validateUrl, shortenUrl);
router.get('/api/analytics/:code', analyticsLimiter, getAnalytics);
router.get('/:code', redirectUrl);

module.exports = router;