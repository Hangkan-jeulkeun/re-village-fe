import { apiClient, apiFetch, API_BASE_URL } from '@/lib/apiClient';
import type { TokenResponse } from '@/types/auth';
import type { components, operations } from '@/types/api';

export interface CreateApplicationMultipartRequest {
  name?: string;
  phone?: string;
  verificationCode?: string;
  email?: string;
  address?: string;
  assetType?: string;
  areaSqm?: number;
  floorCount?: number;
  hasYard?: boolean;
  hasParking?: boolean;
  notes?: string;
  photos?: File[];
}

export type CreateApplicationRequest =
  operations['ApplicationsController_create']['requestBody']['content']['application/json'];
export type RequestLookupCodeRequest =
  components['schemas']['RequestVerificationDto'];
export type VerifyLookupRequest = components['schemas']['VerifyCodeDto'];
export type UpdateApplicationStatusRequest =
  components['schemas']['UpdateStatusDto'];

export interface ExtractDocumentsResponse {
  buildingType?: string;
  address?: string;
  areaSqm?: number;
}

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
    apiClient.POST('/api/v1/applications', {
      params: { header: { 'content-type': 'application/json' } },
      body,
    }),

  requestLookupCode: (body: RequestLookupCodeRequest) =>
    apiClient.POST('/api/v1/applications/lookup/request-code', { body }),

  requestSubmitCode: (body: RequestLookupCodeRequest) =>
    apiClient.POST('/api/v1/applications/verification/request-code', { body }),

  verifySubmitCode: async (
    body: VerifyLookupRequest,
  ): Promise<TokenResponse> => {
    const res = await fetch(
      `${API_BASE_URL}/api/v1/applications/verification/verify`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));
      throw error;
    }
    const json = (await res.json()) as { data: TokenResponse };
    return json.data;
  },

  verifyAndLookup: (body: VerifyLookupRequest) =>
    apiClient.POST('/api/v1/applications/lookup/verify', { body }),

  cancel: (id: string) =>
    apiClient.PATCH('/api/v1/applications/{id}/cancel', {
      params: { path: { id } },
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

  extractDocuments: async (
    documents: File[],
  ): Promise<ExtractDocumentsResponse> => {
    const formData = new FormData();
    documents.forEach((file) => formData.append('documents', file));

    const res = await apiFetch('/api/v1/applications/documents/extract', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));
      throw error;
    }

    const json = (await res.json()) as {
      data: {
        extracted: {
          address?: string;
          detectedAreaSqm?: number;
        };
      };
    };
    return {
      address: json.data.extracted.address,
      areaSqm: json.data.extracted.detectedAreaSqm,
    };
  },

  createMultipart: async (data: CreateApplicationMultipartRequest) => {
    const { photos, ...fields } = data;
    const formData = new FormData();

    (
      Object.entries(fields) as [
        string,
        string | number | boolean | undefined,
      ][]
    ).forEach(([key, value]) => {
      if (value !== undefined) {
        formData.append(key, String(value));
      }
    });

    photos?.forEach((file) => formData.append('photos', file));

    const res = await apiFetch('/api/v1/applications', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: res.statusText }));
      throw error;
    }

    return res;
  },
};
