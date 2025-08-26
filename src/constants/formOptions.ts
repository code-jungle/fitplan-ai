// Opções para os campos de seleção do formulário de cadastro

export const FORM_OPTIONS = {
  sexo: [
    { value: 'masculino', label: 'Masculino' },
    { value: 'feminino', label: 'Feminino' },
    { value: 'outro', label: 'Outro' }
  ],

  nivelAtividade: [
    { value: 'sedentario', label: 'Sedentário' },
    { value: 'leve', label: 'Leve' },
    { value: 'moderado', label: 'Moderado' },
    { value: 'ativo', label: 'Ativo' },
    { value: 'muito-ativo', label: 'Muito Ativo' }
  ],

  objetivo: [
    { value: 'perder-peso', label: 'Perder Peso' },
    { value: 'ganhar-massa', label: 'Ganhar Massa' },
    { value: 'manter-peso', label: 'Manter Peso' },
    { value: 'melhorar-saude', label: 'Melhorar Saúde' },
    { value: 'ganhar-forca', label: 'Ganhar Força' }
  ],

  restricoesAlimentares: [
    { value: 'lactose', label: 'Lactose' },
    { value: 'gluten', label: 'Gluten' },
    { value: 'frutos-mar', label: 'Frutos do Mar' },
    { value: 'amendoim', label: 'Amendoim' },
    { value: 'soja', label: 'Soja' },
    { value: 'ovo', label: 'Ovo' },
    { value: 'nenhuma', label: 'Nenhuma' }
  ],

  preferencias: [
    { value: 'exercicios-cardio', label: 'Exercícios Cardio' },
    { value: 'musculacao', label: 'Musculação' },
    { value: 'yoga-pilates', label: 'Yoga/Pilates' },
    { value: 'esportes', label: 'Esportes' },
    { value: 'dieta-vegetariana', label: 'Dieta Vegetariana' },
    { value: 'dieta-vegana', label: 'Dieta Vegana' },
    { value: 'dieta-low-carb', label: 'Low Carb' },
    { value: 'dieta-mediterranea', label: 'Mediterrânea' }
  ]
};
