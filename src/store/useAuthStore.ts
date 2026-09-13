'use client';
import { create } from 'zustand';
import { User } from '@/types';
import { mockUser } from '@/lib/mock/data';

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isLoggedIn: true, // Mock default logged in state

  login: (_email, _password) => {
    set({ isLoggedIn: true, user: mockUser });
  },

  logout: () => {
    set({ isLoggedIn: false, user: null });
  },
}));
