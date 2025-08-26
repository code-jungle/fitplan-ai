import React from 'react';
import Card from '../Card';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: 'mint' | 'lavanda' | 'blue' | 'green' | 'orange';
  className?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  icon,
  title,
  value,
  subtitle,
  color,
  className = ''
}) => {
  const colorClasses = {
    mint: 'bg-mint-400/20 text-mint-400',
    lavanda: 'bg-lavanda-400/20 text-lavanda-400',
    blue: 'bg-blue-400/20 text-blue-400',
    green: 'bg-green-400/20 text-green-400',
    orange: 'bg-orange-400/20 text-orange-400'
  };

  return (
    <Card className={`text-center ${className}`}>
      <div className={`w-16 h-16 ${colorClasses[color]} rounded-full mx-auto mb-4 flex items-center justify-center`}>
        {icon}
      </div>
      <h3 className="font-orbitron font-semibold text-xl mb-2">{title}</h3>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-white/60 text-sm">{subtitle}</p>
    </Card>
  );
};

export default StatsCard;
