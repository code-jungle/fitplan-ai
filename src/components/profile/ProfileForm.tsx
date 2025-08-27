import React, { useState, useEffect } from 'react';
import { UserProfile, UpdateProfileRequest } from '../../types';

interface ProfileFormProps {
  profile: UserProfile;
  onSave: (updates: UpdateProfileRequest) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onSave,
  isLoading = false,
  className = ''
}) => {
  const [formData, setFormData] = useState<UpdateProfileRequest>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  // Inicializar formulário com dados do perfil
  useEffect(() => {
    setFormData({
      nome: profile.nome,
      idade: profile.idade,
      peso: profile.peso,
      altura: profile.altura,
      sexo: profile.sexo,
      objetivo: profile.objetivo,
      bio: profile.bio || '',
      telefone: profile.telefone || '',
      endereco: profile.endereco ? { ...profile.endereco } : undefined,
      redesSociais: profile.redesSociais ? { ...profile.redesSociais } : undefined
    });
    setIsDirty(false);
  }, [profile]);

  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome?.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (formData.idade !== undefined && (formData.idade < 13 || formData.idade > 120)) {
      newErrors.idade = 'Idade deve estar entre 13 e 120 anos';
    }

    if (formData.peso !== undefined && (formData.peso < 30 || formData.peso > 300)) {
      newErrors.peso = 'Peso deve estar entre 30kg e 300kg';
    }

    if (formData.altura !== undefined && (formData.altura < 100 || formData.altura > 250)) {
      newErrors.altura = 'Altura deve estar entre 100cm e 250cm';
    }

    if (formData.telefone && !/^[\d\s\-\(\)\+]+$/.test(formData.telefone)) {
      newErrors.telefone = 'Telefone deve conter apenas números, espaços, hífens e parênteses';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Atualizar campo do formulário
  const handleFieldChange = (field: keyof UpdateProfileRequest, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    
    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Atualizar campo de endereço
  const handleAddressChange = (field: 'cidade' | 'estado' | 'pais', value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        cidade: prev.endereco?.cidade || '',
        estado: prev.endereco?.estado || '',
        pais: prev.endereco?.pais || '',
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  // Atualizar campo de redes sociais
  const handleSocialChange = (field: 'instagram' | 'facebook' | 'twitter', value: string) => {
    setFormData(prev => ({
      ...prev,
      redesSociais: {
        instagram: prev.redesSociais?.instagram || '',
        facebook: prev.redesSociais?.facebook || '',
        twitter: prev.redesSociais?.twitter || '',
        [field]: value
      }
    }));
    setIsDirty(true);
  };

  // Salvar formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSave(formData);
      setIsDirty(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    }
  };

  // Resetar formulário
  const handleReset = () => {
    setFormData({
      nome: profile.nome,
      idade: profile.idade,
      peso: profile.peso,
      altura: profile.altura,
      sexo: profile.sexo,
      objetivo: profile.objetivo,
      bio: profile.bio || '',
      telefone: profile.telefone || '',
      endereco: profile.endereco ? { ...profile.endereco } : undefined,
      redesSociais: profile.redesSociais ? { ...profile.redesSociais } : undefined
    });
    setErrors({});
    setIsDirty(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* Informações Pessoais */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="w-2 h-2 bg-mint-500 rounded-full mr-3"></span>
          Informações Pessoais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nome */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Nome Completo <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.nome || ''}
              onChange={(e) => handleFieldChange('nome', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="Seu nome completo"
            />
            {errors.nome && (
              <p className="text-red-400 text-xs mt-1">{errors.nome}</p>
            )}
          </div>

          {/* Idade */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Idade
            </label>
            <input
              type="number"
              value={formData.idade || ''}
              onChange={(e) => handleFieldChange('idade', parseInt(e.target.value) || undefined)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="Sua idade"
              min="13"
              max="120"
            />
            {errors.idade && (
              <p className="text-red-400 text-xs mt-1">{errors.idade}</p>
            )}
          </div>

          {/* Peso */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Peso (kg)
            </label>
            <input
              type="number"
              value={formData.peso || ''}
              onChange={(e) => handleFieldChange('peso', parseFloat(e.target.value) || undefined)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="Seu peso em kg"
              min="30"
              max="300"
              step="0.1"
            />
            {errors.peso && (
              <p className="text-red-400 text-xs mt-1">{errors.peso}</p>
            )}
          </div>

          {/* Altura */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Altura (cm)
            </label>
            <input
              type="number"
              value={formData.altura || ''}
              onChange={(e) => handleFieldChange('altura', parseInt(e.target.value) || undefined)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="Sua altura em cm"
              min="100"
              max="250"
            />
            {errors.altura && (
              <p className="text-red-400 text-xs mt-1">{errors.altura}</p>
            )}
          </div>

          {/* Sexo */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Sexo
            </label>
            <select
              value={formData.sexo || ''}
              onChange={(e) => handleFieldChange('sexo', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
            >
              <option value="">Selecione...</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          {/* Objetivo */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Objetivo
            </label>
            <select
              value={formData.objetivo || ''}
              onChange={(e) => handleFieldChange('objetivo', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
            >
              <option value="">Selecione...</option>
              <option value="perder-peso">Perder Peso</option>
              <option value="ganhar-massa">Ganhar Massa</option>
              <option value="manter-peso">Manter Peso</option>
              <option value="melhorar-saude">Melhorar Saúde</option>
              <option value="ganhar-forca">Ganhar Força</option>
            </select>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="w-2 h-2 bg-mint-500 rounded-full mr-3"></span>
          Informações Adicionais
        </h3>
        
        <div className="space-y-4">
          {/* Bio */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Biografia
            </label>
            <textarea
              value={formData.bio || ''}
              onChange={(e) => handleFieldChange('bio', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="Conte um pouco sobre você..."
              rows={3}
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Telefone
            </label>
            <input
              type="tel"
              value={formData.telefone || ''}
              onChange={(e) => handleFieldChange('telefone', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && (
              <p className="text-red-400 text-xs mt-1">{errors.telefone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Endereço */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="w-2 h-2 bg-mint-500 rounded-full mr-3"></span>
          Endereço
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Cidade
            </label>
            <input
              type="text"
              value={formData.endereco?.cidade || ''}
              onChange={(e) => handleAddressChange('cidade', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="Sua cidade"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Estado
            </label>
            <input
              type="text"
              value={formData.endereco?.estado || ''}
              onChange={(e) => handleAddressChange('estado', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="Seu estado"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              País
            </label>
            <input
              type="text"
              value={formData.endereco?.pais || ''}
              onChange={(e) => handleAddressChange('pais', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="Seu país"
            />
          </div>
        </div>
      </div>

      {/* Redes Sociais */}
      <div className="bg-white/5 rounded-lg p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="w-2 h-2 bg-mint-500 rounded-full mr-3"></span>
          Redes Sociais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Instagram
            </label>
            <input
              type="text"
              value={formData.redesSociais?.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="@seu_usuario"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Facebook
            </label>
            <input
              type="text"
              value={formData.redesSociais?.facebook || ''}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="seu.usuario"
            />
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">
              Twitter
            </label>
            <input
              type="text"
              value={formData.redesSociais?.twitter || ''}
              onChange={(e) => handleSocialChange('twitter', e.target.value)}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-mint-500"
              placeholder="@seu_usuario"
            />
          </div>
        </div>
      </div>

      {/* Botões de ação */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          type="submit"
          disabled={!isDirty || isLoading}
          className="flex-1 px-6 py-3 bg-mint-500 hover:bg-mint-600 disabled:bg-mint-400 text-white rounded-lg transition-colors duration-200 font-medium flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Salvando...
            </>
          ) : (
            'Salvar Alterações'
          )}
        </button>

        <button
          type="button"
          onClick={handleReset}
          disabled={!isDirty || isLoading}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white rounded-lg transition-colors duration-200 font-medium border border-white/20"
        >
          Resetar
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
