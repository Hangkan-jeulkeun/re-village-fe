'use client';

import { useQuery } from '@tanstack/react-query';

import { lookupApi } from './api';

export const lookupKeys = {
  all: ['lookup'] as const,
  myApplications: () => [...lookupKeys.all, 'my-applications'] as const,
};

export function useMyApplications() {
  return useQuery({
    queryKey: lookupKeys.myApplications(),
    enabled: false,
    queryFn: async () => {
      const { data, error } = await lookupApi.getMyApplications();
      if (error) throw error;
      return data;
    },
  });
}
