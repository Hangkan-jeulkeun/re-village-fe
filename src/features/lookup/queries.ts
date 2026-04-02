'use client';

import { useMutation, useQuery } from '@tanstack/react-query';

import { lookupApi } from './api';

export const lookupKeys = {
  all: ['lookup'] as const,
  myApplications: () => [...lookupKeys.all, 'my-applications'] as const,
  myApplicationDetail: (id: string) =>
    [...lookupKeys.all, 'my-application-detail', id] as const,
  myApplicationAnalysis: (id: string) =>
    [...lookupKeys.all, 'my-application-analysis', id] as const,
};

export function useMyApplications() {
  return useQuery({
    queryKey: lookupKeys.myApplications(),
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: async () => {
      const { data, error } = await lookupApi.getMyApplications();
      if (error) throw error;
      return data;
    },
  });
}

export function useCancelApplication() {
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await lookupApi.cancelApplication(id);
      if (error) throw error;
    },
  });
}

export function useMyApplicationDetail(id?: string) {
  return useQuery({
    queryKey: lookupKeys.myApplicationDetail(id ?? ''),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: async () => {
      if (!id) throw new Error('Application id is required');

      const { data, error } = await lookupApi.getMyApplicationDetail(id);
      if (error) throw error;
      return data;
    },
  });
}

export function useMyApplicationAnalysis(id?: string) {
  return useQuery({
    queryKey: lookupKeys.myApplicationAnalysis(id ?? ''),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 5,
    retry: false,
    queryFn: async () => {
      if (!id) throw new Error('Application id is required');

      const { data, error } = await lookupApi.getMyApplicationAnalysis(id);
      if (error) throw error;
      return data;
    },
  });
}
