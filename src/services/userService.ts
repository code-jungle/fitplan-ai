import { api } from './api';
import { CreateUserRequest, User } from '../types';

export interface CadastroResult {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

export class UserService {
  static async cadastrarUsuario(userData: CreateUserRequest): Promise<CadastroResult> {
    try {
      // Validação adicional no serviço
      const validationResult = this.validateUserData(userData);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.error
        };
      }

      // Chama a API
      const result = await api.createUser(userData);
      
      return {
        success: true,
        user: result.user,
        token: result.token
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido ao cadastrar usuário'
      };
    }
  }

  private static validateUserData(userData: CreateUserRequest): { isValid: boolean; error?: string } {
    // Validações de negócio específicas
    if (userData.peso < 30) {
      return { isValid: false, error: 'Peso mínimo é 30kg' };
    }

    if (userData.peso > 300) {
      return { isValid: false, error: 'Peso máximo é 300kg' };
    }

    if (userData.altura < 100) {
      return { isValid: false, error: 'Altura mínima é 100cm' };
    }

    if (userData.altura > 250) {
      return { isValid: false, error: 'Altura máxima é 250cm' };
    }

    if (userData.idade < 13) {
      return { isValid: false, error: 'Idade mínima é 13 anos' };
    }

    if (userData.idade > 120) {
      return { isValid: false, error: 'Idade máxima é 120 anos' };
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userData.email)) {
      return { isValid: false, error: 'Formato de email inválido' };
    }

    return { isValid: true };
  }

  static calcularIMC(peso: number, altura: number): number {
    const alturaEmMetros = altura / 100;
    return peso / (alturaEmMetros * alturaEmMetros);
  }

  static getCategoriaIMC(imc: number): string {
    if (imc < 18.5) return 'Abaixo do peso';
    if (imc < 25) return 'Peso normal';
    if (imc < 30) return 'Sobrepeso';
    if (imc < 35) return 'Obesidade grau 1';
    if (imc < 40) return 'Obesidade grau 2';
    return 'Obesidade grau 3';
  }

  static getCaloriasBasais(peso: number, altura: number, idade: number, sexo: string): number {
    // Fórmula de Harris-Benedict
    if (sexo === 'masculino') {
      return 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * idade);
    } else {
      return 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * idade);
    }
  }
}
