const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  urlId: { type: Number, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  analytics: [{
    timestamp: { type: Date, default: Date.now },
    device: String,
    ip: String,
    referrer: String,
    location: {
      country: String,
      city: String,
      region: String
    },
    browser: String,
    os: String
  }],
  createdAt: { type: Date, default: Date.now }
});

urlSchema.index({ shortCode: 1 });
urlSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Url', urlSchema);