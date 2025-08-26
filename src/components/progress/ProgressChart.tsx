import React from 'react';
import Card from '../Card';

interface ChartDataPoint {
  data: string;
  valor: number;
  meta?: number;
}

interface ProgressChartProps {
  title: string;
  data: ChartDataPoint[];
  color?: 'mint' | 'lavanda' | 'blue' | 'green' | 'orange';
  maxValue?: number;
  showMeta?: boolean;
  className?: string;
}

const ProgressChart: React.FC<ProgressChartProps> = ({
  title,
  data,
  color = 'mint',
  maxValue,
  showMeta = false,
  className = ''
}) => {
  const colorClasses = {
    mint: 'bg-gradient-to-t from-mint-400 to-mint-600',
    lavanda: 'bg-gradient-to-t from-lavanda-400 to-lavanda-600',
    blue: 'bg-gradient-to-t from-blue-400 to-blue-600',
    green: 'bg-gradient-to-t from-green-400 to-green-600',
    orange: 'bg-gradient-to-t from-orange-400 to-orange-600'
  };

  const calculatedMaxValue = maxValue || Math.max(...data.map(item => item.valor)) * 1.2;

  const renderChart = () => (
    <div className="flex items-end justify-between h-32 space-x-1">
      {data.map((item, index) => {
        const height = (item.valor / calculatedMaxValue) * 100;
        const metaHeight = showMeta && item.meta ? (item.meta / calculatedMaxValue) * 100 : 0;
        
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            {/* Barra de meta (se aplicável) */}
            {showMeta && item.meta && (
              <div 
                className="w-full bg-white/20 rounded-t-sm mb-1"
                style={{ height: `${metaHeight}%` }}
              ></div>
            )}
            
            {/* Barra de valor */}
            <div 
              className={`w-full rounded-t-sm transition-all duration-500 ${colorClasses[color]}`}
              style={{ height: `${height}%` }}
            ></div>
            
            {/* Label da data */}
            <span className="text-xs text-white/60 mt-2 text-center leading-tight">
              {item.data}
            </span>
          </div>
        );
      })}
    </div>
  );

  const calculateStats = () => {
    if (data.length === 0) return { media: 0, variacao: 0 };
    
    const valores = data.map(item => item.valor);
    const media = valores.reduce((sum, val) => sum + val, 0) / valores.length;
    const variacao = valores[valores.length - 1] - valores[0];
    
    return { media, variacao };
  };

  const { media, variacao } = calculateStats();

  return (
    <Card className={`${className}`}>
      <h3 className="font-orbitron font-semibold text-lg mb-4">{title}</h3>
      
      {/* Estatísticas */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-sm text-white/60 mb-1">Média</div>
          <div className="text-lg font-semibold text-white">
            {typeof media === 'number' ? media.toFixed(1) : '0'}
          </div>
        </div>
        <div className="text-center">
          <div className="text-sm text-white/60 mb-1">Variação</div>
          <div className={`text-lg font-semibold ${variacao >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {variacao >= 0 ? '+' : ''}{typeof variacao === 'number' ? variacao.toFixed(1) : '0'}
          </div>
        </div>
      </div>

      {/* Gráfico */}
      {renderChart()}

      {/* Legenda */}
      {showMeta && (
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-white/20 rounded"></div>
            <span className="text-white/60">Meta</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 ${colorClasses[color]} rounded`}></div>
            <span className="text-white/60">Realizado</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default ProgressChart;
