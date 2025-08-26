import React, { useState } from 'react';
import Card from '../Card';
import Button from '../Button';

interface UpdateProgressData {
  peso: number;
  altura?: number;
  calorias: number;
  exercicios: number;
  agua: number;
  sono: number;
  estresse: number;
  observacoes?: string;
}

interface UpdateProgressFormProps {
  currentWeight: number;
  currentHeight: number;
  onSubmit: (data: UpdateProgressData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const UpdateProgressForm: React.FC<UpdateProgressFormProps> = ({
  currentWeight,
  currentHeight,
  onSubmit,
  onCancel,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<UpdateProgressData>({
    peso: currentWeight,
    altura: currentHeight,
    calorias: 2000,
    exercicios: 3,
    agua: 2.5,
    sono: 7,
    estresse: 3
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (formData.peso < 30 || formData.peso > 300) {
      newErrors.peso = 'Peso deve estar entre 30kg e 300kg';
    }

    if (formData.altura && (formData.altura < 100 || formData.altura > 250)) {
      newErrors.altura = 'Altura deve estar entre 100cm e 250cm';
    }

    if (formData.calorias < 500 || formData.calorias > 5000) {
      newErrors.calorias = 'Calorias devem estar entre 500 e 5000';
    }

    if (formData.exercicios < 0 || formData.exercicios > 10) {
      newErrors.exercicios = 'Exercícios devem estar entre 0 e 10';
    }

    if (formData.agua < 0 || formData.agua > 10) {
      newErrors.agua = 'Água deve estar entre 0L e 10L';
    }

    if (formData.sono < 0 || formData.sono > 24) {
      newErrors.sono = 'Sono deve estar entre 0h e 24h';
    }

    if (formData.estresse < 1 || formData.estresse > 10) {
      newErrors.estresse = 'Estresse deve estar entre 1 e 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      await onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UpdateProgressData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const getEstresseLabel = (value: number): string => {
    if (value <= 2) return 'Muito Baixo';
    if (value <= 4) return 'Baixo';
    if (value <= 6) return 'Moderado';
    if (value <= 8) return 'Alto';
    return 'Muito Alto';
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="futuristic-text text-2xl mb-2">Atualizar Progresso</h2>
        <p className="text-white/70">Registre suas métricas diárias para acompanhar sua evolução</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Peso e Altura */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Peso Atual (kg) *
            </label>
            <input
              type="number"
              value={formData.peso}
              onChange={(e) => handleInputChange('peso', parseFloat(e.target.value) || 0)}
              className={`w-full px-4 py-3 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300 ${
                errors.peso ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="75.5"
              step="0.1"
              min="30"
              max="300"
              required
            />
            {errors.peso && <p className="text-red-400 text-sm mt-1">{errors.peso}</p>}
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Altura (cm)
            </label>
            <input
              type="number"
              value={formData.altura}
              onChange={(e) => handleInputChange('altura', parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-3 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300 ${
                errors.altura ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="175"
              min="100"
              max="250"
            />
            {errors.altura && <p className="text-red-400 text-sm mt-1">{errors.altura}</p>}
          </div>
        </div>

        {/* Nutrição */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Calorias Consumidas *
            </label>
            <input
              type="number"
              value={formData.calorias}
              onChange={(e) => handleInputChange('calorias', parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-3 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300 ${
                errors.calorias ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="2000"
              min="500"
              max="5000"
              required
            />
            {errors.calorias && <p className="text-red-400 text-sm mt-1">{errors.calorias}</p>}
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Água Consumida (L) *
            </label>
            <input
              type="number"
              value={formData.agua}
              onChange={(e) => handleInputChange('agua', parseFloat(e.target.value) || 0)}
              className={`w-full px-4 py-3 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300 ${
                errors.agua ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="2.5"
              step="0.1"
              min="0"
              max="10"
              required
            />
            {errors.agua && <p className="text-red-400 text-sm mt-1">{errors.agua}</p>}
          </div>
        </div>

        {/* Atividade e Bem-estar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Exercícios Realizados *
            </label>
            <input
              type="number"
              value={formData.exercicios}
              onChange={(e) => handleInputChange('exercicios', parseInt(e.target.value) || 0)}
              className={`w-full px-4 py-3 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300 ${
                errors.exercicios ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="3"
              min="0"
              max="10"
              required
            />
            {errors.exercicios && <p className="text-red-400 text-sm mt-1">{errors.exercicios}</p>}
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Horas de Sono *
            </label>
            <input
              type="number"
              value={formData.sono}
              onChange={(e) => handleInputChange('sono', parseFloat(e.target.value) || 0)}
              className={`w-full px-4 py-3 border rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300 ${
                errors.sono ? 'border-red-400' : 'border-white/20'
              }`}
              placeholder="7"
              step="0.5"
              min="0"
              max="24"
              required
            />
            {errors.sono && <p className="text-red-400 text-sm mt-1">{errors.sono}</p>}
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Nível de Estresse (1-10) *
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.estresse}
              onChange={(e) => handleInputChange('estresse', parseInt(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-white/60 mt-1">
              <span>1</span>
              <span className="text-white font-medium">{formData.estresse} - {getEstresseLabel(formData.estresse)}</span>
              <span>10</span>
            </div>
            {errors.estresse && <p className="text-red-400 text-sm mt-1">{errors.estresse}</p>}
          </div>
        </div>

        {/* Observações */}
        <div>
          <label className="block text-white/90 text-sm font-medium mb-2">
            Observações (opcional)
          </label>
          <textarea
            value={formData.observacoes}
            onChange={(e) => handleInputChange('observacoes', e.target.value)}
            className="w-full px-4 py-3 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-mint-300 focus:border-transparent transition-all duration-300"
            placeholder="Como você se sentiu hoje? Alguma dificuldade ou conquista?"
            rows={3}
          />
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
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
  );
};

export default UpdateProgressForm;
