'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { applicationsApi } from './api';
import type {
  AdminListParams,
  CreateApplicationRequest,
  CreateApplicationMultipartRequest,
  RequestLookupCodeRequest,
  UpdateApplicationStatusRequest,
  VerifyLookupRequest,
} from './api';

export const applicationKeys = {
  all: ['applications'] as const,
  adminSummary: (month?: string) =>
    [...applicationKeys.all, 'admin', 'summary', month] as const,
  adminList: (params?: AdminListParams) =>
    [...applicationKeys.all, 'admin', 'list', params] as const,
  adminKanban: (search?: string) =>
    [...applicationKeys.all, 'admin', 'kanban', search] as const,
  adminDetail: (id: string) => [...applicationKeys.all, 'admin', id] as const,
};

export function useCreateApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateApplicationRequest) => {
      const { data, error } = await applicationsApi.create(body);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}

export function useCreateApplicationMultipart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateApplicationMultipartRequest) =>
      applicationsApi.createMultipart(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}

export function useRequestCode() {
  return useMutation({
    mutationFn: async (body: RequestLookupCodeRequest) => {
      const { data, error } = await applicationsApi.requestCode(body);
      if (error) throw error;
      return data;
    },
  });
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: (body: VerifyLookupRequest) => applicationsApi.verifyCode(body),
  });
}

export function useExtractDocuments() {
  return useMutation({
    mutationFn: (documents: File[]) =>
      applicationsApi.extractDocuments(documents),
  });
}

export function useCancelApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await applicationsApi.cancel(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}

export function useAdminSummary(month?: string) {
  return useQuery({
    queryKey: applicationKeys.adminSummary(month),
    queryFn: async () => {
      const { data, error } = await applicationsApi.adminSummary(month);
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminList(params?: AdminListParams) {
  return useQuery({
    queryKey: applicationKeys.adminList(params),
    queryFn: async () => {
      const { data, error } = await applicationsApi.adminList(params);
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminKanban(search?: string) {
  return useQuery({
    queryKey: applicationKeys.adminKanban(search),
    queryFn: async () => {
      const { data, error } = await applicationsApi.adminKanban(search);
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminDetail(id: string) {
  return useQuery({
    queryKey: applicationKeys.adminDetail(id),
    queryFn: async () => {
      const { data, error } = await applicationsApi.adminDetail(id);
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: UpdateApplicationStatusRequest & { id: string }) => {
      const { data, error } = await applicationsApi.updateStatus(id, body);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}
