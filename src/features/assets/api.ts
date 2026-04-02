import { apiClient } from '@/lib/apiClient';

export type AssetOwnerCategory = 'ALL' | 'PUBLIC' | 'PRIVATE';

export interface AssetsListingsQuery {
  address?: string;
  ownerCategory?: AssetOwnerCategory;
  page?: number;
  limit?: number;
}

export const assetsApi = {
  // GET /api/v1/assets/listings - 매물 리스트 조회 (공공/개인 분리)
  findListings: (query?: AssetsListingsQuery) =>
    apiClient.GET('/api/v1/assets/listings', { params: { query } }),

  // GET /api/v1/assets/listings/{id} - 매물 상세 조회
  findListing: (id: string) =>
    apiClient.GET('/api/v1/assets/listings/{id}', { params: { path: { id } } }),
};
