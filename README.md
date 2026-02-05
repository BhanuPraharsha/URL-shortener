# LinkShort - URL Shortener

URL shortening service with analytics tracking. Built with Node.js, Express, MongoDB, and React.

## Features

- URL shortening with Base62 encoding
- Click tracking and analytics
- Device, browser, and OS detection
- Geographic location tracking (IP-based)
- Referrer tracking
- Rate limiting
- Input validation and sanitization
- Interactive analytics dashboard with charts
- Copy-to-clipboard
- Responsive design

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose

**Frontend:** React, Vite, Chart.js

**Key Libraries:** express-rate-limit, geoip-lite, validator, helmet, ua-parser-js, react-hot-toast, react-icons

## How It Works

### URL Shortening
1. Validate and sanitize input URL
2. Check for existing URL in database
3. Generate unique ID using MongoDB counter
4. Encode ID to Base62 (0-9a-zA-Z)
5. Store mapping and return short URL

### Analytics
On each click:
- Extract device, browser, OS from user agent
- Get referrer from HTTP headers
- Convert IP to geographic location
- Store analytics data
- Redirect to original URL

### Base62 Encoding
Converts numeric IDs to short codes using 62 characters (0-9a-zA-Z).
- Supports 62^6 = 56+ billion unique URLs with 6-character codes

## API Endpoints

### POST `/api/shorten`
```json
// Request
{
  "originalUrl": "https://example.com/very/long/url"
}

// Response
{
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "a1B2c3",
  "shortUrl": "http://localhost:5000/a1B2c3"
}
```

### GET `/:code`
Redirects to original URL and tracks analytics.

### GET `/api/analytics/:code`
Returns analytics data for a shortened URL.

```json
{
  "shortCode": "a1B2c3",
  "clicks": 42,
  "analytics": [
    {
      "timestamp": "2026-02-05T10:30:00.000Z",
      "device": "Desktop",
      "browser": "Chrome 120.0",
      "os": "Windows 10",
      "referrer": "https://google.com",
      "location": {
        "country": "US",
        "city": "New York",
        "region": "NY"
      }
    }
  ]
}
```

## Setup

### Prerequisites
- Node.js v14+
- MongoDB

### Installation

1. Clone repository
```bash
git clone https://github.com/yourusername/URL-shortener.git
cd URL-shortener
```

2. Backend setup
```bash
cd server
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/linkshort
BASE_URL=http://localhost:5000
```

Start server:
```bash
npm run dev
```

3. Frontend setup
```bash
cd client
npm install
npm run dev
```

4. Open http://localhost:5173

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `BASE_URL` | Base URL for shortened links |

## Production Build

Backend:
```bash
cd server
npm start
```

Frontend:
```bash
cd client
npm run build
npm run preview
```
