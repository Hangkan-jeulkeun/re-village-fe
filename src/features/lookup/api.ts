import { apiClient } from '@/lib/apiClient';
import { useAuthStore } from '@/stores/useAuthStore';
import type { operations } from '@/types/api';

export type LookupListingsRequest =
  operations['AssetsController_listMarketplace']['parameters']['query'];
export type LookupListingOwnerCategory =
  NonNullable<LookupListingsRequest>['ownerCategory'];

export interface LookupListingOwner {
  id: string;
  name: string;
}

export interface LookupListingItem {
  id: string;
  ownerCategory: Exclude<LookupListingOwnerCategory, 'ALL'>;
  title: string;
  price: number | null;
  address: string;
  areaSqm: number;
  assetType: 'EMPTY_HOUSE' | 'WAREHOUSE' | 'FIELD' | 'OTHER' | string;
  keywords: string[];
  recommendationTags: string[];
  isRemodelingCompleted: boolean;
  thumbnailUrl: string | null;
  owner: LookupListingOwner;
}

export interface LookupListingsMeta {
  page: number;
  limit: number;
  total: number;
}

export interface LookupListingsData {
  total: number;
  publicListings: LookupListingItem[];
  privateListings: LookupListingItem[];
  meta: LookupListingsMeta;
}

export interface LookupListingsResponse {
  success: boolean;
  data: LookupListingsData;
  timestamp: string;
}

export interface LookupListingsParams {
  address?: string;
  ownerCategory?: LookupListingOwnerCategory;
  page?: number;
  limit?: number;
}

export const lookupApi = {
  findListings: (params?: LookupListingsParams) =>
    apiClient.GET('/api/v1/assets/listings', {
      params: { query: params },
    }),

  getMyApplications: () => {
    console.log(
      '[lookupApi.getMyApplications] accessToken',
      useAuthStore.getState().accessToken,
    );

    return apiClient.GET('/api/v1/applications/me');
  },

  getMyApplicationDetail: (id: string) =>
    apiClient.GET('/api/v1/applications/me/{id}', {
      params: { path: { id } },
    }),

  getMyApplicationAnalysis: (id: string) =>
    apiClient.GET('/api/v1/applications/{id}/analysis', {
      params: { path: { id } },
    }),

  cancelApplication: (id: string) =>
    apiClient.PATCH('/api/v1/applications/{id}/cancel', {
      params: { path: { id } },
    }),
};
