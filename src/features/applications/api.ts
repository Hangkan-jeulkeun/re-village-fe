import { apiClient } from '@/lib/apiClient';
import type { components } from '@/types/api';

export type CreateApplicationRequest =
  components['schemas']['QuickApplicationDto'];
export type RequestLookupCodeRequest =
  components['schemas']['RequestVerificationDto'];
export type VerifyLookupRequest = components['schemas']['VerifyCodeDto'];
export type LookupDetailRequest =
  components['schemas']['LookupApplicationDetailDto'];
export type CancelApplicationRequest =
  components['schemas']['CancelApplicationDto'];
export type UpdateApplicationStatusRequest =
  components['schemas']['UpdateStatusDto'];

export interface AdminListParams {
  status?:
    | 'RECEIVED'
    | 'REVIEWING'
    | 'REMODELING'
    | 'LEASING'
    | 'COMPLETED'
    | 'REJECTED';
  search?: string;
  sort?: 'latest' | 'oldest';
  page?: number;
  limit?: number;
}

export const applicationsApi = {
  create: (body: CreateApplicationRequest) =>
    apiClient.POST('/api/v1/applications', { body }),

  requestLookupCode: (body: RequestLookupCodeRequest) =>
    apiClient.POST('/api/v1/applications/lookup/request-code', { body }),

  verifyAndLookup: (body: VerifyLookupRequest) =>
    apiClient.POST('/api/v1/applications/lookup/verify', { body }),

  lookupDetail: (body: LookupDetailRequest) =>
    apiClient.POST('/api/v1/applications/lookup/detail', { body }),

  cancel: (id: string, body: CancelApplicationRequest) =>
    apiClient.PATCH('/api/v1/applications/{id}/cancel', {
      params: { path: { id } },
      body,
    }),

  adminSummary: (month?: string) =>
    apiClient.GET('/api/v1/applications/admin/summary', {
      params: { query: { month } },
    }),

  adminList: (params?: AdminListParams) =>
    apiClient.GET('/api/v1/applications/admin/list', {
      params: { query: params },
    }),

  adminKanban: (search?: string) =>
    apiClient.GET('/api/v1/applications/admin/kanban', {
      params: { query: { search } },
    }),

  adminDetail: (id: string) =>
    apiClient.GET('/api/v1/applications/admin/{id}', {
      params: { path: { id } },
    }),

  updateStatus: (id: string, body: UpdateApplicationStatusRequest) =>
    apiClient.PATCH('/api/v1/applications/{id}/status', {
      params: { path: { id } },
      body,
    }),
};
