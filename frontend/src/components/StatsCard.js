import React from 'react';

const StatsCard = ({ icon: Icon, value, label, color = 'primary', trend }) => {
  const colorMap = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      value: 'text-primary-700',
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      value: 'text-green-700',
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      value: 'text-red-700',
    },
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-700',
    },
    yellow: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      value: 'text-yellow-700',
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      value: 'text-purple-700',
    },
  };

  const colors = colorMap[color] || colorMap.primary;

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center">
        <div className={`flex-shrink-0 p-3 rounded-lg ${colors.bg}`}>
          {Icon && <Icon className={`h-6 w-6 ${colors.icon}`} />}
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500 truncate">{label}</p>
          <div className="flex items-baseline">
            <p className={`text-2xl font-bold ${colors.value}`}>
              {value !== undefined && value !== null ? value : '--'}
            </p>
            {trend && (
              <span className={`ml-2 text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend > 0 ? '+' : ''}{trend}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
