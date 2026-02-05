import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiLink, FiCopy, FiCheck } from 'react-icons/fi';

const URLShortener = ({ onShortened }) => {
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!longUrl.trim()) {
            toast.error('Please enter a URL');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post('http://localhost:5000/api/shorten', {
                originalUrl: longUrl
            });

            const fullShortUrl = res.data.shortUrl;
            setShortUrl(fullShortUrl);

            if (res.data.message) {
                toast.success(res.data.message);
            } else {
                toast.success('URL shortened successfully');
            }

            if (onShortened) {
                onShortened(res.data.shortCode);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || 'Failed to shorten URL';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            toast.success('Copied to clipboard');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error('Failed to copy');
        }
    };

    return (
        <div className="card">
            <div className="flex items-center gap-md mb-lg">
                <div className="stat-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                    <FiLink />
                </div>
                <div>
                    <h2 className="mb-sm">Shorten Your URL</h2>
                    <p className="text-sm text-secondary">Create a short, memorable link in seconds</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group mb-md">
                    <label htmlFor="url-input" className="input-label">Enter Long URL</label>
                    <input
                        id="url-input"
                        type="url"
                        className="input"
                        placeholder="https://example.com/very/long/url/path"
                        value={longUrl}
                        onChange={(e) => setLongUrl(e.target.value)}
                        disabled={loading}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%' }}
                >
                    {loading ? (
                        <>
                            <div className="spinner"></div>
                            <span>Shortening...</span>
                        </>
                    ) : (
                        <>
                            <FiLink />
                            <span>Shorten URL</span>
                        </>
                    )}
                </button>
            </form>

            {shortUrl && (
                <div className="mt-lg" style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'var(--color-bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border)'
                }}>
                    <p className="text-xs text-secondary mb-sm font-medium">Your shortened URL:</p>
                    <div className="flex items-center gap-sm">
                        <a
                            href={shortUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="font-medium"
                            style={{
                                color: 'var(--color-primary)',
                                textDecoration: 'none',
                                flex: 1,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {shortUrl}
                        </a>
                        <button
                            onClick={copyToClipboard}
                            className="btn btn-secondary"
                            style={{ padding: 'var(--spacing-xs) var(--spacing-sm)' }}
                        >
                            {copied ? <FiCheck /> : <FiCopy />}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default URLShortener;
