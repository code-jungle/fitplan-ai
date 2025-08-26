import React from 'react';
import Card from '../Card';
import { User } from '../../types';

interface UserProfileCardProps {
  user: User;
  className?: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  className = ''
}) => {
  const formatObjective = (objective: string) => {
    return objective.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatActivityLevel = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1);
  };

  return (
    <Card className={`${className}`}>
      <h2 className="futuristic-text text-2xl mb-6">Informações do Perfil</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dados Pessoais */}
        <div>
          <h3 className="font-orbitron font-semibold text-lg mb-4 text-mint-400">Dados Pessoais</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Nome:</span>
              <span className="text-white font-medium">{user.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Email:</span>
              <span className="text-white font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Idade:</span>
              <span className="text-white font-medium">{user.idade} anos</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Sexo:</span>
              <span className="text-white font-medium capitalize">{user.sexo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Data de Cadastro:</span>
              <span className="text-white font-medium">{user.dataCadastro}</span>
            </div>
          </div>
        </div>

        {/* Medidas e Objetivos */}
        <div>
          <h3 className="font-orbitron font-semibold text-lg mb-4 text-lavanda-400">Medidas e Objetivos</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-white/70">Peso:</span>
              <span className="text-white font-medium">{user.peso} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Altura:</span>
              <span className="text-white font-medium">{user.altura} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Nível de Atividade:</span>
              <span className="text-white font-medium">{formatActivityLevel(user.nivelAtividade)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Objetivo:</span>
              <span className="text-white font-medium">{formatObjective(user.objetivo)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Restrições e Preferências */}
      {(user.restricoesAlimentares.length > 0 || user.preferencias.length > 0) && (
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="font-orbitron font-semibold text-lg mb-4 text-blue-400">Preferências e Restrições</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user.restricoesAlimentares.length > 0 && (
              <div>
                <h4 className="text-white/80 font-medium mb-2">Restrições Alimentares:</h4>
                <div className="flex flex-wrap gap-2">
                  {user.restricoesAlimentares.map((restricao, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-400 text-sm"
                    >
                      {restricao}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {user.preferencias.length > 0 && (
              <div>
                <h4 className="text-white/80 font-medium mb-2">Preferências:</h4>
                <div className="flex flex-wrap gap-2">
                  {user.preferencias.map((preferencia, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-mint-500/20 border border-mint-500/30 rounded-full text-mint-400 text-sm"
                    >
                      {preferencia}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default UserProfileCard;
