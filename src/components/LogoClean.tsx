import React from 'react';

interface LogoCleanProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const LogoClean: React.FC<LogoCleanProps> = ({ 
  size = 'lg', 
  showText = true, 
  className = ''
}) => {
  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Clean Text Logo */}
      <div className="flex items-center">
                 <h1 className={`font-sans-serif font-bold ${textSizes[size]} text-shadow-lg leading-none`}>
          <span className="text-white futuristic-text text-4xl md:text-5xl mb-4 ">FitPlan</span>
          <span className=" from-pastel mint-300 text-transparent futuristic-text text-4xl md:text-5xl mb-4 ">AI</span>
        </h1>
      </div>
    </div>
  );
};

export default LogoClean;
