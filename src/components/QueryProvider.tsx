'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { AppToastProvider } from '@/components/common/AppToastProvider';
import { TopBannerToast } from '@/components/common/TopBannerToast';

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AppToastProvider>
        {children}
        <TopBannerToast />
      </AppToastProvider>
    </QueryClientProvider>
  );
}
