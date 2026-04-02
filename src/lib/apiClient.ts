import createClient, { type Middleware } from 'openapi-fetch';

import { useAuthStore } from '@/stores/useAuthStore';
import type { paths } from '@/types/api';
import type { TokenResponse } from '@/types/auth';

// Clones stored before the request body is consumed, used for retry after token refresh.
const clonedRequests = new WeakMap<Request, Request>();

// Shared refresh promise to prevent concurrent token refresh calls.
let refreshPromise: Promise<TokenResponse | null> | null = null;

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

    const { refreshToken, setTokens, clearTokens } = useAuthStore.getState();
    if (!refreshToken) return response;

    if (!refreshPromise) {
      refreshPromise = fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${refreshToken}` },
        },
      )
        .then((r) => (r.ok ? (r.json() as Promise<TokenResponse>) : null))
        .then((tokens) => {
          if (tokens) {
            setTokens(tokens);
          } else {
            clearTokens();
          }
          refreshPromise = null;
          return tokens;
        })
        .catch(() => {
          clearTokens();
          refreshPromise = null;
          return null;
        });
    }

    const tokens = await refreshPromise;
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
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.use(authMiddleware);
