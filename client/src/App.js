import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // send to backend
      const res = await axios.post('http://localhost:5000/api/shorten', {
        originalUrl: url
      });
      // Construct the short link
      setShortUrl(`http://localhost:5000/${res.data.shortCode}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter long URL" 
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ padding: "10px", width: "300px" }}
        />
        <button type="submit" style={{ padding: "10px 20px" }}>Shorten</button>
      </form>

      {shortUrl && (
        <div style={{ marginTop: "20px" }}>
          <p>Short URL created:</p>
          <a href={shortUrl} target="_blank" rel="noopener noreferrer">
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}

export default App;