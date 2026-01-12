const express = require('express');
const router = express.Router();
const { shortenUrl, redirectUrl, getAnalytics } = require('../controllers/urlController');

// Define API endpoints
router.post('/api/shorten', shortenUrl);
router.get('/api/analytics/:code', getAnalytics);
router.get('/:code', redirectUrl);

module.exports = router;