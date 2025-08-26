import React from 'react';
import Card from '../Card';

interface PlanCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: 'mint' | 'lavanda' | 'blue' | 'green' | 'orange' | 'red';
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isInteractive?: boolean;
}

const PlanCard: React.FC<PlanCardProps> = ({
  title,
  subtitle,
  icon,
  color = 'mint',
  children,
  className = '',
  onClick,
  isInteractive = false
}) => {
  const colorClasses = {
    mint: 'text-mint-400',
    lavanda: 'text-lavanda-400',
    blue: 'text-blue-400',
    green: 'text-green-400',
    orange: 'text-orange-400',
    red: 'text-red-400'
  };

  const baseClasses = `transition-all duration-300 ${className}`;
  const interactiveClasses = isInteractive 
    ? 'hover:scale-105 hover:shadow-xl cursor-pointer' 
    : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClasses} ${interactiveClasses} ${clickableClasses}`}
      onClick={onClick}
    >
      <Card className="h-full">
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
        {children}
      </Card>
    </div>
  );
};

export default PlanCard;
