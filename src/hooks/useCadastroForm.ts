import { useState, useCallback } from 'react';
import { CreateUserRequest } from '../types';

interface FormErrors {
  [key: string]: string;
}

export const useCadastroForm = () => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    nome: '',
    email: '',
    idade: 0,
    peso: 0,
    altura: 0,
    sexo: 'masculino',
    restricoesAlimentares: [],
    preferencias: [],
    nivelAtividade: 'moderado',
    objetivo: 'perder-peso'
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback((field: keyof CreateUserRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpa erro do campo quando usuário começa a digitar
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [errors]);

  const updateArrayField = useCallback((field: keyof CreateUserRequest, value: string, action: 'add' | 'remove') => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      let newArray: string[];

      if (action === 'add') {
        newArray = [...currentArray, value];
      } else {
        newArray = currentArray.filter(item => item !== value);
      }

      return { ...prev, [field]: newArray };
    });
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Validações básicas
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.idade || formData.idade < 13 || formData.idade > 120) {
      newErrors.idade = 'Idade deve estar entre 13 e 120 anos';
    }

    if (!formData.peso || formData.peso < 30 || formData.peso > 300) {
      newErrors.peso = 'Peso deve estar entre 30kg e 300kg';
    }

    if (!formData.altura || formData.altura < 100 || formData.altura > 250) {
      newErrors.altura = 'Altura deve estar entre 100cm e 250cm';
    }

    if (!formData.sexo) {
      newErrors.sexo = 'Sexo é obrigatório';
    }

    if (!formData.nivelAtividade) {
      newErrors.nivelAtividade = 'Nível de atividade é obrigatório';
    }

    if (!formData.objetivo) {
      newErrors.objetivo = 'Objetivo é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      nome: '',
      email: '',
      idade: 0,
      peso: 0,
      altura: 0,
      sexo: 'masculino',
      restricoesAlimentares: [],
      preferencias: [],
      nivelAtividade: 'moderado',
      objetivo: 'perder-peso'
    });
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    setIsSubmitting,
    updateField,
    updateArrayField,
    validateForm,
    resetForm
  };
};
