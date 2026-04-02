import Link from 'next/link';
import { Box, Text } from '@vapor-ui/core';
import AppLayout from '@/components/layout/AppLayout';
import { LookupHistoryList } from '@/features/lookup/LookupHistoryList';
import { LookupHistoryLogger } from '@/features/lookup/LookupHistoryLogger';

type TabKey = 'in-progress' | 'done';

const TAB_LABELS: Record<TabKey, string> = {
  'in-progress': '진행 중',
  done: '완료',
};

export default async function LookupHistoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab: TabKey =
    resolvedSearchParams?.tab === 'done' ? 'done' : 'in-progress';

  return (
    <AppLayout
      style={{
        minHeight: '100%',
        padding: 0,
        background: 'var(--color-bg-canvas-sub)',
      }}
    >
      <Box
        style={{
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--color-bg-canvas-sub)',
        }}
      >
        <LookupHistoryLogger />

        <Box
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            background:
              'color-mix(in srgb, var(--color-bg-overlay) 96%, transparent)',
            backdropFilter: 'blur(var(--size-200))',
          }}
        >
          <Box
            style={{
              padding: 'var(--size-space-200)',
              textAlign: 'center',
              borderBottom: '1px solid var(--color-bg-primary-100)',
            }}
          >
            <Text
              typography="heading5"
              style={{ color: 'var(--color-fg-normal)' }}
            >
              신청 내역 확인하기
            </Text>
          </Box>

          <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            {(Object.keys(TAB_LABELS) as TabKey[]).map((tab) => {
              const isActive = tab === activeTab;
              const href =
                tab === 'done' ? '/lookup/history?tab=done' : '/lookup/history';

              return (
                <Link
                  key={tab}
                  href={href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 'var(--size-space-150) var(--size-space-150)',
                    border: 0,
                    borderBottom: isActive
                      ? '2px solid var(--color-border-primary)'
                      : '2px solid transparent',
                    background: 'transparent',
                  }}
                >
                  <Text
                    typography="heading5"
                    style={{
                      color: isActive
                        ? 'var(--color-fg-primary)'
                        : 'var(--color-fg-placeholder)',
                    }}
                  >
                    {TAB_LABELS[tab]}
                  </Text>
                </Link>
              );
            })}
          </Box>
        </Box>

        <LookupHistoryList />

        <Box
          style={{
            position: 'sticky',
            bottom: 0,
            marginTop: 'auto',
            padding:
              'var(--size-space-200) var(--size-space-250) var(--size-space-250)',
            borderTop: '1px solid var(--color-border-normal)',
            paddingBottom: 'var(--size-space-400)',
            background:
              'color-mix(in srgb, var(--color-bg-overlay) 97%, transparent)',
            backdropFilter: 'blur(var(--size-225))',
            zIndex: 9999,
          }}
        >
          <Link
            href="/apply/landing"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: 'calc(var(--size-600) + var(--size-300))',
              borderRadius: 'var(--size-space-250)',
              background: 'var(--color-brand-interactive)',
            }}
          >
            <Text
              typography="heading3"
              style={{ color: 'var(--color-fg-inverse)' }}
            >
              새로 신청하기
            </Text>
          </Link>
        </Box>
      </Box>
    </AppLayout>
  );
}
