const geoip = require('geoip-lite');

// Get geographic location from IP address
const getLocationFromIP = (ip) => {
    // Handle localhost and private IPs
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
        return {
            country: 'Local',
            city: 'Local',
            region: 'Local'
        };
    }

    // Remove IPv6 prefix if present
    const cleanIP = ip.replace(/^::ffff:/, '');

    const geo = geoip.lookup(cleanIP);

    if (!geo) {
        return {
            country: 'Unknown',
            city: 'Unknown',
            region: 'Unknown'
        };
    }

    return {
        country: geo.country || 'Unknown',
        city: geo.city || 'Unknown',
        region: geo.region || 'Unknown',
        timezone: geo.timezone || 'Unknown'
    };
};

module.exports = { getLocationFromIP };
