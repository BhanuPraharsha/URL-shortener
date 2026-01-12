const Url = require('../models/Url');
const Counter = require('../models/Counter');
const UAParser = require('ua-parser-js');
const { encode } = require('../utils/base62');

// Helper: Get next sequence ID safely
const getNextSequence = async (name) => {
  const counter = await Counter.findOneAndUpdate(
    { id: name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // Create if doesn't exist
  );
  return counter.seq;
};

exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  if (!originalUrl || !originalUrl.startsWith('http')) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
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
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (url) {
      // Analytics
      const parser = new UAParser(req.headers['user-agent']);
      const device = parser.getDevice().type || 'Desktop';
      
      url.clicks++;
      url.analytics.push({ device, ip: req.ip });
      await url.save();

      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json({ error: 'No URL found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });
    if (!url) return res.status(404).json({ error: 'Not found' });
    res.json(url);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};