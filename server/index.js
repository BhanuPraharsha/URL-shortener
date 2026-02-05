require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const urlRoutes = require('./routes/urlRoutes');
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();

connectDB();

app.use(helmet());

app.use(express.json());
app.use(cors());

app.use(generalLimiter);

app.use('/', urlRoutes);

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));