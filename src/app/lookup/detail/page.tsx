import { Box } from '@vapor-ui/core';
import AppLayout from '@/components/layout/AppLayout';
import {
  LookupPageShell,
  LookupTopBar,
  type LookupTabItem,
} from '@/app/lookup/history/LookupTopBar';
import { LookupDetailContent } from '@/features/lookup/LookupDetailContent';

type DetailTab = 'building' | 'analysis';

export default async function LookupDetailPage({
  searchParams,
}: {
  searchParams?: Promise<{ id?: string; tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab: DetailTab =
    resolvedSearchParams?.tab === 'analysis' ? 'analysis' : 'building';
  const applicationId = resolvedSearchParams?.id;
  const tabs: LookupTabItem[] = [
    {
      key: 'building',
      label: '건물 정보',
      href: applicationId
        ? `/lookup/detail?id=${encodeURIComponent(applicationId)}`
        : '/lookup/detail',
    },
    {
      key: 'analysis',
      label: '내 매물 분석',
      href: applicationId
        ? `/lookup/detail?id=${encodeURIComponent(applicationId)}&tab=analysis`
        : '/lookup/detail?tab=analysis',
    },
  ];

  return (
    <AppLayout
      style={{
        minHeight: '100%',
        padding: 0,
        background: 'var(--color-bg-canvas-sub)',
      }}
    >
      <LookupPageShell>
        <LookupTopBar
          title="상세페이지"
          tabs={tabs}
          activeTab={activeTab}
          backHref="/lookup/history"
        />

        <Box
          style={{
            flex: 1,
            padding:
              'var(--size-space-300) var(--size-space-250) calc(var(--size-space-600) + env(safe-area-inset-bottom))',
            background: 'var(--color-bg-canvas-sub)',
          }}
        >
          <LookupDetailContent
            applicationId={applicationId}
            activeTab={activeTab}
          />
        </Box>
      </LookupPageShell>
    </AppLayout>
  );
}
