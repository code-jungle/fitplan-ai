import React from 'react';
import Card from '../Card';

interface RecommendationsCardProps {
  recommendations: string[];
  className?: string;
}

const RecommendationsCard: React.FC<RecommendationsCardProps> = ({
  recommendations,
  className = ''
}) => {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={`${className}`}>
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-mint-400/20 rounded-full flex items-center justify-center mr-3">
          <svg className="w-5 h-5 text-mint-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="futuristic-text text-2xl">Recomendações da IA</h2>
      </div>
      
      <div className="space-y-3">
        {recommendations.map((recommendation, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg border border-white/10">
            <div className="w-2 h-2 bg-mint-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-white/90 text-sm leading-relaxed">{recommendation}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecommendationsCard;
