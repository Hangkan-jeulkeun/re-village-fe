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

// Admin API response types
export interface AdminSummaryStatusCount {
  status:
    | 'RECEIVED'
    | 'REVIEWING'
    | 'REMODELING'
    | 'LEASING'
    | 'COMPLETED'
    | 'REJECTED';
  label: string;
  count: number;
}

export interface AdminSummaryResponse {
  month: string;
  total: number;
  statusCounts: AdminSummaryStatusCount[];
  overview: {
    urgent: {
      title: string;
      badge: string;
      count: number;
      condition: string;
    };
    newThisMonth: {
      title: string;
      count: number;
      changeFromPreviousMonth: number;
    };
    inProgress: {
      title: string;
      count: number;
      remodelingCount: number;
      leasingCount: number;
    };
    processingDays: {
      title: string;
      days: number;
      remodelingCount: number;
      leasingCount: number;
    };
  };
}

export interface AdminKanbanItem {
  id: string;
  applicantId: string;
  assetId: string;
  businessIdea: string;
  businessType: string;
  desiredStartDate: string;
  residentAgeGroup: string | null;
  leasePurpose: string | null;
  occupantCount: number | null;
  remodelSummary: string | null;
  managerContact: string | null;
  status:
    | 'RECEIVED'
    | 'REVIEWING'
    | 'REMODELING'
    | 'LEASING'
    | 'COMPLETED'
    | 'REJECTED';
  rejectReason: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  applicant: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  asset: {
    id: string;
    address: string;
    assetType: string;
  };
}

export interface AdminKanbanColumn {
  status:
    | 'RECEIVED'
    | 'REVIEWING'
    | 'REMODELING'
    | 'LEASING'
    | 'COMPLETED'
    | 'REJECTED';
  label: string;
  count: number;
  items: AdminKanbanItem[];
}

export interface AdminKanbanResponse {
  month: string;
  total: number;
  overview: {
    urgent: {
      title: string;
      badge: string;
      count: number;
      condition: string;
    };
    newThisMonth: {
      title: string;
      count: number;
      changeFromPreviousMonth: number;
    };
    inProgress: {
      title: string;
      count: number;
      remodelingCount: number;
      leasingCount: number;
    };
    processingDays: {
      title: string;
      days: number;
      remodelingCount: number;
      leasingCount: number;
    };
  };
  columns: AdminKanbanColumn[];
}

export interface AdminListItem {
  id: string;
  applicantId: string;
  assetId: string;
  businessIdea: string;
  businessType: string;
  desiredStartDate: string;
  residentAgeGroup: string | null;
  leasePurpose: string | null;
  occupantCount: number | null;
  remodelSummary: string | null;
  managerContact: string | null;
  status:
    | 'RECEIVED'
    | 'REVIEWING'
    | 'REMODELING'
    | 'LEASING'
    | 'COMPLETED'
    | 'REJECTED';
  rejectReason: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  applicant: {
    id: string;
    name: string;
    phone: string;
    email: string;
  };
  asset: {
    id: string;
    address: string;
    assetType: string;
    areaSqm: number;
  };
  statusLabel: string;
}

export interface AdminListResponse {
  items: AdminListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

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

  requestCode: (body: RequestLookupCodeRequest) =>
    apiClient.POST('/api/v1/applications/verification/request-code', { body }),

  verifyCode: async (body: VerifyLookupRequest): Promise<TokenResponse> => {
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

  cancel: (id: string) =>
    apiClient.PATCH('/api/v1/applications/{id}/cancel', {
      params: { path: { id } },
    }),

  // openapi.json에 응답 body 스키마가 없어 apiClient 타입 추론 불가 — apiFetch 직접 사용
  adminSummary: async (month?: string): Promise<AdminSummaryResponse> => {
    const qs = month ? `?month=${encodeURIComponent(month)}` : '';
    const res = await apiFetch(`/api/v1/applications/admin/summary${qs}`, {
      method: 'GET',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw err;
    }
    const json = (await res.json()) as { data: AdminSummaryResponse };
    return json.data;
  },

  adminList: async (params?: AdminListParams): Promise<AdminListResponse> => {
    const qs = params
      ? new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v !== undefined)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : '';
    const res = await apiFetch(
      `/api/v1/applications/admin/list${qs ? `?${qs}` : ''}`,
      { method: 'GET' },
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw err;
    }
    const json = (await res.json()) as { data: AdminListResponse };
    return json.data;
  },

  adminKanban: async (): Promise<AdminKanbanResponse> => {
    const res = await apiFetch('/api/v1/applications/admin/kanban', {
      method: 'GET',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: res.statusText }));
      throw err;
    }
    const json = (await res.json()) as { data: AdminKanbanResponse };
    return json.data;
  },

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
