import React from 'react';
import Card from '../Card';
import Button from '../Button';
import { UserMeal } from '../../types';

interface MealCardProps {
  meal: UserMeal;
  onStatusChange: (mealId: string, status: 'planejada' | 'consumida' | 'pulada') => void;
  onEdit: (meal: UserMeal) => void;
  onDelete: (mealId: string) => void;
  className?: string;
}

const MealCard: React.FC<MealCardProps> = ({ 
  meal, 
  onStatusChange, 
  onEdit, 
  onDelete, 
  className = '' 
}) => {
  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'cafe':
        return '☕';
      case 'lanche':
        return '🍎';
      case 'almoco':
        return '🍽️';
      case 'jantar':
        return '🌙';
      case 'ceia':
        return '🌃';
      default:
        return '🍴';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'consumida':
        return 'bg-green-500/20 border-green-500/30 text-green-400';
      case 'planejada':
        return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
      case 'pulada':
        return 'bg-red-500/20 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-500/20 border-gray-500/30 text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'consumida':
        return 'Consumida';
      case 'planejada':
        return 'Planejada';
      case 'pulada':
        return 'Pulada';
      default:
        return 'Desconhecido';
    }
  };

  const getCategoryText = (categoria: string) => {
    switch (categoria) {
      case 'cafe':
        return 'Café da Manhã';
      case 'lanche':
        return 'Lanche';
      case 'almoco':
        return 'Almoço';
      case 'jantar':
        return 'Jantar';
      case 'ceia':
        return 'Ceia';
      default:
        return categoria;
    }
  };

  return (
    <Card className={`${className} hover:scale-[1.02] transition-transform duration-200`}>
      <div className="p-6">
        {/* Header da Refeição */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getCategoryIcon(meal.categoria)}</div>
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">{meal.nome}</h3>
              <p className="text-white/70 text-sm">{getCategoryText(meal.categoria)}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(meal.status)}`}>
              {getStatusText(meal.status)}
            </span>
            <span className="text-white/60 text-sm">{meal.horario}</span>
          </div>
        </div>

        {/* Informações Nutricionais */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-mint-400">{meal.caloriasTotais}</div>
            <div className="text-white/60 text-xs">Calorias</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-400">{meal.proteinasTotais}g</div>
            <div className="text-white/60 text-xs">Proteínas</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-400">{meal.carboidratosTotais}g</div>
            <div className="text-white/60 text-xs">Carboidratos</div>
          </div>
          <div className="bg-white/5 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-400">{meal.gordurasTotais}g</div>
            <div className="text-white/60 text-xs">Gorduras</div>
          </div>
        </div>

        {/* Lista de Alimentos */}
        <div className="mb-4">
          <h4 className="text-white font-medium mb-3">🍽️ Alimentos:</h4>
          <div className="space-y-2">
            {meal.itens.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                <div className="flex-1">
                  <div className="text-white font-medium">{item.nome}</div>
                  <div className="text-white/60 text-sm">{item.quantidade}</div>
                  {item.observacoes && (
                    <div className="text-white/50 text-xs italic">{item.observacoes}</div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-white/80 text-sm">{item.calorias} cal</div>
                  <div className="text-white/60 text-xs">
                    P: {item.proteinas}g | C: {item.carboidratos}g | G: {item.gorduras}g
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        {meal.observacoes && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="text-blue-400 text-sm font-medium mb-1">📝 Observações:</div>
            <div className="text-white/80 text-sm">{meal.observacoes}</div>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Botões de Status */}
          <div className="flex gap-2">
            <Button
              onClick={() => onStatusChange(meal.id, 'consumida')}
              variant={meal.status === 'consumida' ? 'primary' : 'secondary'}
              size="sm"
              className="flex-1"
              disabled={meal.status === 'consumida'}
            >
              ✅ Consumida
            </Button>
            <Button
              onClick={() => onStatusChange(meal.id, 'pulada')}
              variant={meal.status === 'pulada' ? 'primary' : 'secondary'}
              size="sm"
              className="flex-1"
              disabled={meal.status === 'pulada'}
            >
              ⏭️ Pulada
            </Button>
          </div>
          
          {/* Botões de Edição */}
          <div className="flex gap-2">
            <Button
              onClick={() => onEdit(meal)}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              ✏️ Editar
            </Button>
            <Button
              onClick={() => onDelete(meal.id)}
              variant="secondary"
              size="sm"
              className="flex-1"
            >
              🗑️ Excluir
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MealCard;
