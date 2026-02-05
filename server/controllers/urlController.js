const Url = require('../models/Url');
const Counter = require('../models/Counter');
const UAParser = require('ua-parser-js');
const { encode } = require('../utils/base62');
const { getLocationFromIP } = require('../utils/geoip');

const getNextSequence = async (name) => {
  const counter = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
};

exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  try {
    // Check if URL already exists
    const existingUrl = await Url.findOne({ originalUrl });
    if (existingUrl) {
      return res.json({
        originalUrl,
        shortCode: existingUrl.shortCode,
        shortUrl: `${baseUrl}/${existingUrl.shortCode}`,
        message: 'URL already shortened'
      });
    }

    // 1. Get unique ID atomically
    const urlId = await getNextSequence('url_id');

    // 2. Encode
    const shortCode = encode(urlId);

    // 3. Save
    const newUrl = new Url({
      originalUrl,
      shortCode,
      urlId
    });

    await newUrl.save();

    // Return the full short URL
    res.json({
      originalUrl,
      shortCode,
      shortUrl: `${baseUrl}/${shortCode}`
    });
  } catch (err) {
    console.error('Error shortening URL:', err);
    res.status(500).json({ error: 'Failed to shorten URL. Please try again.' });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (url) {
      const parser = new UAParser(req.headers['user-agent']);
      const deviceInfo = parser.getDevice();
      const browserInfo = parser.getBrowser();
      const osInfo = parser.getOS();

      const device = deviceInfo.type || 'Desktop';
      const browser = browserInfo.name ? `${browserInfo.name} ${browserInfo.version || ''}`.trim() : 'Unknown';
      const os = osInfo.name ? `${osInfo.name} ${osInfo.version || ''}`.trim() : 'Unknown';

      // Get referrer
      const referrer = req.headers.referer || req.headers.referrer || 'Direct';

      // Get IP address (handle proxies)
      const ip = req.headers['x-forwarded-for']?.split(',')[0] ||
        req.headers['x-real-ip'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        'Unknown';

      // Get geographic location
      const location = getLocationFromIP(ip);

      url.clicks++;
      url.analytics.push({
        device,
        ip,
        referrer,
        location,
        browser,
        os
      });
      await url.save();

      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (err) {
    console.error('Error redirecting URL:', err);
    res.status(500).json({ error: 'Server error during redirection' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ error: 'Short URL not found' });
    res.json(url);
  } catch (err) {
    console.error('Error fetching analytics:', err);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
};
