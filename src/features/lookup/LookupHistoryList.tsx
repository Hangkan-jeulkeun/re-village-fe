'use client';

import { useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Box, Button, HStack, Text, VStack } from '@vapor-ui/core';

import { useMyApplications } from './queries';

type AssetType =
  | 'STONE_WALL_FIELD_HOUSE'
  | 'STONE_WALL_HOUSE'
  | 'DEMOLITION_HOUSE'
  | 'NO_STONE_WALL_HOUSE'
  | 'D_SHAPED_HOUSE'
  | 'URBAN_HOUSE_VILLA';

type AppStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'REMODELING'
  | 'LEASING'
  | 'COMPLETED'
  | 'REJECTED';

interface MyApplication {
  id: string;
  assetType: AssetType;
  status: AppStatus;
  areaSqm?: number;
  lease?: string;
  address?: string;
  createdAt?: string;
}

const ASSET_IMAGE: Record<AssetType, string> = {
  STONE_WALL_FIELD_HOUSE: '/images/home-type1-damBat.png',
  STONE_WALL_HOUSE: '/images/home-type2-dam.png',
  DEMOLITION_HOUSE: '/images/home-type3-parking.png',
  D_SHAPED_HOUSE: '/images/home-type4-tree.png',
  NO_STONE_WALL_HOUSE: '/images/home-type5-nodam.png',
  URBAN_HOUSE_VILLA: '/images/home-type6-nomalcity.png',
};

const ASSET_LABEL: Record<AssetType, string> = {
  STONE_WALL_FIELD_HOUSE: '돌담+밭 주택',
  STONE_WALL_HOUSE: '돌담 주택',
  DEMOLITION_HOUSE: '창고포함주택',
  D_SHAPED_HOUSE: '철거주택',
  NO_STONE_WALL_HOUSE: '돌담없는 주택',
  URBAN_HOUSE_VILLA: '도심주택/빌라',
};

const STATUS_STEP: Record<AppStatus, number> = {
  RECEIVED: 0,
  REVIEWING: 1,
  REMODELING: 2,
  LEASING: 3,
  COMPLETED: 4,
  REJECTED: 4,
};

const STEP_LABELS = ['접수', '검토 중', '리모델링', '임대 중', '반환'] as const;

const DONE_STATUSES = new Set<AppStatus>(['COMPLETED', 'REJECTED']);

function formatDotDate(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function parseApplications(raw: unknown): MyApplication[] {
  if (!raw || typeof raw !== 'object') return [];
  if ('data' in raw && Array.isArray((raw as { data: unknown }).data)) {
    return (raw as { data: MyApplication[] }).data;
  }
  if (Array.isArray(raw)) return raw as MyApplication[];
  return [];
}

export function LookupHistoryList() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') === 'done' ? 'done' : 'in-progress';
  const { data: rawData, isPending, refetch } = useMyApplications();

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const allItems = parseApplications(rawData);
  const items = allItems.filter((item) =>
    activeTab === 'done'
      ? DONE_STATUSES.has(item.status)
      : !DONE_STATUSES.has(item.status),
  );

  if (isPending) {
    return (
      <Box style={{ padding: 'var(--gap-lg)', textAlign: 'center' }}>
        <Text typography="body2" style={{ color: 'var(--color-fg-subtle)' }}>
          불러오는 중...
        </Text>
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box style={{ padding: 'var(--gap-lg)', textAlign: 'center' }}>
        <Text typography="body2" style={{ color: 'var(--color-fg-subtle)' }}>
          신청 내역이 없습니다.
        </Text>
      </Box>
    );
  }

  return (
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
      {items.map((item) =>
        DONE_STATUSES.has(item.status) ? (
          <CompletedCard key={item.id} item={item} />
        ) : (
          <InProgressCard key={item.id} item={item} />
        ),
      )}
    </VStack>
  );
}

const cardStyle: CSSProperties = {
  display: 'grid',
  gap: 'var(--size-space-250)',
  padding: 'var(--size-space-250)',
  borderRadius: 'var(--size-space-225)',
  background: 'var(--color-bg-canvas)',
  boxShadow: '0 10px 28px rgb(15 23 42 / 0.06)',
};

function InProgressCard({ item }: { item: MyApplication }) {
  const imageSrc =
    ASSET_IMAGE[item.assetType] ?? '/images/home-type1-damBat.png';
  const label = ASSET_LABEL[item.assetType] ?? item.assetType;
  const step = STATUS_STEP[item.status] ?? 0;

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
        <HouseThumbnail imageSrc={imageSrc} />

        <VStack
          style={{
            height: 'calc(var(--size-800) + var(--size-300))',
            justifyContent: 'space-between',
            minWidth: 0,
          }}
        >
          <Text typography="heading3" style={{ wordBreak: 'keep-all' }}>
            {item.address ?? '주소 없음'}
          </Text>
          <VStack style={{ display: 'grid', gap: 'var(--size-space-050)' }}>
            <Text
              typography="body1"
              style={{
                color: 'var(--color-fg-subtle)',
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              {label}
            </Text>
            {item.areaSqm != null ? (
              <Text
                typography="body2"
                style={{ color: 'var(--color-fg-placeholder)' }}
              >
                {item.areaSqm}㎡
              </Text>
            ) : null}
          </VStack>
        </VStack>
      </HStack>

      {item.lease ? (
        <Text
          typography="body2"
          style={{
            color: 'var(--color-fg-subtle)',
            lineHeight: 1.6,
            wordBreak: 'keep-all',
          }}
        >
          {item.lease}
        </Text>
      ) : null}

      <StepLine activeIndex={step} />

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: item.status === 'RECEIVED' ? '1fr 1fr' : '1fr',
          gap: 'var(--size-space-150)',
        }}
      >
        <ActionButton tone="outline">신청서 확인</ActionButton>
        {item.status === 'RECEIVED' ? (
          <ActionButton tone="danger">신청 취소</ActionButton>
        ) : null}
      </Box>
    </VStack>
  );
}

function CompletedCard({ item }: { item: MyApplication }) {
  const imageSrc =
    ASSET_IMAGE[item.assetType] ?? '/images/home-type1-damBat.png';
  const label = ASSET_LABEL[item.assetType] ?? item.assetType;
  const appliedDate = formatDotDate(item.createdAt);

  const badgeStyle: CSSProperties =
    item.status === 'REJECTED'
      ? { background: 'var(--badge-반려-bg)', color: 'var(--badge-반려-text)' }
      : { background: 'var(--badge-완료-bg)', color: 'var(--badge-완료-text)' };

  const badgeLabel = item.status === 'REJECTED' ? '반려' : '완료';

  return (
    <VStack style={{ ...cardStyle, gap: 'var(--size-space-225)' }}>
      <HStack
        style={{
          display: 'grid',
          gridTemplateColumns:
            'calc(var(--size-800) + var(--size-300)) minmax(0, 1fr) auto',
          gap: 'var(--size-space-200)',
          alignItems: 'start',
        }}
      >
        <HouseThumbnail imageSrc={imageSrc} />

        <VStack
          style={{
            justifyContent: 'space-between',
            height: 'calc(var(--size-800) + var(--size-300))',
            minWidth: 0,
          }}
        >
          <Text
            typography="heading3"
            style={{ color: 'var(--color-fg-normal)', wordBreak: 'keep-all' }}
          >
            {item.address ?? '주소 없음'}
          </Text>
          <Text
            typography="body1"
            style={{
              color: 'var(--color-fg-subtle)',
              whiteSpace: 'nowrap',
              fontWeight: 500,
            }}
          >
            {appliedDate ? `신청일 ${appliedDate} · ` : ''}
            {label}
            {item.areaSqm != null ? ` · ${item.areaSqm}㎡` : ''}
          </Text>
        </VStack>

        <Box
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--size-space-050) var(--size-space-150)',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            ...badgeStyle,
          }}
        >
          <Text typography="code1" style={{ fontWeight: 800 }}>
            {badgeLabel}
          </Text>
        </Box>
      </HStack>

      <ActionButton tone="outline">신청서 확인</ActionButton>
    </VStack>
  );
}

function StepLine({ activeIndex }: { activeIndex: number }) {
  return (
    <VStack style={{ display: 'grid', gap: 'var(--size-space-150)' }}>
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          alignItems: 'center',
        }}
      >
        {STEP_LABELS.map((label, index) => {
          const isComplete = index < activeIndex;
          const isActive = index === activeIndex;
          const isLast = index === STEP_LABELS.length - 1;

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
        {STEP_LABELS.map((label, index) => {
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

function ActionButton({
  children,
  tone,
}: {
  children: ReactNode;
  tone: 'outline' | 'danger';
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
        height: 'var(--size-500)',
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

function HouseThumbnail({ imageSrc }: { imageSrc: string }) {
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
        style={{ objectFit: 'cover' }}
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
