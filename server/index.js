require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');

const app = express();

// to parse incoming JSON data
app.use(express.json());
app.use(cors());

// db
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// data model
const UrlSchema = new mongoose.Schema({
    originalUrl: String,
    shortCode: String,
    clicks: { type: Number, default: 0 }
});
const Url = mongoose.model('Url', UrlSchema);

//routes

// 1. Shorten URL Route (POST)
app.post('/api/shorten', async (req, res) => {
    const originalUrl = req.body.originalUrl;
    const shortCode = shortid.generate();

    try {
        // Create new entry
        const url = new Url({
            originalUrl,
            shortCode
        });
        await url.save();//save to database
        res.json(url);
    } catch (err) {
        res.status(500).json('Server Error');
    }
});

// 2. Redirect Route (GET)
// When someone visits http://localhost:5000/abc12
app.get('/:code', async (req, res) => {
    try {
        const url = await Url.findOne({ shortCode: req.params.code });//db query

        if (url) {
            // Optional: Increment clicks
            url.clicks++;
            await url.save();
            
            return res.redirect(url.originalUrl);
        } else {
            return res.status(404).json('No URL found');
        }
    } catch (err) {
        res.status(500).json('Server Error');
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));