import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', gradient = false }) => {
  const baseClasses = "glass-card p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl";
  const gradientClasses = gradient ? "gradient-border" : "";
  
  return (
    <div className={`${baseClasses} ${gradientClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
