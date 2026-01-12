const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: { type: String, unique: true },
  urlId: { type: Number, required: true, unique: true },
  clicks: { type: Number, default: 0 },
  analytics: [{
    timestamp: { type: Date, default: Date.now },
    device: String,
    ip: String
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Url', urlSchema);