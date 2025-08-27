import { UserProfile, UpdateProfileRequest, ProfileStats } from '../types';

export class ProfileService {
  private static readonly STORAGE_KEY = 'fitplan_user_profile';
  private static readonly STATS_KEY = 'fitplan_profile_stats';

  // Buscar perfil do usuário
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      // TODO: Integrar com Supabase
      // const { data, error } = await supabase
      //   .from('user_profiles')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();

      // Mock temporário - remover quando integrar com banco
      const storedProfile = localStorage.getItem(this.STORAGE_KEY);
      if (storedProfile) {
        return JSON.parse(storedProfile);
      }

      // Perfil padrão para demonstração
      const defaultProfile: UserProfile = {
        id: userId,
        nome: 'Usuário FitPlan',
        email: 'usuario@fitplan.ai',
        idade: 25,
        peso: 70,
        altura: 170,
        sexo: 'masculino',
        restricoesAlimentares: [],
        preferencias: [],
        nivelAtividade: 'moderado',
        objetivo: 'ganhar-massa',
        dataCadastro: new Date().toISOString(),
        avatar: '',
        bio: 'Apaixonado por fitness e saúde!',
        telefone: '',
        endereco: {
          cidade: 'São Paulo',
          estado: 'SP',
          pais: 'Brasil'
        },
        redesSociais: {
          instagram: '',
          facebook: '',
          twitter: ''
        },
        configuracoes: {
          notificacoes: true,
          privacidade: 'publico',
          tema: 'auto'
        }
      };

      return defaultProfile;
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }
  }

  // Atualizar perfil do usuário
  static async updateUserProfile(userId: string, updates: UpdateProfileRequest): Promise<UserProfile | null> {
    try {
      // TODO: Integrar com Supabase
      // const { data, error } = await supabase
      //   .from('user_profiles')
      //   .update(updates)
      //   .eq('user_id', userId)
      //   .select()
      //   .single();

      // Mock temporário - remover quando integrar com banco
      const currentProfile = await this.getUserProfile(userId);
      if (!currentProfile) {
        throw new Error('Perfil não encontrado');
      }

      const updatedProfile: UserProfile = {
        ...currentProfile,
        ...updates
      };

      // Salvar no localStorage temporariamente
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedProfile));

      return updatedProfile;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      return null;
    }
  }

  // Atualizar avatar do usuário
  static async updateUserAvatar(userId: string, avatarUrl: string): Promise<UserProfile | null> {
    try {
      // TODO: Integrar com Supabase Storage para upload de imagem
      // const { data, error } = await supabase.storage
      //   .from('avatars')
      //   .upload(`${userId}/avatar.jpg`, avatarFile);

      return await this.updateUserProfile(userId, { avatar: avatarUrl });
    } catch (error) {
      console.error('Erro ao atualizar avatar do usuário:', error);
      return null;
    }
  }

  // Buscar estatísticas do perfil
  static async getProfileStats(userId: string): Promise<ProfileStats | null> {
    try {
      // TODO: Integrar com Supabase para buscar dados reais
      // const { data, error } = await supabase
      //   .from('user_stats')
      //   .select('*')
      //   .eq('user_id', userId)
      //   .single();

      // Mock temporário - remover quando integrar com banco
      const storedStats = localStorage.getItem(this.STATS_KEY);
      if (storedStats) {
        return JSON.parse(storedStats);
      }

      // Estatísticas padrão para demonstração
      const defaultStats: ProfileStats = {
        diasAtivo: 30,
        treinosCompletos: 25,
        refeicoesRegistradas: 120,
        pesoInicial: 75,
        pesoAtual: 70,
        variacaoPeso: -5,
        metaProxima: 'Atingir 68kg até o final do mês'
      };

      return defaultStats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas do perfil:', error);
      return null;
    }
  }

  // Atualizar estatísticas do perfil
  static async updateProfileStats(userId: string, stats: Partial<ProfileStats>): Promise<ProfileStats | null> {
    try {
      // TODO: Integrar com Supabase
      // const { data, error } = await supabase
      //   .from('user_stats')
      //   .upsert({ user_id: userId, ...stats })
      //   .select()
      //   .single();

      // Mock temporário - remover quando integrar com banco
      const currentStats = await this.getProfileStats(userId);
      if (!currentStats) {
        throw new Error('Estatísticas não encontradas');
      }

      const updatedStats: ProfileStats = {
        ...currentStats,
        ...stats
      };

      // Salvar no localStorage temporariamente
      localStorage.setItem(this.STATS_KEY, JSON.stringify(updatedStats));

      return updatedStats;
    } catch (error) {
      console.error('Erro ao atualizar estatísticas do perfil:', error);
      return null;
    }
  }

  // Deletar perfil do usuário
  static async deleteUserProfile(userId: string): Promise<boolean> {
    try {
      // TODO: Integrar com Supabase
      // const { error } = await supabase
      //   .from('user_profiles')
      //   .delete()
      //   .eq('user_id', userId);

      // Mock temporário - remover quando integrar com banco
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.STATS_KEY);

      return true;
    } catch (error) {
      console.error('Erro ao deletar perfil do usuário:', error);
      return false;
    }
  }

  // Exportar dados do perfil
  static async exportProfileData(userId: string): Promise<string> {
    try {
      const profile = await this.getUserProfile(userId);
      const stats = await this.getProfileStats(userId);

      const exportData = {
        profile,
        stats,
        exportDate: new Date().toISOString(),
        version: '1.0'
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Erro ao exportar dados do perfil:', error);
      throw error;
    }
  }
}
