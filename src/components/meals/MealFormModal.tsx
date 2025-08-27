import React, { useState, useEffect } from 'react';
import Card from '../Card';
import Button from '../Button';

import { UserMeal, CreateMealRequest, MealItem } from '../../types';

interface MealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mealData: CreateMealRequest) => Promise<void>;
  meal?: UserMeal | null;
  isSubmitting?: boolean;
}

const MealFormModal: React.FC<MealFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  meal,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<CreateMealRequest>({
    nome: '',
    categoria: 'cafe',
    horario: '08:00',
    data: new Date().toISOString().split('T')[0],
    itens: [],
    observacoes: ''
  });

  const [newItem, setNewItem] = useState<Omit<MealItem, 'id'>>({
    nome: '',
    quantidade: '',
    calorias: 0,
    proteinas: 0,
    carboidratos: 0,
    gorduras: 0,
    observacoes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Preencher formulário quando editar
  useEffect(() => {
    if (meal) {
      setFormData({
        nome: meal.nome,
        categoria: meal.categoria,
        horario: meal.horario,
        data: meal.data,
        itens: meal.itens.map(item => ({
          nome: item.nome,
          quantidade: item.quantidade,
          calorias: item.calorias,
          proteinas: item.proteinas,
          carboidratos: item.carboidratos,
          gorduras: item.gorduras,
          observacoes: item.observacoes || ''
        })),
        observacoes: meal.observacoes || ''
      });
    } else {
      // Reset para nova refeição
      setFormData({
        nome: '',
        categoria: 'cafe',
        horario: '08:00',
        data: new Date().toISOString().split('T')[0],
        itens: [],
        observacoes: ''
      });
    }
    setNewItem({
      nome: '',
      quantidade: '',
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0,
      observacoes: ''
    });
    setErrors({});
  }, [meal, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome da refeição é obrigatório';
    }

    if (!formData.horario) {
      newErrors.horario = 'Horário é obrigatório';
    }

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória';
    }

    if (formData.itens.length === 0) {
      newErrors.itens = 'Adicione pelo menos um alimento';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar refeição:', error);
    }
  };

  const addItem = () => {
    if (!newItem.nome.trim() || !newItem.quantidade.trim()) return;

    setFormData(prev => ({
      ...prev,
      itens: [...prev.itens, { ...newItem, id: `temp_${Date.now()}` }]
    }));

    setNewItem({
      nome: '',
      quantidade: '',
      calorias: 0,
      proteinas: 0,
      carboidratos: 0,
      gorduras: 0,
      observacoes: ''
    });
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof MealItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      itens: prev.itens.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              {meal ? '✏️ Editar Refeição' : '🍽️ Nova Refeição'}
            </h2>
            <Button
              onClick={onClose}
              variant="secondary"
              size="sm"
              className="p-2"
            >
              ✕
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="mb-4">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Nome da Refeição <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Ex: Café da Manhã Energético"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
                {errors.nome && (
                  <p className="text-red-400 text-xs mt-1">{errors.nome}</p>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Categoria <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                >
                  <option value="cafe">☕ Café da Manhã</option>
                  <option value="lanche">🍎 Lanche</option>
                  <option value="almoco">🍽️ Almoço</option>
                  <option value="jantar">🌙 Jantar</option>
                  <option value="ceia">🌃 Ceia</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-white/90 text-sm font-medium mb-2">
                  Horário <span className="text-red-400">*</span>
                </label>
                <input
                  type="time"
                  value={formData.horario}
                  onChange={(e) => setFormData(prev => ({ ...prev, horario: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                  required
                />
                {errors.horario && (
                  <p className="text-red-400 text-xs mt-1">{errors.horario}</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-white/90 text-sm font-medium mb-2">
                Data <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                value={formData.data}
                onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                required
              />
              {errors.data && (
                <p className="text-red-400 text-xs mt-1">{errors.data}</p>
              )}
            </div>

                          {/* Adicionar Novo Item */}
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <h3 className="text-white font-medium mb-4">➕ Adicionar Alimento</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-white/90 text-sm font-medium mb-2">Nome</label>
                    <input
                      type="text"
                      value={newItem.nome}
                      onChange={(e) => setNewItem(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Aveia"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Quantidade</label>
                    <input
                      type="text"
                      value={newItem.quantidade}
                      onChange={(e) => setNewItem(prev => ({ ...prev, quantidade: e.target.value }))}
                      placeholder="Ex: 50g"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Calorias</label>
                    <input
                      type="number"
                      value={newItem.calorias}
                      onChange={(e) => setNewItem(prev => ({ ...prev, calorias: Number(e.target.value) }))}
                      min="0"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Proteínas (g)</label>
                    <input
                      type="number"
                      value={newItem.proteinas}
                      onChange={(e) => setNewItem(prev => ({ ...prev, proteinas: Number(e.target.value) }))}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Carboidratos (g)</label>
                    <input
                      type="number"
                      value={newItem.carboidratos}
                      onChange={(e) => setNewItem(prev => ({ ...prev, carboidratos: Number(e.target.value) }))}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">Gorduras (g)</label>
                    <input
                      type="number"
                      value={newItem.gorduras}
                      onChange={(e) => setNewItem(prev => ({ ...prev, gorduras: Number(e.target.value) }))}
                      min="0"
                      step="0.1"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-white/90 text-sm font-medium mb-2">Observações</label>
                  <input
                    type="text"
                    value={newItem.observacoes}
                    onChange={(e) => setNewItem(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Ex: Integral, orgânico, etc."
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                  />
                </div>
              
              <Button
                type="button"
                onClick={addItem}
                variant="primary"
                size="sm"
                disabled={!newItem.nome.trim() || !newItem.quantidade.trim()}
              >
                ➕ Adicionar Alimento
              </Button>
            </div>

            {/* Lista de Itens */}
            {formData.itens.length > 0 && (
              <div className="bg-white/5 border border-white/20 rounded-lg p-4">
                <h3 className="text-white font-medium mb-4">🍽️ Alimentos da Refeição</h3>
                
                {errors.itens && (
                  <div className="text-red-400 text-sm mb-4">{errors.itens}</div>
                )}
                
                <div className="space-y-3">
                  {formData.itens.map((item, index) => (
                    <div key={index} className="flex items-center justify-between bg-white/10 rounded-lg p-3">
                      <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-3">
                        <div className="md:col-span-2">
                          <input
                            type="text"
                            value={item.nome}
                            onChange={(e) => updateItem(index, 'nome', e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                            placeholder="Nome do alimento"
                          />
                        </div>
                        
                        <input
                          type="text"
                          value={item.quantidade}
                          onChange={(e) => updateItem(index, 'quantidade', e.target.value)}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                          placeholder="Quantidade"
                        />
                        
                        <input
                          type="number"
                          value={item.calorias}
                          onChange={(e) => updateItem(index, 'calorias', Number(e.target.value))}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                          placeholder="Calorias"
                          min="0"
                        />
                        
                        <input
                          type="number"
                          value={item.proteinas}
                          onChange={(e) => updateItem(index, 'proteinas', Number(e.target.value))}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                          placeholder="Proteínas"
                          min="0"
                          step="0.1"
                        />
                        
                        <input
                          type="number"
                          value={item.carboidratos}
                          onChange={(e) => updateItem(index, 'carboidratos', Number(e.target.value))}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                          placeholder="Carboidratos"
                          min="0"
                          step="0.1"
                        />
                        
                        <input
                          type="number"
                          value={item.gorduras}
                          onChange={(e) => updateItem(index, 'gorduras', Number(e.target.value))}
                          className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
                          placeholder="Gorduras"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      
                      <Button
                        type="button"
                        onClick={() => removeItem(index)}
                        variant="secondary"
                        size="sm"
                        className="ml-3 p-2"
                      >
                        🗑️
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observações */}
            <div className="mb-4">
              <label className="block text-white/90 text-sm font-medium mb-2">Observações da Refeição</label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Ex: Refeição pré-treino, sem glúten, etc."
                rows={3}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500 resize-none"
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? '💾 Salvando...' : (meal ? '💾 Atualizar Refeição' : '➕ Criar Refeição')}
              </Button>
              
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                size="lg"
                className="flex-1"
                disabled={isSubmitting}
              >
                ❌ Cancelar
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default MealFormModal;
