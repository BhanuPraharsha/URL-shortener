import { FiTrendingUp, FiUsers, FiGlobe } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, color = 'var(--color-primary)' }) => {
    return (
        <div className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${color}15`, color }}>
                <Icon />
            </div>
            <div className="stat-content">
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
            </div>
        </div>
    );
};

export default StatCard;
