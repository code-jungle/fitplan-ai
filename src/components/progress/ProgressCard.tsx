import React from 'react';
import Card from '../Card';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'mint' | 'lavanda' | 'blue' | 'green' | 'orange' | 'red';
  progress?: number;
  progressLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'mint',
  progress,
  progressLabel,
  className = '',
  children
}) => {
  const colorClasses = {
    mint: 'text-mint-400',
    lavanda: 'text-lavanda-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    red: 'text-red-400'
  };

  const progressColorClasses = {
    mint: 'bg-mint-400',
    lavanda: 'bg-lavanda-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    orange: 'bg-orange-400',
    red: 'bg-red-400'
  };

  return (
    <Card className={`${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-orbitron font-semibold text-lg text-white mb-1">{title}</h3>
          {subtitle && <p className="text-white/60 text-sm">{subtitle}</p>}
        </div>
        {icon && (
          <div className={`w-10 h-10 ${colorClasses[color]}/20 rounded-full flex items-center justify-center`}>
            {icon}
          </div>
        )}
      </div>

      <div className="text-3xl font-bold text-white mb-4">{value}</div>

      {progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-white/60">Progresso</span>
            <span className="text-sm text-white/60">{progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${progressColorClasses[color]}`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          {progressLabel && (
            <p className="text-xs text-white/60 mt-1">{progressLabel}</p>
          )}
        </div>
      )}

      {children}
    </Card>
  );
};

export default ProgressCard;
