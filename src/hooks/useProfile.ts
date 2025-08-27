import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileService } from '../services/profileService';
import { UserProfile, UpdateProfileRequest, ProfileStats } from '../types';

export const useProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar perfil do usuário
  const loadProfile = useCallback(async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);

    try {
      const [userProfile, userStats] = await Promise.all([
        ProfileService.getUserProfile(user.id),
        ProfileService.getProfileStats(user.id)
      ]);

      setProfile(userProfile);
      setStats(userStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Atualizar perfil do usuário
  const updateProfile = useCallback(async (updates: UpdateProfileRequest) => {
    if (!user?.id || !profile) return null;

    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await ProfileService.updateUserProfile(user.id, updates);
      if (updatedProfile) {
        setProfile(updatedProfile);
        return updatedProfile;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, profile]);

  // Atualizar avatar do usuário
  const updateAvatar = useCallback(async (avatarUrl: string) => {
    if (!user?.id) return null;

    setIsLoading(true);
    setError(null);

    try {
      const updatedProfile = await ProfileService.updateUserAvatar(user.id, avatarUrl);
      if (updatedProfile) {
        setProfile(updatedProfile);
        return updatedProfile;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar avatar');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Atualizar estatísticas do perfil
  const updateStats = useCallback(async (statsUpdates: Partial<ProfileStats>) => {
    if (!user?.id) return null;

    setIsLoading(true);
    setError(null);

    try {
      const updatedStats = await ProfileService.updateProfileStats(user.id, statsUpdates);
      if (updatedStats) {
        setStats(updatedStats);
        return updatedStats;
      }
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar estatísticas');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Deletar perfil do usuário
  const deleteProfile = useCallback(async () => {
    if (!user?.id) return false;

    setIsLoading(true);
    setError(null);

    try {
      const success = await ProfileService.deleteUserProfile(user.id);
      if (success) {
        setProfile(null);
        setStats(null);
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao deletar perfil');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Exportar dados do perfil
  const exportProfileData = useCallback(async () => {
    if (!user?.id) return null;

    setIsLoading(true);
    setError(null);

    try {
      const exportData = await ProfileService.exportProfileData(user.id);
      return exportData;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao exportar dados');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Limpar erro
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Carregar perfil quando o usuário mudar
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    profile,
    stats,
    isLoading,
    error,
    loadProfile,
    updateProfile,
    updateAvatar,
    updateStats,
    deleteProfile,
    exportProfileData,
    clearError
  };
};
