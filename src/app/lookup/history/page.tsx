import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Box, Button, HStack, Text, VStack } from '@vapor-ui/core';
import AppLayout from '@/components/layout/AppLayout';
import { LookupHistoryLogger } from '@/features/lookup/LookupHistoryLogger';
import { AdminNotificationBanner } from '@/components/common/AdminNotificationBanner';

type TabKey = 'in-progress' | 'done';
type StepKey = '접수' | '검토 중' | '리모델링' | '임대 중' | '반환';
type HomeTypeKey =
  | '돌담이 있는 주택'
  | '철거주택(주차장으로이용)'
  | 'ㄷ자형주택'
  | '돌담+작은밭이 있는 주택'
  | '돌담이 없는 주택'
  | '도심형주택';

interface HistoryItem {
  id: string;
  title: string;
  housingType: string;
  homeType: HomeTypeKey;
  appliedDate?: string;
  currentStep: number;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  secondaryActionTone?: 'danger';
  completionStatus?: {
    label: string;
    tone: 'rejected' | 'completed';
  };
  lease?: {
    title: string;
    startLabel: string;
    endLabel: string;
    progress: number;
  };
}

const STEP_LABELS: StepKey[] = [
  '접수',
  '검토 중',
  '리모델링',
  '임대 중',
  '반환',
];

const TAB_LABELS: Record<TabKey, string> = {
  'in-progress': '진행 중',
  done: '완료',
};

const HISTORY_DATA: Record<TabKey, HistoryItem[]> = {
  'in-progress': [
    {
      id: 'gangjeong',
      title: '서귀포시 강정동 230',
      housingType: '단독주택',
      homeType: '돌담+작은밭이 있는 주택',
      currentStep: 0,
      primaryActionLabel: '신청서 확인',
      secondaryActionLabel: '신청 취소',
      secondaryActionTone: 'danger',
    },
    {
      id: 'donghong',
      title: '서귀포시 동홍동',
      housingType: '빌라',
      homeType: '돌담이 있는 주택',
      currentStep: 2,
      primaryActionLabel: '신청서 확인',
    },
    {
      id: 'jungang',
      title: '서귀포시 중앙로 44',
      housingType: '단독주택',
      homeType: '도심형주택',
      currentStep: 3,
      primaryActionLabel: '신청서 확인',
      lease: {
        title: '임대 진행 중 · 5년 계약',
        startLabel: '2024.11 시작',
        endLabel: '3년 남음\n2029.11 반환',
        progress: 0.48,
      },
    },
  ],
  done: [
    {
      id: 'ara',
      title: '제주시 아라동',
      housingType: '농가주택',
      homeType: '철거주택(주차장으로이용)',
      appliedDate: '2026.01.26',
      currentStep: 4,
      primaryActionLabel: '신청서 확인',
      completionStatus: {
        label: '반려',
        tone: 'rejected',
      },
    },
    {
      id: 'cheonji',
      title: '서귀포시 천지동 13',
      housingType: '농가주택',
      homeType: 'ㄷ자형주택',
      appliedDate: '2020.04.05',
      currentStep: 4,
      primaryActionLabel: '활용 확인',
      completionStatus: {
        label: '반납완료',
        tone: 'completed',
      },
    },
  ],
};

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--size-space-250)',
  padding: 'var(--size-space-250)',
  borderRadius: 'var(--size-space-225)',
  background: 'var(--color-bg-canvas)',
  boxShadow: '0 10px 28px rgb(15 23 42 / 0.06)',
};

const HOME_TYPE_IMAGE_MAP: Record<HomeTypeKey, string> = {
  '돌담이 있는 주택': '/images/home-type2-dam.png',
  '철거주택(주차장으로이용)': '/images/home-type3-parking.png',
  ㄷ자형주택: '/images/home-type4-tree.png',
  '돌담+작은밭이 있는 주택': '/images/home-type1-damBat.png',
  '돌담이 없는 주택': '/images/home-type5-nodam.png',
  도심형주택: '/images/home-type6-nomalcity.png',
};

export default async function LookupHistoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab: TabKey =
    resolvedSearchParams?.tab === 'done' ? 'done' : 'in-progress';
  const items = HISTORY_DATA[activeTab];

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
        <AdminNotificationBanner />

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

        <VStack
          style={{
            display: 'grid',
            flex: 1,
            alignContent: 'start',
            gap: 'var(--size-space-250)',
            padding:
              'var(--size-space-250) var(--size-space-250) var(--size-space-400)',
          }}
        >
          {items.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </VStack>

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

// HistoryCard 신청 내역 카드
function HistoryCard({ item }: { item: HistoryItem }) {
  if (item.completionStatus) {
    return <CompletedHistoryCard item={item} />;
  }

  return (
    <VStack style={cardStyle}>
      <HStack
        style={{
          display: 'grid',
          gridTemplateColumns:
            'calc(var(--size-800) + var(--size-300)) minmax(0, 1fr)',
          gap: 'var(--size-space-200)',
          alignItems: 'start',
        }}
      >
        <HouseThumbnail homeType={item.homeType} />

        <VStack
          style={{
            height: 'calc(var(--size-800) + var(--size-300))',
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Text
            typography="heading3"
            style={{
              wordBreak: 'keep-all',
            }}
          >
            {item.title}
          </Text>
          <Text
            typography="body1"
            style={{
              color: 'var(--color-fg-subtle)',
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            {item.housingType}
          </Text>
        </VStack>
      </HStack>

      <StepLine labels={STEP_LABELS} activeIndex={item.currentStep} />

      {item.lease ? <LeaseStatusCard lease={item.lease} /> : null}

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: item.secondaryActionLabel ? '1fr 1fr' : '1fr',
          gap: 'var(--size-space-150)',
        }}
      >
        <ActionButton tone="outline" height="var(--size-500)">
          {item.primaryActionLabel}
        </ActionButton>
        {item.secondaryActionLabel ? (
          <ActionButton
            tone={item.secondaryActionTone === 'danger' ? 'danger' : 'outline'}
            height="var(--size-500)"
          >
            {item.secondaryActionLabel}
          </ActionButton>
        ) : null}
      </Box>
    </VStack>
  );
}

// CompletedHistoryCard 완료된 신청 내역 카드
function CompletedHistoryCard({ item }: { item: HistoryItem }) {
  if (!item.completionStatus || !item.appliedDate) {
    return null;
  }

  const badgeStyle: Record<'rejected' | 'completed', CSSProperties> = {
    rejected: {
      background: 'var(--badge-반려-bg)',
      color: 'var(--badge-반려-text)',
    },
    completed: {
      background: 'var(--badge-완료-bg)',
      color: 'var(--badge-완료-text)',
    },
  };

  return (
    <VStack
      style={{
        ...cardStyle,
        gap: 'var(--size-space-225)',
      }}
    >
      <HStack
        style={{
          display: 'grid',
          gridTemplateColumns:
            'calc(var(--size-800) + var(--size-300)) minmax(0, 1fr) auto',
          gap: 'var(--size-space-200)',
          alignItems: 'start',
        }}
      >
        <HouseThumbnail homeType={item.homeType} />

        <VStack
          style={{
            justifyContent: 'space-between',
            height: 'calc(var(--size-800) + var(--size-300))',
            minWidth: 0,
          }}
        >
          <Text
            typography="heading3"
            style={{
              color: 'var(--color-fg-normal)',
              wordBreak: 'keep-all',
            }}
          >
            {item.title}
          </Text>
          <Text
            typography="body1"
            style={{
              color: 'var(--color-fg-subtle)',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            신청일 {item.appliedDate} · {item.housingType}
          </Text>
        </VStack>

        <Box
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--size-space-050) var(--size-space-150)',
            borderRadius: '999px',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            ...badgeStyle[item.completionStatus.tone],
          }}
        >
          <Text typography="code1" style={{ fontWeight: 800 }}>
            {item.completionStatus.label}
          </Text>
        </Box>
      </HStack>

      <ActionButton tone="outline" height="var(--size-500)">
        {item.primaryActionLabel}
      </ActionButton>
    </VStack>
  );
}

// StepLine 신청 단계(progress) 프로그래스바
function StepLine({
  labels,
  activeIndex,
}: {
  labels: string[];
  activeIndex: number;
}) {
  return (
    <VStack style={{ display: 'grid', gap: 'var(--size-space-150)' }}>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          alignItems: 'center',
        }}
      >
        {labels.map((label, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;
          const isLast = index === labels.length - 1;

          return (
            <Box
              key={label}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!isLast ? (
                <Box
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 'calc(50% + 13px)',
                    width: 'calc(100% - 26px)',
                    height: '1px',
                    transform: 'translateY(-50%)',
                    borderRadius: '999px',
                    background: isComplete
                      ? 'var(--color-fg-primary)'
                      : 'var(--color-bg-primary-100)',
                    opacity: isComplete ? 0.65 : 1,
                  }}
                />
              ) : null}

              <Box
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: isActive ? 'var(--size-space-300)' : 'var(--size-250)',
                  height: isActive
                    ? 'var(--size-space-300)'
                    : 'var(--size-250)',
                  borderRadius: '999px',
                  border: isActive
                    ? 'var(--size-025) solid color-mix(in srgb, var(--color-fg-primary) 25%, transparent)'
                    : 'none',
                  opacity: isActive ? 1 : isComplete ? 0.6 : 0.3,
                  background: 'transparent',
                }}
              >
                <Box
                  style={{
                    width: 'var(--size-150)',
                    height: 'var(--size-150)',
                    borderRadius: '999px',
                    background: 'var(--color-fg-primary)',
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 'var(--size-space-100)',
        }}
      >
        {labels.map((label, index) => {
          const isActive = index === activeIndex;
          const isDone = index < activeIndex;

          return (
            <Text
              key={label}
              typography="body3"
              style={{
                color: 'var(--color-fg-primary)',
                fontWeight: isActive ? 700 : 500,
                textAlign: 'center',
                wordBreak: 'keep-all',
                opacity: isActive ? 1 : isDone ? 0.6 : 0.3,
              }}
            >
              {label}
            </Text>
          );
        })}
      </Box>
    </VStack>
  );
}

function LeaseStatusCard({ lease }: { lease: HistoryItem['lease'] }) {
  if (!lease) {
    return null;
  }

  const [remainingYears, returnDate] = lease.endLabel.split('\n');

  return (
    <VStack
      style={{
        display: 'grid',
        gap: 'var(--size-space-150)',
        padding: 'var(--size-space-200)',
        borderRadius: 'var(--size-space-250)',
        background: 'var(--color-bg-canvas-sub)',
      }}
    >
      <HStack
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--size-space-150)',
        }}
      >
        <VStack style={{ display: 'grid', gap: 'var(--size-space-100)' }}>
          <Text
            typography="body1"
            style={{ color: 'var(--color-fg-primary)', fontWeight: 800 }}
          >
            {lease.title}
          </Text>
          <Text
            typography="body2"
            style={{ color: 'var(--color-fg-placeholder)', fontWeight: 700 }}
          >
            {lease.startLabel}
          </Text>
        </VStack>

        <VStack
          style={{
            display: 'grid',
            gap: 'var(--size-space-100)',
            textAlign: 'right',
          }}
        >
          <Text
            typography="body1"
            style={{ color: 'var(--color-fg-primary)', fontWeight: 800 }}
          >
            {remainingYears}
          </Text>
          <Text
            typography="body2"
            style={{ color: 'var(--color-fg-placeholder)', fontWeight: 700 }}
          >
            {returnDate}
          </Text>
        </VStack>
      </HStack>

      <Box
        style={{
          overflow: 'hidden',
          height: 'var(--size-175)',
          borderRadius: '999px',
          background: 'var(--color-border-normal)',
        }}
      >
        <Box
          style={{
            display: 'block',
            width: `${lease.progress * 100}%`,
            height: '100%',
            borderRadius: '999px',
            background: 'var(--color-fg-primary)',
          }}
        />
      </Box>
    </VStack>
  );
}

function ActionButton({
  children,
  tone,
  height = 'var(--size-500)',
}: {
  children: ReactNode;
  tone: 'outline' | 'danger';
  height?: string;
}) {
  const style: Record<'outline' | 'danger', CSSProperties> = {
    outline: {
      border: '1px solid var(--color-border-normal)',
      background: 'var(--color-bg-canvas)',
      color: 'var(--color-fg-normal)',
    },
    danger: {
      background: 'var(--color-error-bg)',
      color: 'var(--color-error)',
    },
  };

  return (
    <Button
      size="lg"
      style={{
        width: '100%',
        height,
        borderRadius: 'var(--size-space-100)',
        ...style[tone],
      }}
    >
      <Text
        typography="heading6"
        style={{
          fontWeight: 600,
          color:
            tone === 'danger' ? 'var(--color-error)' : 'var(--color-fg-normal)',
        }}
      >
        {children}
      </Text>
    </Button>
  );
}

function HouseThumbnail({ homeType }: { homeType: HomeTypeKey }) {
  const imageSrc = HOME_TYPE_IMAGE_MAP[homeType];

  return (
    <Box
      aria-hidden
      style={{
        position: 'relative',
        width: 'calc(var(--size-800) + var(--size-300))',
        height: 'calc(var(--size-800) + var(--size-300))',
        borderRadius: 'var(--size-space-250)',
        background:
          'linear-gradient(180deg, var(--color-bg-primary-100) 0%, var(--color-bg-canvas) 100%)',
        overflow: 'hidden',
      }}
    >
      <Image
        src={imageSrc}
        alt=""
        fill
        sizes="calc(var(--size-800) + var(--size-300))"
        style={{
          objectFit: 'cover',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'var(--size-space-250)',
          boxShadow: 'inset 0 0 0 1px rgb(255 255 255 / 0.55)',
        }}
      />
    </Box>
  );
}
