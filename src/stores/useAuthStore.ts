import { create } from 'zustand';

import type { TokenResponse } from '@/types/auth';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  setTokens: (tokens: TokenResponse) => void;
  clearTokens: () => void;
}

const STORAGE_KEY = 'auth-storage';

function readStorage(): Pick<AuthState, 'accessToken' | 'refreshToken'> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { accessToken: null, refreshToken: null };
    const parsed = JSON.parse(raw) as {
      accessToken?: string | null;
      refreshToken?: string | null;
    };
    return {
      accessToken: parsed.accessToken ?? null,
      refreshToken: parsed.refreshToken ?? null,
    };
  } catch {
    return { accessToken: null, refreshToken: null };
  }
}

function writeStorage(tokens: Pick<AuthState, 'accessToken' | 'refreshToken'>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch {
    // storage unavailable
  }
}

export const useAuthStore = create<AuthState>()((set) => ({
  accessToken: null,
  refreshToken: null,
  setTokens: (tokens) => {
    set({ accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
    writeStorage({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  },
  clearTokens: () => {
    set({ accessToken: null, refreshToken: null });
    writeStorage({ accessToken: null, refreshToken: null });
  },
}));

// 클라이언트에서만 localStorage 복원 (SSR에서는 실행 안 됨)
if (typeof window !== 'undefined') {
  useAuthStore.setState(readStorage());
}
