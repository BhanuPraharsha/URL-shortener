import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import StatCard from './StatCard';
import { FiTrendingUp, FiMonitor, FiGlobe, FiExternalLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const AnalyticsDashboard = ({ shortCode }) => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (shortCode) {
            fetchAnalytics();
        }
    }, [shortCode]);

    const fetchAnalytics = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/analytics/${shortCode}`);
            setAnalytics(res.data);
        } catch (err) {
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    };

    if (!shortCode) {
        return (
            <div className="card text-center">
                <p className="text-secondary">Shorten a URL to view analytics</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="card text-center">
                <div className="spinner" style={{ margin: '0 auto' }}></div>
                <p className="text-secondary mt-md">Loading analytics...</p>
            </div>
        );
    }

    if (!analytics) {
        return (
            <div className="card text-center">
                <p className="text-secondary">No analytics data available</p>
            </div>
        );
    }

    // Process analytics data
    const deviceCounts = {};
    const referrerCounts = {};
    const countryCounts = {};
    const clicksByDate = {};

    analytics.analytics.forEach(entry => {
        // Device breakdown
        const device = entry.device || 'Unknown';
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;

        // Referrer breakdown
        const referrer = entry.referrer === 'Direct' ? 'Direct' :
            new URL(entry.referrer || 'Direct').hostname || 'Direct';
        referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;

        // Country breakdown
        const country = entry.location?.country || 'Unknown';
        countryCounts[country] = (countryCounts[country] || 0) + 1;

        // Clicks by date
        const date = new Date(entry.timestamp).toLocaleDateString();
        clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    // Get top country
    const topCountry = Object.entries(countryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
    const uniqueVisitors = new Set(analytics.analytics.map(a => a.ip)).size;

    // Chart data
    const clickTrendsData = {
        labels: Object.keys(clicksByDate),
        datasets: [{
            label: 'Clicks',
            data: Object.values(clicksByDate),
            borderColor: 'rgb(79, 70, 229)',
            backgroundColor: 'rgba(79, 70, 229, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const deviceData = {
        labels: Object.keys(deviceCounts),
        datasets: [{
            data: Object.values(deviceCounts),
            backgroundColor: [
                'rgba(79, 70, 229, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(239, 68, 68, 0.8)'
            ],
            borderWidth: 0
        }]
    };

    const referrerData = {
        labels: Object.keys(referrerCounts).slice(0, 5),
        datasets: [{
            label: 'Visits',
            data: Object.values(referrerCounts).slice(0, 5),
            backgroundColor: 'rgba(79, 70, 229, 0.8)',
            borderRadius: 6
        }]
    };

    const countryData = {
        labels: Object.keys(countryCounts).slice(0, 5),
        datasets: [{
            label: 'Visits',
            data: Object.values(countryCounts).slice(0, 5),
            backgroundColor: 'rgba(16, 185, 129, 0.8)',
            borderRadius: 6
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                padding: 12,
                borderRadius: 8,
                titleFont: { size: 13, weight: '600' },
                bodyFont: { size: 12 }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    precision: 0
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    const doughnutOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: { size: 12 }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(17, 24, 39, 0.9)',
                padding: 12,
                borderRadius: 8
            }
        }
    };

    return (
        <div>
            <h2 className="mb-lg">Analytics Dashboard</h2>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <StatCard
                    icon={FiTrendingUp}
                    label="Total Clicks"
                    value={analytics.clicks}
                    color="var(--color-primary)"
                />
                <StatCard
                    icon={FiMonitor}
                    label="Unique Visitors"
                    value={uniqueVisitors}
                    color="var(--color-success)"
                />
                <StatCard
                    icon={FiGlobe}
                    label="Top Country"
                    value={topCountry}
                    color="var(--color-warning)"
                />
            </div>

            {/* Charts Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--spacing-lg)',
                marginBottom: 'var(--spacing-xl)'
            }}>
                {/* Click Trends */}
                <div className="card">
                    <h3 className="mb-md text-sm font-semibold text-secondary">Click Trends</h3>
                    <div style={{ height: '250px' }}>
                        <Line data={clickTrendsData} options={chartOptions} />
                    </div>
                </div>

                {/* Device Breakdown */}
                <div className="card">
                    <h3 className="mb-md text-sm font-semibold text-secondary">Device Breakdown</h3>
                    <div style={{ height: '250px' }}>
                        <Doughnut data={deviceData} options={doughnutOptions} />
                    </div>
                </div>

                {/* Top Referrers */}
                <div className="card">
                    <h3 className="mb-md text-sm font-semibold text-secondary">Top Referrers</h3>
                    <div style={{ height: '250px' }}>
                        <Bar data={referrerData} options={chartOptions} />
                    </div>
                </div>

                {/* Geographic Distribution */}
                <div className="card">
                    <h3 className="mb-md text-sm font-semibold text-secondary">Top Countries</h3>
                    <div style={{ height: '250px' }}>
                        <Bar data={countryData} options={chartOptions} />
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
                <h3 className="mb-md font-semibold">Recent Activity</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {analytics.analytics.slice(-10).reverse().map((entry, idx) => (
                        <div
                            key={idx}
                            style={{
                                padding: 'var(--spacing-sm)',
                                borderBottom: idx < 9 ? '1px solid var(--color-border)' : 'none',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: 'var(--spacing-md)'
                            }}
                        >
                            <div style={{ flex: 1 }}>
                                <div className="text-sm font-medium">
                                    {entry.location?.city || 'Unknown'}, {entry.location?.country || 'Unknown'}
                                </div>
                                <div className="text-xs text-tertiary">
                                    {new Date(entry.timestamp).toLocaleString()} • {entry.device} • {entry.browser}
                                </div>
                            </div>
                            <div className="text-xs text-secondary" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-xs)'
                            }}>
                                <FiExternalLink size={12} />
                                {entry.referrer === 'Direct' ? 'Direct' : new URL(entry.referrer).hostname}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
