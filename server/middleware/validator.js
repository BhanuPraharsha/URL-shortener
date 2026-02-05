const validator = require('validator');

const validateUrl = (req, res, next) => {
    const { originalUrl } = req.body;

    if (!originalUrl) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const trimmedUrl = originalUrl.trim();

    if (!validator.isURL(trimmedUrl, {
        protocols: ['http', 'https'],
        require_protocol: true,
        require_valid_protocol: true,
        allow_underscores: true
    })) {
        return res.status(400).json({ error: 'Invalid URL format. Please include http:// or https://' });
    }

    // Check for potentially malicious patterns
    const maliciousPatterns = [
        /javascript:/i,
        /data:/i,
        /vbscript:/i,
        /file:/i,
        /<script/i,
        /onclick/i,
        /onerror/i
    ];

    if (maliciousPatterns.some(pattern => pattern.test(trimmedUrl))) {
        return res.status(400).json({ error: 'URL contains potentially malicious content' });
    }

    // Normalize URL (remove trailing slash for consistency)
    let normalizedUrl = trimmedUrl;
    try {
        const urlObj = new URL(trimmedUrl);
        // Remove trailing slash from pathname unless it's the root
        if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
            urlObj.pathname = urlObj.pathname.slice(0, -1);
        }
        normalizedUrl = urlObj.toString();
    } catch (err) {
        return res.status(400).json({ error: 'Invalid URL format' });
    }

    // Attach normalized URL to request
    req.body.originalUrl = normalizedUrl;
    next();
};

module.exports = { validateUrl };
