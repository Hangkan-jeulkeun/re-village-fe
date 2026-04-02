import type { CSSProperties, ReactNode } from 'react';
import Link from 'next/link';
import { Button, Text } from '@vapor-ui/core';
import AppLayout from '@/components/layout/AppLayout';

type TabKey = 'in-progress' | 'done';
type StepKey = '접수' | '검토 중' | '리모델링' | '임대 중' | '반환';

interface HistoryItem {
  id: string;
  title: string;
  housingType: string;
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
      currentStep: 0,
      primaryActionLabel: '신청서 확인',
      secondaryActionLabel: '신청 취소',
      secondaryActionTone: 'danger',
    },
    {
      id: 'donghong',
      title: '서귀포시 동홍동',
      housingType: '빌라',
      currentStep: 2,
      primaryActionLabel: '신청서 확인',
    },
    {
      id: 'jungang',
      title: '서귀포시 중앙로 44',
      housingType: '단독주택',
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
  padding: 'var(--size-space-300)',
  borderRadius: '28px',
  background: '#ffffff',
  boxShadow: '0 10px 28px rgb(15 23 42 / 0.06)',
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
        background: '#f4f6fa',
      }}
    >
      <div
        style={{
          minHeight: '100%',
          background: '#f4f6fa',
        }}
      >
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 2,
            background: 'rgb(255 255 255 / 0.96)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid #e8edf4',
          }}
        >
          <div
            style={{
              padding:
                'var(--size-space-200) var(--size-space-250) var(--size-space-300)',
              textAlign: 'center',
            }}
          >
            <Text
              typography="heading3"
              style={{ fontWeight: 800, color: '#111827' }}
            >
              신청 내역 확인하기
            </Text>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
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
                    padding: 'var(--size-space-200) var(--size-space-150)',
                    border: 0,
                    borderBottom: isActive
                      ? '3px solid #1f64d5'
                      : '3px solid transparent',
                    background: 'transparent',
                    color: isActive ? '#1f64d5' : '#6b7280',
                    fontSize: '19px',
                    fontWeight: 800,
                  }}
                >
                  {TAB_LABELS[tab]}
                </Link>
              );
            })}
          </div>
        </header>

        <main
          style={{
            display: 'grid',
            gap: 'var(--size-space-250)',
            padding:
              'var(--size-space-250) var(--size-space-250) var(--size-space-400)',
          }}
        >
          {items.map((item) => (
            <HistoryCard key={item.id} item={item} />
          ))}
        </main>

        <footer
          style={{
            position: 'sticky',
            bottom: 0,
            padding:
              'var(--size-space-200) var(--size-space-250) var(--size-space-250)',
            borderTop: '1px solid #dde3ec',
            background: 'rgb(255 255 255 / 0.97)',
            backdropFilter: 'blur(18px)',
            zIndex: 9999,
          }}
        >
          <Link href="/apply/landing" style={{ display: 'block' }}>
            <Button
              size="lg"
              color="primary"
              style={{
                width: '100%',
                height: '72px',
                borderRadius: '22px',
                fontSize: '18px',
                fontWeight: 800,
              }}
            >
              새로 신청하기
            </Button>
          </Link>
        </footer>
      </div>
    </AppLayout>
  );
}

function HistoryCard({ item }: { item: HistoryItem }) {
  if (item.completionStatus) {
    return <CompletedHistoryCard item={item} />;
  }

  return (
    <article style={cardStyle}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '88px minmax(0, 1fr)',
          gap: 'var(--size-space-200)',
          alignItems: 'start',
        }}
      >
        <HouseThumbnail />

        <div style={{ display: 'grid', gap: 'var(--size-space-100)' }}>
          <Text
            typography="heading3"
            style={{
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.22,
              wordBreak: 'keep-all',
            }}
          >
            {item.title}
          </Text>
          <Text
            typography="body1"
            style={{ color: '#4b5563', fontWeight: 700, lineHeight: 1.4 }}
          >
            {item.housingType}
          </Text>
        </div>
      </div>

      <StepLine labels={STEP_LABELS} activeIndex={item.currentStep} />

      {item.lease ? <LeaseStatusCard lease={item.lease} /> : null}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: item.secondaryActionLabel ? '1fr 1fr' : '1fr',
          gap: 'var(--size-space-150)',
        }}
      >
        <ActionButton tone="outline">{item.primaryActionLabel}</ActionButton>
        {item.secondaryActionLabel ? (
          <ActionButton
            tone={item.secondaryActionTone === 'danger' ? 'danger' : 'outline'}
          >
            {item.secondaryActionLabel}
          </ActionButton>
        ) : null}
      </div>
    </article>
  );
}

function CompletedHistoryCard({ item }: { item: HistoryItem }) {
  if (!item.completionStatus || !item.appliedDate) {
    return null;
  }

  const badgeStyle: Record<'rejected' | 'completed', CSSProperties> = {
    rejected: {
      background: '#ffe4e4',
      color: '#c81e1e',
    },
    completed: {
      background: '#e9f2ff',
      color: '#1f64d5',
    },
  };

  return (
    <article
      style={{
        ...cardStyle,
        gap: 'var(--size-space-225)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '88px minmax(0, 1fr)',
          gap: 'var(--size-space-150)',
        }}
      >
        <HouseThumbnail />

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--size-space-150)',
          }}
        >
          <Text
            typography="heading2"
            style={{
              fontWeight: 800,
              color: '#111827',
              lineHeight: 1.22,
              wordBreak: 'keep-all',
            }}
          >
            {item.title}
          </Text>

          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '88px',
              padding: 'var(--size-space-150) var(--size-space-175)',
              borderRadius: '999px',
              fontSize: '17px',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              ...badgeStyle[item.completionStatus.tone],
            }}
          >
            {item.completionStatus.label}
          </span>
        </div>
      </div>

      <Text
        typography="heading3"
        style={{
          color: '#5b6678',
          fontWeight: 700,
          lineHeight: 1.35,
          wordBreak: 'keep-all',
        }}
      >
        신청일 {item.appliedDate} · {item.housingType}
      </Text>

      <ActionButton tone="outline">{item.primaryActionLabel}</ActionButton>
    </article>
  );
}

function StepLine({
  labels,
  activeIndex,
}: {
  labels: string[];
  activeIndex: number;
}) {
  return (
    <div style={{ display: 'grid', gap: 'var(--size-space-150)' }}>
      <div
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
            <div
              key={label}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {!isLast ? (
                <span
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 'calc(50% + 13px)',
                    width: 'calc(100% - 26px)',
                    height: '4px',
                    transform: 'translateY(-50%)',
                    borderRadius: '999px',
                    background: isComplete ? '#6d9be9' : '#dbe7fb',
                  }}
                />
              ) : null}

              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'block',
                  width: isActive ? '28px' : '20px',
                  height: isActive ? '28px' : '20px',
                  borderRadius: '999px',
                  border: isActive ? '4px solid #c9dcff' : 'none',
                  background: isActive || isComplete ? '#1f64d5' : '#c6dafb',
                  boxShadow: isActive ? '0 0 0 4px #ffffff' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>

      <div
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
                color: isActive || isDone ? '#1f64d5' : '#b8ccf2',
                fontWeight: isActive ? 800 : 700,
                textAlign: 'center',
                wordBreak: 'keep-all',
              }}
            >
              {label}
            </Text>
          );
        })}
      </div>
    </div>
  );
}

function LeaseStatusCard({ lease }: { lease: HistoryItem['lease'] }) {
  if (!lease) {
    return null;
  }

  const [remainingYears, returnDate] = lease.endLabel.split('\n');

  return (
    <section
      style={{
        display: 'grid',
        gap: 'var(--size-space-150)',
        padding: 'var(--size-space-200)',
        borderRadius: '20px',
        background: '#f1f4f9',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 'var(--size-space-150)',
        }}
      >
        <div style={{ display: 'grid', gap: 'var(--size-space-100)' }}>
          <Text
            typography="body1"
            style={{ color: '#1f64d5', fontWeight: 800 }}
          >
            {lease.title}
          </Text>
          <Text
            typography="body2"
            style={{ color: '#6b7280', fontWeight: 700 }}
          >
            {lease.startLabel}
          </Text>
        </div>

        <div
          style={{
            display: 'grid',
            gap: 'var(--size-space-100)',
            textAlign: 'right',
          }}
        >
          <Text
            typography="body1"
            style={{ color: '#1f64d5', fontWeight: 800 }}
          >
            {remainingYears}
          </Text>
          <Text
            typography="body2"
            style={{ color: '#6b7280', fontWeight: 700 }}
          >
            {returnDate}
          </Text>
        </div>
      </div>

      <div
        style={{
          overflow: 'hidden',
          height: '14px',
          borderRadius: '999px',
          background: '#cfd7e5',
        }}
      >
        <span
          style={{
            display: 'block',
            width: `${lease.progress * 100}%`,
            height: '100%',
            borderRadius: '999px',
            background: '#1f64d5',
          }}
        />
      </div>
    </section>
  );
}

function ActionButton({
  children,
  tone,
}: {
  children: ReactNode;
  tone: 'outline' | 'danger';
}) {
  const style: Record<'outline' | 'danger', CSSProperties> = {
    outline: {
      border: '1px solid #d5dbe5',
      background: '#ffffff',
      color: '#1f2937',
    },
    danger: {
      border: '1px solid #ffd2d2',
      background: '#ffd8d8',
      color: '#c53030',
    },
  };

  return (
    <Button
      size="lg"
      style={{
        width: '100%',
        height: '60px',
        borderRadius: '18px',
        fontSize: '17px',
        fontWeight: 800,
        ...style[tone],
      }}
    >
      {children}
    </Button>
  );
}

function HouseThumbnail() {
  return (
    <div
      aria-hidden
      style={{
        position: 'relative',
        width: '88px',
        height: '88px',
        borderRadius: '20px',
        background: 'linear-gradient(180deg, #edf7ff 0%, #f7fbff 100%)',
        overflow: 'hidden',
      }}
    >
      <span
        style={{
          position: 'absolute',
          left: '18px',
          bottom: '24px',
          width: '52px',
          height: '30px',
          borderRadius: '4px',
          background: '#f2dfc7',
          boxShadow: 'inset 0 -10px 0 #ead0b6',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '16px',
          bottom: '48px',
          width: 0,
          height: 0,
          borderLeft: '28px solid transparent',
          borderRight: '28px solid transparent',
          borderBottom: '20px solid #73b377',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '32px',
          bottom: '29px',
          width: '8px',
          height: '18px',
          borderRadius: '2px',
          background: '#4b5563',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '43px',
          bottom: '29px',
          width: '12px',
          height: '18px',
          borderRadius: '2px',
          background: '#4b5563',
        }}
      />
      <span
        style={{
          position: 'absolute',
          left: '0',
          bottom: '0',
          width: '34px',
          height: '30px',
          background:
            'radial-gradient(circle at 6px 5px, #59483c 0 4px, transparent 4.2px) 0 0 / 12px 10px, #4f4035',
        }}
      />
      <span
        style={{
          position: 'absolute',
          right: '10px',
          bottom: '10px',
          width: '36px',
          height: '8px',
          borderRadius: '999px',
          background:
            'radial-gradient(circle at 4px 4px, #df7d2b 0 3px, transparent 3.2px) 0 0 / 10px 8px',
        }}
      />
    </div>
  );
}
