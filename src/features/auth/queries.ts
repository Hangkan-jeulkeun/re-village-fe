'use client';

import { useMutation } from '@tanstack/react-query';

import { authApi } from './api';

export function useRefreshToken() {
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await authApi.refresh();
      if (error) throw error;
      return data;
    },
  });
}
