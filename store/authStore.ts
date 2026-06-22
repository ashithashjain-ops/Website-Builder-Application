"use client";

import { create } from "zustand";
import {
  clearAuthToken,
  getAuthToken,
  getProfile,
  login as loginApi,
  setAuthTokens,
  updateProfile as updateProfileApi,
  type ApiUser,
  type LoginBody,
} from "@/lib/api";

interface AuthState {
  user: ApiUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loadUser: () => Promise<void>;
  login: (body: LoginBody) => Promise<void>;
  updateProfile: (body: { name?: string; avatar?: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  loadUser: async () => {
    const token = getAuthToken();
    if (!token) {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
      return;
    }

    set({ token, isAuthenticated: true, isLoading: true });
    try {
      const { user } = await getProfile();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      clearAuthToken();
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (body) => {
    set({ isLoading: true });
    const result = await loginApi(body);
    if (!result.token) throw new Error("Login did not return a token");
    setAuthTokens(result.token, result.refreshToken);
    await get().loadUser();
  },

  updateProfile: async (body) => {
    const { user } = await updateProfileApi(body);
    set({ user });
  },

  logout: () => {
    clearAuthToken();
    set({ user: null, token: null, isAuthenticated: false, isLoading: false });
  },
}));
