'use client';
import { create } from 'zustand';
import { User, mockUser } from '@/lib/store';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isLoggedIn: true, // Mock default logged in state

  login: (email, password) => {
    set({ isLoggedIn: true, user: mockUser });
  },

  logout: () => {
    set({ isLoggedIn: false, user: null });
  },
}));
