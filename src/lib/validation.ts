import { z } from 'zod';

// Schema para validação de dados de usuário
export const userProfileSchema = z.object({
  age: z.number().min(13).max(120).optional(),
  weight: z.number().min(30).max(300).optional(),
  height: z.number().min(1.0).max(2.5).optional(),
  gender: z.enum(['masculino', 'feminino', 'outro']).optional(),
  activity_level: z.enum(['sedentario', 'leve', 'moderado', 'intenso', 'muito_intenso']).optional(),
  goals: z.array(z.string()).max(10).optional(),
  dietary_restrictions: z.array(z.string()).max(20).optional(),
});

// Schema para validação de datas
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

// Schema para validação de tipos de treino
export const workoutTypeSchema = z.enum([
  'cardio', 'forca', 'flexibilidade', 'equilibrio', 'geral'
]);

// Função para sanitizar strings
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove caracteres potencialmente perigosos
    .substring(0, 1000); // Limita tamanho
}

// Função para validar email
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar senha
export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Função para rate limiting simples
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 100, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Remove requisições antigas
    const recentRequests = userRequests.filter(time => now - time < this.windowMs);
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);
    
    return true;
  }
}
