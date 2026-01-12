import { useState } from 'react';
import axios from 'axios';

function App() {
  const [longUrl, setLongUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [analytics, setAnalytics] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/shorten', { originalUrl: longUrl });
      setShortUrl(`http://localhost:5000/${res.data.shortCode}`);
      // Fetch analytics for immediate view
      fetchAnalytics(res.data.shortCode);
    } catch (err) {
      alert('Error creating link');
    }
  };

  const fetchAnalytics = async (code) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/analytics/${code}`);
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>URL Shortener & Analytics</h1>
      
      {/* Input Section */}
      <form onSubmit={handleSubmit}>
        <input 
          type="url" 
          placeholder="Enter long URL..." 
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
          style={{ padding: '10px', width: '300px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>Shorten</button>
      </form>

      {/* Result Section */}
      {shortUrl && (
        <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px' }}>
          <p>Short URL: <a href={shortUrl} target="_blank" rel="noreferrer">{shortUrl}</a></p>
        </div>
      )}

      {/* Analytics Section */}
      {analytics && (
        <div style={{ marginTop: '30px' }}>
          <h2>Analytics Dashboard</h2>
          <p><strong>Total Clicks:</strong> {analytics.clicks}</p>
          
          <h3>Recent Access:</h3>
          <ul>
            {analytics.analytics.slice(-5).map((entry, idx) => (
              <li key={idx}>
                {new Date(entry.timestamp).toLocaleString()} - Device: {entry.device}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;