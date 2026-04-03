import { apiClient } from '@/lib/apiClient';

export const authApi = {
  refresh: () => apiClient.POST('/api/v1/auth/refresh'),
};
