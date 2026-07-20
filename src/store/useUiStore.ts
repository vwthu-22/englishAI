'use client';
import { create } from 'zustand';

interface UiState {
  sidebarOpen: boolean;
  currentPage: string;
  setSidebarOpen: (open: boolean) => void;
  setCurrentPage: (page: string) => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  currentPage: 'dashboard',

  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setCurrentPage: (page) => set({ currentPage: page }),
}));
