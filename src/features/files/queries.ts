'use client';

import { useMutation } from '@tanstack/react-query';

import { filesApi } from './api';
import type { UploadFileRequest } from './api';

export function useUploadFile() {
  return useMutation({
    mutationFn: async (request: UploadFileRequest) => {
      const { data, error } = await filesApi.upload(request);
      if (error) throw error;
      return data;
    },
  });
}
