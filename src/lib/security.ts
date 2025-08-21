// Security configuration and utilities

// Content Security Policy headers
export const CSP_HEADERS = {
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    "connect-src 'self' https://*.supabase.co https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; '),
  
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};

// Rate limiting configuration
export const RATE_LIMIT_CONFIG = {
  auth: { maxRequests: 5, windowMs: 60000 }, // 5 tentativas por minuto
  api: { maxRequests: 100, windowMs: 60000 }, // 100 requests por minuto
  general: { maxRequests: 1000, windowMs: 60000 } // 1000 requests por minuto
};

// Allowed origins for CORS
export const ALLOWED_ORIGINS = [
  'http://localhost:3000', // Primary development port
  'http://localhost:8080', // Alternative development port
  'https://yourdomain.com' // Replace with your actual domain
];

// Session configuration
export const SESSION_CONFIG = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const
};

// Password requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false
};

// Input sanitization rules
export const SANITIZATION_RULES = {
  maxLength: 1000,
  allowedTags: [], // No HTML tags allowed
  allowedAttributes: {} // No attributes allowed
};

// Security headers for different environments
export function getSecurityHeaders(environment: 'development' | 'production' = 'development') {
  if (environment === 'development') {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    };
  }
  
  return CSP_HEADERS;
}

// Validate origin for CORS
export function isOriginAllowed(origin: string): boolean {
  return ALLOWED_ORIGINS.includes(origin);
}

// Generate secure random string
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomArray = new Uint8Array(length);
  crypto.getRandomValues(randomArray);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomArray[i] % chars.length];
  }
  
  return result;
}

// Check if request is from allowed origin
export function validateRequestOrigin(origin: string | null): boolean {
  if (!origin) return false;
  return isOriginAllowed(origin);
}
