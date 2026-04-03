import Link from 'next/link';
import { Box, Text } from '@vapor-ui/core';
import AppLayout from '@/components/layout/AppLayout';
import { LookupHistoryList } from '@/features/lookup/LookupHistoryList';
import { LookupHistoryLogger } from '@/features/lookup/LookupHistoryLogger';

import {
  LookupPageShell,
  LookupTopBar,
  type LookupTabItem,
} from './LookupTopBar';

import { AdminNotificationBanner } from '@/components/common/AdminNotificationBanner';

type TabKey = 'in-progress' | 'done';

const TABS: LookupTabItem[] = [
  { key: 'in-progress', label: '진행 중', href: '/lookup/history' },
  { key: 'done', label: '완료', href: '/lookup/history?tab=done' },
];

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
      <LookupPageShell>
        <LookupHistoryLogger />
        <AdminNotificationBanner />

        <LookupTopBar
          title="신청 내역 확인하기"
          tabs={TABS}
          activeTab={activeTab}
        />

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
              height: 'calc(var(--size-500) + var(--size-300))',
              borderRadius: 'var(--size-space-200)',
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
      </LookupPageShell>
    </AppLayout>
  );
}
