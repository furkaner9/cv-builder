// types/auth.ts - Authentication Tipleri

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLogin: Date;
  
  // Subscription & Plan
  plan: 'free' | 'premium' | 'enterprise';
  planExpiry?: Date;
  
  // Preferences
  preferences: {
    language: 'tr' | 'en';
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    emailUpdates: boolean;
  };
  
  // Stats
  stats: {
    totalCVs: number;
    totalApplications: number;
    portfolioViews: number;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
  error?: string;
}

// Helper: Email validation
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Helper: Password strength
export function validatePassword(password: string): {
  isValid: boolean;
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  
  if (password.length < 8) {
    errors.push('En az 8 karakter olmalı');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('En az bir büyük harf içermeli');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('En az bir küçük harf içermeli');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('En az bir rakam içermeli');
  }
  
  // Strength calculation
  if (errors.length === 0) {
    if (password.length >= 12 && /[!@#$%^&*]/.test(password)) {
      strength = 'strong';
    } else if (password.length >= 10) {
      strength = 'medium';
    }
  }
  
  return {
    isValid: errors.length === 0,
    strength,
    errors,
  };
}

// Helper: Create default user
export function createDefaultUser(email: string, name: string): User {
  return {
    id: `user-${Date.now()}`,
    email,
    name,
    createdAt: new Date(),
    lastLogin: new Date(),
    plan: 'free',
    preferences: {
      language: 'tr',
      theme: 'auto',
      notifications: true,
      emailUpdates: true,
    },
    stats: {
      totalCVs: 0,
      totalApplications: 0,
      portfolioViews: 0,
    },
  };
}

// Session token management
export const AUTH_TOKEN_KEY = 'cvgenius_auth_token';
export const AUTH_USER_KEY = 'cvgenius_user';

export function setAuthToken(token: string): void {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function removeAuthToken(): void {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function setAuthUser(user: User): void {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAuthUser(): User | null {
  const userStr = localStorage.getItem(AUTH_USER_KEY);
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}