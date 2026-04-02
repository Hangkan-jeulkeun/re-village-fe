'use client';

import { useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { useAuthStore } from '@/stores/useAuthStore';
import { useMyApplications } from './queries';

export function LookupHistoryLogger() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const clearTokens = useAuthStore((state) => state.clearTokens);
  const { error } = useMyApplications();

  const redirectUrl = (() => {
    const queryString = searchParams.toString();
    const currentPath = queryString ? `${pathname}?${queryString}` : pathname;
    return `/lookup/login?redirect=${encodeURIComponent(currentPath)}`;
  })();

  useEffect(() => {
    if (!error) return;

    const statusCode =
      typeof error === 'object' && error !== null && 'error' in error
        ? (error.error as { statusCode?: number })?.statusCode
        : undefined;

    if (statusCode === 401) {
      clearTokens();
      router.replace(redirectUrl);
    }
  }, [clearTokens, error, redirectUrl, router]);

  return null;
}
