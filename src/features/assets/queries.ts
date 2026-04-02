'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { assetsApi } from './api';
import type { AssetsListingsQuery, CreateInquiryRequest } from './api';

export const assetKeys = {
  all: ['assets'] as const,
  listings: (query?: AssetsListingsQuery) =>
    [...assetKeys.all, 'listings', query] as const,
  listing: (id: string) => [...assetKeys.all, 'listings', id] as const,
};

export function useAssetListings(query?: AssetsListingsQuery) {
  return useQuery({
    queryKey: assetKeys.listings(query),
    queryFn: async () => {
      const { data, error } = await assetsApi.findListings(query);
      if (error) throw error;
      return data;
    },
  });
}

export function useAssetListing(id: string) {
  return useQuery({
    queryKey: assetKeys.listing(id),
    queryFn: async () => {
      const { data, error } = await assetsApi.findListing(id);
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      ...body
    }: CreateInquiryRequest & { id: string }) => {
      const { data, error } = await assetsApi.createInquiry(id, body);
      if (error) throw error;
      return data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: assetKeys.listing(id) });
    },
  });
}
