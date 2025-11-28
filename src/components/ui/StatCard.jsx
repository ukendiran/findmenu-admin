import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'positive',
  icon, 
  color = 'from-blue-500 to-blue-600',
  bgColor = 'from-blue-50 to-blue-100',
  className = ''
}) => {
  return (
    <div className={`stat-card group ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`stat-icon bg-gradient-to-r ${color}`}>
          {icon}
        </div>
        {change && (
          <div className={`text-xs font-medium flex items-center ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {changeType === 'positive' ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {change}
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
    </div>
  );
};

export default StatCard;