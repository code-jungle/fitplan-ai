import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';
import { UpdateProgressRequest } from '../../services/dashboardService';

interface UpdateProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateProgressRequest) => Promise<void>;
  isSubmitting: boolean;
  currentWeight?: number;
}

const UpdateProgressModal: React.FC<UpdateProgressModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  currentWeight = 0
}) => {
  const [formData, setFormData] = useState<UpdateProgressRequest>({
    peso: currentWeight,
    calorias: 2000,
    exercicios: 3,
    agua: 2.5
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    onClose();
  };

  const handleInputChange = (field: keyof UpdateProgressRequest, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="futuristic-text text-2xl">Atualizar Progresso</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Peso Atual (kg)
            </label>
            <input
              type="number"
              value={formData.peso}
              onChange={(e) => handleInputChange('peso', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
              placeholder="70.5"
              step="0.1"
              min="30"
              max="300"
              required
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Calorias Consumidas
            </label>
            <input
              type="number"
              value={formData.calorias}
              onChange={(e) => handleInputChange('calorias', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
              placeholder="2000"
              min="500"
              max="5000"
              required
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Exercícios Realizados
            </label>
            <input
              type="number"
              value={formData.exercicios}
              onChange={(e) => handleInputChange('exercicios', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
              placeholder="3"
              min="0"
              max="10"
              required
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Água Consumida (L)
            </label>
            <input
              type="number"
              value={formData.agua}
              onChange={(e) => handleInputChange('agua', parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
              placeholder="2.5"
              step="0.1"
              min="0"
              max="10"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Progresso'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UpdateProgressModal;
