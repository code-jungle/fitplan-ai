import React from 'react';
import { PlanAdjustmentResult } from '../../services/planAdjuster';

interface PlanAdjustmentNotificationProps {
  adjustment: PlanAdjustmentResult;
  onClose: () => void;
  className?: string;
}

const PlanAdjustmentNotification: React.FC<PlanAdjustmentNotificationProps> = ({
  adjustment,
  onClose,
  className = ''
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'media':
        return 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400';
      case 'baixa':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      default:
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'alta':
        return '⚠️';
      case 'media':
        return '⚡';
      case 'baixa':
        return '✅';
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className={`fixed top-4 right-4 max-w-md w-full z-50 ${className}`}>
      <div className="bg-slate-800 rounded-xl border border-white/20 shadow-2xl backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-mint-500 to-lavanda-500 rounded-full flex items-center justify-center mr-3">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Plano Ajustado</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Message */}
          <div className="mb-4">
            <p className="text-white/80 text-sm leading-relaxed">
              {adjustment.message}
            </p>
          </div>

          {/* Adjustments Summary */}
          {adjustment.adjustments.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-white mb-3">
                Ajustes Realizados ({adjustment.adjustments.length}):
              </h4>
              <div className="space-y-2">
                {adjustment.adjustments.slice(0, 3).map((adjustment, index) => (
                  <div key={index} className="flex items-start">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mr-2 ${getPriorityColor(adjustment.priority)}`}>
                      <span className="mr-1">{getPriorityIcon(adjustment.priority)}</span>
                      {adjustment.type}
                    </span>
                    <span className="text-xs text-white/60 flex-1">
                      {adjustment.reason}
                    </span>
                  </div>
                ))}
                {adjustment.adjustments.length > 3 && (
                  <div className="text-xs text-white/40 text-center pt-2">
                    +{adjustment.adjustments.length - 3} mais ajustes
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
            >
              Entendi
            </button>
            <button
              onClick={onClose}
              className="px-3 py-2 bg-gradient-to-r from-mint-500 to-lavanda-500 text-white rounded-lg hover:from-mint-600 hover:to-lavanda-600 transition-all duration-300 text-sm font-medium"
            >
              Ver Detalhes
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gradient-to-r from-mint-500 to-lavanda-500 rounded-b-xl animate-pulse"></div>
      </div>
    </div>
  );
};

export default PlanAdjustmentNotification;
