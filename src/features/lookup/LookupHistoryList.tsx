'use client';

import { useEffect } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Box, Button, HStack, Text, VStack } from '@vapor-ui/core';

import { PageLoader } from '@/components/common/PageLoader';

import { useMyApplications } from './queries';
import {
  DEFAULT_ASSET_IMAGE,
  LOOKUP_ASSET_IMAGE,
  LOOKUP_ASSET_LABEL,
  type LookupAssetType,
} from './thumbnailAssets';

type AppStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'REMODELING'
  | 'LEASING'
  | 'COMPLETED'
  | 'REJECTED';

interface MyApplication {
  id: string;
  assetType: LookupAssetType;
  status: AppStatus;
  areaSqm?: number;
  lease?: string;
  address?: string;
  createdAt?: string;
  thumbnailUrl?: string | null;
  canCancel?: boolean;
}

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

function formatLookupAddress(value?: string): string {
  if (!value) return '주소 없음';

  return value
    .replace(/^제주특별자치도\s*/u, '')
    .replace(/^제주도\s*/u, '')
    .trim();
}

function isLookupAssetType(value: unknown): value is LookupAssetType {
  return typeof value === 'string' && value in LOOKUP_ASSET_IMAGE;
}

function isAppStatus(value: unknown): value is AppStatus {
  return (
    value === 'RECEIVED' ||
    value === 'REVIEWING' ||
    value === 'REMODELING' ||
    value === 'LEASING' ||
    value === 'COMPLETED' ||
    value === 'REJECTED'
  );
}

function parseApplicationItem(raw: unknown): MyApplication | null {
  if (!raw || typeof raw !== 'object') return null;

  const item = raw as {
    id?: unknown;
    status?: unknown;
    lease?: unknown;
    appliedAt?: unknown;
    completedAt?: unknown;
    canCancel?: unknown;
    asset?: {
      address?: unknown;
      areaSqm?: unknown;
      assetType?: unknown;
    } | null;
    images?: Array<{
      fileUrl?: unknown;
      sortOrder?: unknown;
    }> | null;
  };

  if (typeof item.id !== 'string' || !isAppStatus(item.status)) return null;

  const sortedImages = Array.isArray(item.images)
    ? [...item.images].sort((a, b) => {
        const aOrder = typeof a?.sortOrder === 'number' ? a.sortOrder : 9999;
        const bOrder = typeof b?.sortOrder === 'number' ? b.sortOrder : 9999;
        return aOrder - bOrder;
      })
    : [];

  const firstImageWithUrl = sortedImages.find(
    (image): image is { fileUrl: string; sortOrder?: unknown } =>
      typeof image?.fileUrl === 'string',
  );
  const thumbnailUrl = firstImageWithUrl?.fileUrl ?? null;

  return {
    id: item.id,
    status: item.status,
    lease: typeof item.lease === 'string' ? item.lease : undefined,
    createdAt:
      typeof item.appliedAt === 'string'
        ? item.appliedAt
        : typeof item.completedAt === 'string'
          ? item.completedAt
          : undefined,
    canCancel: item.canCancel === true,
    address:
      typeof item.asset?.address === 'string' ? item.asset.address : undefined,
    areaSqm:
      typeof item.asset?.areaSqm === 'number' ? item.asset.areaSqm : undefined,
    assetType: isLookupAssetType(item.asset?.assetType)
      ? item.asset.assetType
      : 'STONE_WALL_FIELD_HOUSE',
    thumbnailUrl,
  };
}

function parseApplications(raw: unknown): MyApplication[] {
  const items =
    raw && typeof raw === 'object' && 'data' in raw
      ? (raw as { data?: unknown }).data
      : raw;

  if (!Array.isArray(items)) return [];

  return items
    .map((item) => parseApplicationItem(item))
    .filter((item): item is MyApplication => item !== null);
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
    return <PageLoader />;
  }

  if (items.length === 0) {
    return (
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          padding: 'var(--gap-2xl)',
          animation: 'fadeIn var(--duration-normal) var(--ease-out)',
        }}
      >
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
      {items.map((item, index) =>
        DONE_STATUSES.has(item.status) ? (
          <CompletedCard key={item.id} item={item} index={index} />
        ) : (
          <InProgressCard key={item.id} item={item} index={index} />
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

function InProgressCard({
  item,
  index,
}: {
  item: MyApplication;
  index: number;
}) {
  const imageSrc =
    item.thumbnailUrl ??
    LOOKUP_ASSET_IMAGE[item.assetType] ??
    DEFAULT_ASSET_IMAGE;
  const label = LOOKUP_ASSET_LABEL[item.assetType] ?? item.assetType;
  const step = STATUS_STEP[item.status] ?? 0;

  return (
    <VStack
      style={{
        ...cardStyle,
        animation: 'slideUpFade var(--duration-slow) var(--ease-out) both',
        animationDelay: `${index * 55}ms`,
      }}
    >
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
            {formatLookupAddress(item.address)}
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
            {/* {item.areaSqm != null ? (
              <Text
                typography="body2"
                style={{ color: 'var(--color-fg-placeholder)' }}
              >
                {item.areaSqm}㎡
              </Text>
            ) : null} */}
          </VStack>
        </VStack>
      </HStack>

      {item.lease ? (
        <Text
          typography="body2"
          style={{
            color: 'var(--color-fg-subtle)',
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
        <ActionButton tone="outline" href="/lookup/detail">
          신청 상세
        </ActionButton>
        {item.canCancel ? (
          <ActionButton tone="danger">신청 취소</ActionButton>
        ) : null}
      </Box>
    </VStack>
  );
}

function CompletedCard({
  item,
  index,
}: {
  item: MyApplication;
  index: number;
}) {
  const imageSrc =
    item.thumbnailUrl ??
    LOOKUP_ASSET_IMAGE[item.assetType] ??
    DEFAULT_ASSET_IMAGE;
  const label = LOOKUP_ASSET_LABEL[item.assetType] ?? item.assetType;
  const appliedDate = formatDotDate(item.createdAt);

  const badgeStyle: CSSProperties =
    item.status === 'REJECTED'
      ? { background: 'var(--badge-반려-bg)', color: 'var(--badge-반려-text)' }
      : { background: 'var(--badge-완료-bg)', color: 'var(--badge-완료-text)' };

  const badgeLabel = item.status === 'REJECTED' ? '반려' : '완료';

  return (
    <VStack
      style={{
        ...cardStyle,
        gap: 'var(--size-space-225)',
        animation: 'slideUpFade var(--duration-slow) var(--ease-out) both',
        animationDelay: `${index * 55}ms`,
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
            {formatLookupAddress(item.address)}
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

      <ActionButton tone="outline" href="/lookup/detail?tab=analysis">
        활용 안내
      </ActionButton>
    </VStack>
  );
}

function StepLine({ activeIndex }: { activeIndex: number }) {
  return (
    <VStack
      style={{
        display: 'grid',
        gap: 'var(--size-space-150)',
        padding: 'var(--size-space-100) 0',
      }}
    >
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
  href,
  tone,
}: {
  children: ReactNode;
  href?: string;
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

  const button = (
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

  if (href) {
    return (
      <Link href={href} style={{ display: 'block', width: '100%' }}>
        {button}
      </Link>
    );
  }

  return button;
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
        unoptimized
        loading="eager"
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
