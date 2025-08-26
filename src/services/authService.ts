import { api } from './api';
import { LoginRequest, AuthResponse, User } from '../types';

export interface LoginResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'fitplan_token';
  private static readonly USER_KEY = 'fitplan_user';
  private static readonly EXPIRES_KEY = 'fitplan_expires';

  // Login do usuário
  static async login(credentials: LoginRequest): Promise<LoginResult> {
    try {
      console.log('Tentando fazer login com:', credentials.email);
      
      const response = await api.login(credentials);
      
      if (response.success && response.user && response.token) {
        // Salvar dados da sessão
        if (response.expiresAt) {
          this.saveSession(response.user, response.token, response.expiresAt);
        } else {
          // Se não houver expiresAt, criar um padrão de 24 horas
          const expiresAt = new Date();
          expiresAt.setHours(expiresAt.getHours() + 24);
          this.saveSession(response.user, response.token, expiresAt.toISOString());
        }
        console.log('Login realizado com sucesso para:', response.user.nome);
        return { success: true, user: response.user, token: response.token };
      } else {
        console.error('Falha no login:', response.error);
        return { success: false, error: response.error || 'Falha na autenticação' };
      }
    } catch (error) {
      console.error('Erro durante login:', error);
      return { success: false, error: 'Erro de conexão. Tente novamente.' };
    }
  }

  // Logout do usuário
  static logout(): void {
    console.log('Fazendo logout...');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem(this.EXPIRES_KEY);
    console.log('Sessão removida com sucesso');
  }

  // Verificar se o usuário está autenticado
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    const expiresAt = this.getExpiresAt();

    if (!token || !user || !expiresAt) {
      return false;
    }

    // Verificar se o token não expirou
    const now = new Date();
    const expirationDate = new Date(expiresAt);
    
    if (now >= expirationDate) {
      console.log('Token expirado, fazendo logout automático');
      this.logout();
      return false;
    }

    return true;
  }

  // Obter usuário atual
  static getUser(): User | null {
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }

  // Obter token atual
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obter data de expiração
  static getExpiresAt(): string | null {
    return localStorage.getItem(this.EXPIRES_KEY);
  }

  // Salvar sessão
  private static saveSession(user: User, token: string, expiresAt: string): void {
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.EXPIRES_KEY, expiresAt);
      console.log('Sessão salva com sucesso');
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  }

  // Renovar sessão (útil para manter usuário logado)
  static refreshSession(): boolean {
    if (this.isAuthenticated()) {
      const user = this.getUser();
      const token = this.getToken();
      const expiresAt = this.getExpiresAt();
      
      if (user && token && expiresAt) {
        // Renovar por mais 24 horas
        const newExpiresAt = new Date();
        newExpiresAt.setHours(newExpiresAt.getHours() + 24);
        
        this.saveSession(user, token, newExpiresAt.toISOString());
        console.log('Sessão renovada com sucesso');
        return true;
      }
    }
    return false;
  }

  // Verificar se o token está próximo de expirar
  static isTokenExpiringSoon(): boolean {
    const expiresAt = this.getExpiresAt();
    if (!expiresAt) return false;

    const now = new Date();
    const expirationDate = new Date(expiresAt);
    const timeUntilExpiry = expirationDate.getTime() - now.getTime();
    const oneHour = 60 * 60 * 1000; // 1 hora em milissegundos

    return timeUntilExpiry < oneHour;
  }
}
