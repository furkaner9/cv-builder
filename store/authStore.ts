// store/authStore.ts - Authentication State Management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, RegisterCredentials, AuthState } from '@/types/auth';
import {
  createDefaultUser,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setAuthUser,
  getAuthUser,
  validateEmail,
  validatePassword,
} from '@/types/auth';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  checkAuth: () => void;
  
  // Password
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

// Mock database (gerçek uygulamada backend API'ye gönderilir)
const MOCK_USERS_KEY = 'cvgenius_mock_users';

function getMockUsers(): any[] {
  const usersStr = localStorage.getItem(MOCK_USERS_KEY);
  return usersStr ? JSON.parse(usersStr) : [];
}

function saveMockUser(email: string, password: string, user: User): void {
  const users = getMockUsers();
  users.push({ email, password, user });
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users));
}

function findMockUser(email: string, password: string): User | null {
  const users = getMockUsers();
  const found = users.find((u: any) => u.email === email && u.password === password);
  return found ? found.user : null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
          // Validate email
          if (!validateEmail(credentials.email)) {
            set({ isLoading: false, error: 'Geçersiz e-posta adresi' });
            return { success: false, error: 'Geçersiz e-posta adresi' };
          }

          // Check mock database
          const user = findMockUser(credentials.email, credentials.password);
          
          if (!user) {
            set({ isLoading: false, error: 'E-posta veya şifre hatalı' });
            return { success: false, error: 'E-posta veya şifre hatalı' };
          }

          // Update last login
          const updatedUser = {
            ...user,
            lastLogin: new Date(),
          };

          // Generate mock token
          const token = `mock-token-${Date.now()}`;
          
          // Save to storage
          setAuthToken(token);
          setAuthUser(updatedUser);

          set({
            user: updatedUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: 'Giriş yapılırken bir hata oluştu' });
          return { success: false, error: 'Giriş yapılırken bir hata oluştu' };
        }
      },

      // Register
      register: async (credentials: RegisterCredentials) => {
        set({ isLoading: true, error: null });

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        try {
          // Validations
          if (!credentials.name.trim()) {
            set({ isLoading: false, error: 'İsim boş olamaz' });
            return { success: false, error: 'İsim boş olamaz' };
          }

          if (!validateEmail(credentials.email)) {
            set({ isLoading: false, error: 'Geçersiz e-posta adresi' });
            return { success: false, error: 'Geçersiz e-posta adresi' };
          }

          const passwordValidation = validatePassword(credentials.password);
          if (!passwordValidation.isValid) {
            const errorMsg = passwordValidation.errors[0];
            set({ isLoading: false, error: errorMsg });
            return { success: false, error: errorMsg };
          }

          if (credentials.password !== credentials.confirmPassword) {
            set({ isLoading: false, error: 'Şifreler eşleşmiyor' });
            return { success: false, error: 'Şifreler eşleşmiyor' };
          }

          if (!credentials.acceptTerms) {
            set({ isLoading: false, error: 'Kullanım koşullarını kabul etmelisiniz' });
            return { success: false, error: 'Kullanım koşullarını kabul etmelisiniz' };
          }

          // Check if user already exists
          const existingUsers = getMockUsers();
          if (existingUsers.some((u: any) => u.email === credentials.email)) {
            set({ isLoading: false, error: 'Bu e-posta adresi zaten kayıtlı' });
            return { success: false, error: 'Bu e-posta adresi zaten kayıtlı' };
          }

          // Create new user
          const newUser = createDefaultUser(credentials.email, credentials.name);

          // Save to mock database
          saveMockUser(credentials.email, credentials.password, newUser);

          // Generate token
          const token = `mock-token-${Date.now()}`;
          
          // Save to storage
          setAuthToken(token);
          setAuthUser(newUser);

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false, error: 'Kayıt olurken bir hata oluştu' });
          return { success: false, error: 'Kayıt olurken bir hata oluştu' };
        }
      },

      // Logout
      logout: () => {
        removeAuthToken();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      // Update user
      updateUser: (updates: Partial<User>) => {
        const currentUser = get().user;
        if (!currentUser) return;

        const updatedUser = {
          ...currentUser,
          ...updates,
        };

        setAuthUser(updatedUser);
        set({ user: updatedUser });
      },

      // Check auth on init
      checkAuth: () => {
        const token = getAuthToken();
        const user = getAuthUser();

        if (token && user) {
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      // Reset password (mock)
      resetPassword: async (email: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (!validateEmail(email)) {
          return { 
            success: false, 
            message: 'Geçersiz e-posta adresi' 
          };
        }

        // Check if user exists
        const users = getMockUsers();
        const userExists = users.some((u: any) => u.email === email);

        if (!userExists) {
          return { 
            success: false, 
            message: 'Bu e-posta adresi kayıtlı değil' 
          };
        }

        return { 
          success: true, 
          message: 'Şifre sıfırlama linki e-posta adresinize gönderildi' 
        };
      },

      // Change password (mock)
      changePassword: async (oldPassword: string, newPassword: string) => {
        await new Promise(resolve => setTimeout(resolve, 1000));

        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
          return { 
            success: false, 
            error: passwordValidation.errors[0] 
          };
        }

        // In real app, verify old password with backend
        return { success: true };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);