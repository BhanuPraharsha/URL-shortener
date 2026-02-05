import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import URLShortener from './components/URLShortener';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { FiLink2 } from 'react-icons/fi';
import './App.css';

function App() {
  const [currentShortCode, setCurrentShortCode] = useState(null);

  const handleUrlShortened = (shortCode) => {
    setCurrentShortCode(shortCode);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#111827',
            color: '#fff',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            fontSize: '0.875rem'
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <div className="app-container">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <FiLink2 size={28} />
                <h1>LinkShort</h1>
              </div>
              <p className="tagline">Fast, secure URL shortening with powerful analytics</p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="container">
            <div className="content-grid">
              {/* URL Shortener Section */}
              <section>
                <URLShortener onShortened={handleUrlShortened} />
              </section>

              {/* Analytics Section */}
              <section className="mt-2xl">
                <AnalyticsDashboard shortCode={currentShortCode} />
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;