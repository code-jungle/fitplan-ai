import React, { useState, useRef } from 'react';
import { UserProfile } from '../../types';

interface AvatarUploaderProps {
  profile: UserProfile;
  onAvatarUpdate: (avatarUrl: string) => void;
  className?: string;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  profile,
  onAvatarUpdate,
  className = ''
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gerar inicial do nome para avatar padrão
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Gerar cor baseada no nome do usuário
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-red-500 to-red-600',
      'bg-gradient-to-br from-yellow-500 to-yellow-600',
      'bg-gradient-to-br from-teal-500 to-teal-600'
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  // Simular upload de arquivo
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // TODO: Integrar com Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload(`${profile.id}/avatar.jpg`, file);

      // Simular delay de upload
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Criar URL temporária para demonstração
      const avatarUrl = URL.createObjectURL(file);
      
      // Chamar callback para atualizar avatar
      onAvatarUpdate(avatarUrl);
      
      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError('Erro ao fazer upload da imagem. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  // Abrir seletor de arquivo
  const handleAvatarClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remover avatar
  const handleRemoveAvatar = () => {
    onAvatarUpdate('');
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Avatar */}
      <div className="relative group">
        <div
          onClick={handleAvatarClick}
          className={`
            w-32 h-32 rounded-full cursor-pointer transition-all duration-300
            group-hover:scale-105 group-hover:shadow-2xl
            ${isUploading ? 'opacity-50' : ''}
          `}
        >
          {profile.avatar ? (
            // Avatar personalizado
            <img
              src={profile.avatar}
              alt={`Avatar de ${profile.nome}`}
              className="w-full h-full rounded-full object-cover border-4 border-white/20 shadow-xl"
            />
          ) : (
            // Avatar com inicial
            <div
              className={`
                w-full h-full rounded-full flex items-center justify-center
                text-4xl font-bold text-white border-4 border-white/20 shadow-xl
                ${getAvatarColor(profile.nome)}
              `}
            >
              {getInitials(profile.nome)}
            </div>
          )}
          
          {/* Overlay de upload */}
          <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-2xl mb-1">📷</div>
              <div className="text-xs">Clique para alterar</div>
            </div>
          </div>

          {/* Indicador de carregamento */}
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          )}
        </div>

        {/* Botão remover avatar */}
        {profile.avatar && (
          <button
            onClick={handleRemoveAvatar}
            className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm transition-colors duration-200"
            title="Remover avatar"
          >
            ×
          </button>
        )}
      </div>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileUpload(file);
          }
        }}
        className="hidden"
      />

      {/* Mensagens de erro */}
      {error && (
        <div className="text-red-400 text-sm text-center max-w-xs">
          {error}
        </div>
      )}

      {/* Informações do usuário */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-1">
          {profile.nome}
        </h3>
        <p className="text-white/70 text-sm">
          {profile.email}
        </p>
        {profile.bio && (
          <p className="text-white/80 text-sm mt-2 max-w-xs">
            {profile.bio}
          </p>
        )}
      </div>

      {/* Botões de ação */}
      <div className="flex space-x-3">
        <button
          onClick={handleAvatarClick}
          disabled={isUploading}
          className="px-4 py-2 bg-mint-500 hover:bg-mint-600 disabled:bg-mint-400 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          {isUploading ? 'Enviando...' : 'Alterar Avatar'}
        </button>
        
        {profile.avatar && (
          <button
            onClick={handleRemoveAvatar}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            Remover
          </button>
        )}
      </div>
    </div>
  );
};

export default AvatarUploader;
