'use client';

import { useMutation } from '@tanstack/react-query';

import { authApi } from './api';
import type { LoginRequest } from './api';

export function useLogin() {
  return useMutation({
    mutationFn: async (body: LoginRequest) => {
      const { data, error } = await authApi.login(body);
      if (error) throw error;
      return data;
    },
  });
}

export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authApi.refresh();
      if (error) throw error;
      return data;
    },
  });
}
