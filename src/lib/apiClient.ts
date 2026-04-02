import createClient, { type Middleware } from 'openapi-fetch';

import { useAuthStore } from '@/stores/useAuthStore';
import type { paths } from '@/types/api';
import type { TokenResponse } from '@/types/auth';

export const API_BASE_URL = 'https://api.hangkan-jeulkeun.goorm.training';

// Clones stored before the request body is consumed, used for retry after token refresh.
const clonedRequests = new WeakMap<Request, Request>();

// Shared refresh promise — prevents concurrent refresh calls from both middleware and apiFetch.
let refreshPromise: Promise<TokenResponse | null> | null = null;

function refreshTokens(): Promise<TokenResponse | null> {
  const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();
  if (!refreshToken) return Promise.resolve(null);

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${refreshToken}` },
    })
      .then((r) => (r.ok ? (r.json() as Promise<TokenResponse>) : null))
      .then((tokens) => {
        if (tokens) setTokens(tokens);
        else clearTokens();
        refreshPromise = null;
        return tokens;
      })
      .catch(() => {
        clearTokens();
        refreshPromise = null;
        return null;
      });
  }

  return refreshPromise;
}

/**
 * 미들웨어(토큰 주입 + 401 refresh 재시도)가 적용된 fetch.
 * apiClient를 쓸 수 없는 FormData 요청(multipart)에서 사용한다.
 */
export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const { accessToken } = useAuthStore.getState();
  const headers = new Headers(init?.headers);
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);

  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, { ...init, headers });

  if (response.status !== 401) return response;

  const tokens = await refreshTokens();
  if (!tokens) return response;

  headers.set('Authorization', `Bearer ${tokens.accessToken}`);
  return fetch(url, { ...init, headers });
}

const authMiddleware: Middleware = {
  onRequest({ request }) {
    clonedRequests.set(request, request.clone());

    const { accessToken } = useAuthStore.getState();
    if (accessToken) {
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return request;
  },

  async onResponse({ response, request }) {
    if (response.status !== 401) return response;

    const tokens = await refreshTokens();
    if (!tokens) return response;

    const original = clonedRequests.get(request);
    if (!original) return response;

    clonedRequests.delete(request);
    const retryHeaders = new Headers(original.headers);
    retryHeaders.set('Authorization', `Bearer ${tokens.accessToken}`);
    return fetch(new Request(original, { headers: retryHeaders }));
  },
};

export const apiClient = createClient<paths>({
  baseUrl: API_BASE_URL,
});

apiClient.use(authMiddleware);
