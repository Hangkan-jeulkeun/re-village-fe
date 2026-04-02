import { apiClient } from '@/lib/apiClient';
import type { components } from '@/types/api';

export type LoginRequest = components['schemas']['LoginDto'];

export const authApi = {
  login: (body: LoginRequest) => apiClient.POST('/api/v1/auth/login', { body }),

  refresh: () => apiClient.POST('/api/v1/auth/refresh'),
};
