import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { apiClient } from '../api/client';

export type UserRole = 'ADMIN' | 'CUIDADOR' | 'FAMILIAR';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  nombreCompleto: string;
  role: UserRole;
  nombreRol: string;
  telefono?: string;
  avatarUrl?: string;
}

interface AuthState {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDarkMode: boolean;
  login: (usernameOrEmail: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  loadSession: () => Promise<void>;
  toggleDarkMode: () => void;
  switchRole: (newRole: UserRole) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true,
  isDarkMode: false,

  loadSession: async () => {
    try {
      const accessToken = await SecureStore.getItemAsync('samanya_access_token');
      const savedUserJson = await SecureStore.getItemAsync('samanya_user');
      const savedDarkMode = await SecureStore.getItemAsync('samanya_dark_mode');

      if (accessToken && savedUserJson) {
        const user: UserProfile = JSON.parse(savedUserJson);
        set({
          user,
          role: user.role,
          isAuthenticated: true,
          isDarkMode: savedDarkMode === 'true'
        });
      }
    } catch (e) {
      console.error('Error al restaurar sesión:', e);
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (usernameOrEmail, password) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/auth/login', {
        usernameOrEmail,
        password
      });

      const { accessToken, refreshToken, user } = response.data.data;

      await SecureStore.setItemAsync('samanya_access_token', accessToken);
      await SecureStore.setItemAsync('samanya_refresh_token', refreshToken);
      await SecureStore.setItemAsync('samanya_user', JSON.stringify(user));

      set({
        user,
        role: user.role,
        isAuthenticated: true
      });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout').catch(() => {});
    } finally {
      await SecureStore.deleteItemAsync('samanya_access_token');
      await SecureStore.deleteItemAsync('samanya_refresh_token');
      await SecureStore.deleteItemAsync('samanya_user');
      set({ user: null, role: null, isAuthenticated: false });
    }
  },

  toggleDarkMode: () => {
    const nextVal = !get().isDarkMode;
    SecureStore.setItemAsync('samanya_dark_mode', String(nextVal));
    set({ isDarkMode: nextVal });
  },

  switchRole: (newRole: UserRole) => {
    const current = get().user;
    if (current) {
      const updated = { ...current, role: newRole };
      set({ user: updated, role: newRole });
      SecureStore.setItemAsync('samanya_user', JSON.stringify(updated));
    }
  }
}));
