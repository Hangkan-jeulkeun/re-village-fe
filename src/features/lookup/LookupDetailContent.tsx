'use client';

import Image from 'next/image';
import { Box, HStack, Text, VStack } from '@vapor-ui/core';

import { PageLoader } from '@/components/common/PageLoader';

import { ApplicationStepLine } from './ApplicationStepLine';
import { useMyApplicationDetail } from './queries';
import {
  DEFAULT_ASSET_IMAGE,
  LOOKUP_ASSET_IMAGE,
  LOOKUP_ASSET_LABEL,
  type LookupAssetType,
} from './thumbnailAssets';

type DetailTab = 'building' | 'analysis';
type AppStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'REMODELING'
  | 'LEASING'
  | 'COMPLETED'
  | 'REJECTED';

interface DetailApplication {
  id: string;
  status: AppStatus;
  address?: string;
  areaSqm?: number;
  assetType: LookupAssetType;
  thumbnailUrl?: string | null;
  appliedAt?: string;
  aiDescription?: string;
}

interface AiAnalysis {
  recommendations: string[];
  explanation: string;
  strength: string;
  basis: string;
}

const STATUS_STEP: Record<AppStatus, number> = {
  RECEIVED: 0,
  REVIEWING: 1,
  REMODELING: 2,
  LEASING: 3,
  COMPLETED: 4,
  REJECTED: 4,
};

const TAG_PALETTE = [
  {
    bg: 'var(--color-bg-primary-100)',
    color: 'var(--color-fg-primary)',
    border: 'var(--color-border-primary)',
  },
  { bg: '#fff7f2', color: '#ea6f2d', border: '#ea6f2d' },
  { bg: '#f1f7ff', color: '#2f7fd1', border: '#2f7fd1' },
  { bg: '#effbf4', color: '#35a86e', border: '#35a86e' },
  { bg: '#fdf4ff', color: '#9b5de5', border: '#9b5de5' },
] as const;

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

function formatDotDate(value?: string): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatLookupAddress(value?: string): string {
  if (!value) return '주소 없음';

  return value
    .replace(/^제주특별자치도\s*/u, '')
    .replace(/^제주도\s*/u, '')
    .trim();
}

function parseAiAnalysis(description: string): AiAnalysis {
  const getField = (key: string): string => {
    const match = description.match(
      new RegExp(`${key}\\s*:\\s*([^\\n]+)`, 'u'),
    );
    return match ? match[1].trim() : '';
  };

  const recommendationsRaw = getField('추천 방향');
  const recommendations = recommendationsRaw
    ? recommendationsRaw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  return {
    recommendations,
    explanation: getField('추천 설명'),
    strength: getField('강점 요약'),
    basis: getField('근거'),
  };
}

function parseDetailApplication(raw: unknown): DetailApplication | null {
  // openapi-fetch returns the full response body: { success, data: { ... } }
  const unwrapped =
    raw && typeof raw === 'object' && 'data' in raw
      ? (raw as { data?: unknown }).data
      : raw;

  if (!unwrapped || typeof unwrapped !== 'object') return null;

  const item = unwrapped as {
    id?: unknown;
    status?: unknown;
    appliedAt?: unknown;
    asset?: {
      address?: unknown;
      areaSqm?: unknown;
      assetType?: unknown;
      description?: unknown;
      images?: Array<{
        fileUrl?: unknown;
        sortOrder?: unknown;
      }> | null;
    } | null;
  };

  if (typeof item.id !== 'string' || !isAppStatus(item.status)) return null;

  const firstImage = Array.isArray(item.asset?.images)
    ? [...(item.asset?.images ?? [])]
        .sort((a, b) => {
          const aOrder = typeof a?.sortOrder === 'number' ? a.sortOrder : 9999;
          const bOrder = typeof b?.sortOrder === 'number' ? b.sortOrder : 9999;
          return aOrder - bOrder;
        })
        .find(
          (image): image is { fileUrl: string; sortOrder?: unknown } =>
            typeof image?.fileUrl === 'string',
        )
    : undefined;

  return {
    id: item.id,
    status: item.status,
    appliedAt: typeof item.appliedAt === 'string' ? item.appliedAt : undefined,
    address:
      typeof item.asset?.address === 'string' ? item.asset.address : undefined,
    areaSqm:
      typeof item.asset?.areaSqm === 'number' ? item.asset.areaSqm : undefined,
    assetType: isLookupAssetType(item.asset?.assetType)
      ? item.asset.assetType
      : 'STONE_WALL_FIELD_HOUSE',
    thumbnailUrl: firstImage?.fileUrl ?? null,
    aiDescription:
      typeof item.asset?.description === 'string'
        ? item.asset.description
        : undefined,
  };
}

export function LookupDetailContent({
  applicationId,
  activeTab,
}: {
  applicationId?: string;
  activeTab: DetailTab;
}) {
  const { data, isPending, isError } = useMyApplicationDetail(applicationId);
  const detail = parseDetailApplication(data);

  if (!applicationId) {
    return (
      <Box style={{ padding: 'var(--size-space-250)' }}>
        <Text typography="body1" style={{ color: 'var(--color-fg-subtle)' }}>
          신청 ID가 없습니다.
        </Text>
      </Box>
    );
  }

  if (isPending) {
    return <PageLoader />;
  }

  if (isError || !detail) {
    return (
      <Box style={{ padding: 'var(--size-space-250)' }}>
        <Text typography="body1" style={{ color: 'var(--color-fg-subtle)' }}>
          신청 상세 정보를 불러오지 못했습니다.
        </Text>
      </Box>
    );
  }

  return activeTab === 'building' ? (
    <BuildingInfoTab detail={detail} />
  ) : (
    <AnalysisTab detail={detail} />
  );
}

function BuildingInfoTab({ detail }: { detail: DetailApplication }) {
  const imageSrc =
    detail.thumbnailUrl ??
    LOOKUP_ASSET_IMAGE[detail.assetType] ??
    DEFAULT_ASSET_IMAGE;
  const assetLabel = LOOKUP_ASSET_LABEL[detail.assetType] ?? detail.assetType;
  const appliedDate = formatDotDate(detail.appliedAt);

  return (
    <VStack style={{ gap: 'var(--size-space-300)' }}>
      <ThumbnailFrame imageSrc={imageSrc} alt="건물 대표 이미지" />

      <VStack style={{ gap: 'var(--size-space-175)' }}>
        <Text
          typography="heading3"
          style={{
            color: 'var(--color-fg-normal)',
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          {formatLookupAddress(detail.address)}
        </Text>

        <Text
          typography="body1"
          style={{
            color: 'var(--color-fg-subtle)',
            fontWeight: 600,
          }}
        >
          {appliedDate ? `신청일 ${appliedDate} · ` : ''}
          {assetLabel}
          {detail.areaSqm != null ? ` · ${detail.areaSqm}㎡` : ''}
        </Text>
      </VStack>

      <VStack style={{ gap: 'var(--size-space-175)' }}>
        <Text typography="heading4" style={{ fontWeight: 700 }}>
          진행 상황
        </Text>
      </VStack>

      <ApplicationStepLine activeIndex={STATUS_STEP[detail.status] ?? 0} />
    </VStack>
  );
}

function AnalysisTab({ detail }: { detail: DetailApplication }) {
  const imageSrc = LOOKUP_ASSET_IMAGE[detail.assetType] ?? DEFAULT_ASSET_IMAGE;
  const assetLabel = LOOKUP_ASSET_LABEL[detail.assetType] ?? detail.assetType;

  const ai = detail.aiDescription
    ? parseAiAnalysis(detail.aiDescription)
    : null;

  return (
    <VStack style={{ gap: 'var(--size-space-300)' }}>
      <ThumbnailFrame imageSrc={imageSrc} alt="주택 유형 이미지" />

      <Text
        typography="heading3"
        style={{
          color: 'var(--color-fg-normal)',
          fontWeight: 800,
          lineHeight: 1.2,
        }}
      >
        {assetLabel}
      </Text>

      {ai && ai.recommendations.length > 0 ? (
        <VStack
          style={{
            gap: 'var(--size-space-225)',
            padding: 'var(--size-space-250)',
            border: '1px solid var(--color-border-normal)',
            borderRadius: 'calc(var(--size-space-250) + var(--size-050))',
            background: 'var(--color-bg-canvas-sub)',
          }}
        >
          <Text
            typography="body1"
            style={{
              color: 'var(--color-fg-subtle)',
              fontWeight: 700,
            }}
          >
            추천 임대 형태
          </Text>

          <HStack
            style={{
              flexWrap: 'wrap',
              gap: 'var(--size-space-150)',
            }}
          >
            {ai.recommendations.map((rec, i) => {
              const palette = TAG_PALETTE[i % TAG_PALETTE.length];
              return (
                <Box
                  key={rec}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 var(--size-space-175)',
                    height: 'calc(var(--size-500) + var(--size-075))',
                    borderRadius: '999px',
                    border: `2px solid ${palette.border}`,
                    background: palette.bg,
                  }}
                >
                  <Text
                    typography="heading6"
                    style={{
                      color: palette.color,
                      fontWeight: 700,
                      lineHeight: 1,
                      wordBreak: 'keep-all',
                    }}
                  >
                    {rec}
                  </Text>
                </Box>
              );
            })}
          </HStack>
        </VStack>
      ) : null}

      {ai?.strength ? (
        <VStack
          style={{
            gap: 'var(--size-space-100)',
            padding: 'var(--size-space-250)',
            border: '1px solid var(--color-border-normal)',
            borderRadius: 'calc(var(--size-space-250) + var(--size-050))',
            background: 'var(--color-bg-canvas-sub)',
          }}
        >
          <Text
            typography="body1"
            style={{ color: 'var(--color-fg-subtle)', fontWeight: 700 }}
          >
            강점 요약
          </Text>
          <Text
            typography="body1"
            style={{
              color: 'var(--color-fg-normal)',
              lineHeight: 1.6,
              wordBreak: 'keep-all',
            }}
          >
            {ai.strength}
          </Text>
        </VStack>
      ) : null}

      {ai?.explanation ? (
        <Text
          typography="heading4"
          style={{
            color: 'var(--color-fg-subtle)',
            fontWeight: 500,
            lineHeight: 1.62,
            whiteSpace: 'pre-line',
            wordBreak: 'keep-all',
          }}
        >
          {ai.explanation}
        </Text>
      ) : null}

      {ai?.basis ? (
        <VStack
          style={{
            gap: 'var(--size-space-100)',
            padding: 'var(--size-space-250)',
            borderLeft: '3px solid var(--color-border-primary)',
            paddingLeft: 'var(--size-space-250)',
          }}
        >
          <Text
            typography="body2"
            style={{ color: 'var(--color-fg-subtle)', fontWeight: 700 }}
          >
            분석 근거
          </Text>
          <Text
            typography="body2"
            style={{
              color: 'var(--color-fg-subtle)',
              lineHeight: 1.6,
              wordBreak: 'keep-all',
            }}
          >
            {ai.basis}
          </Text>
        </VStack>
      ) : null}

      {!ai && (
        <Text
          typography="body1"
          style={{ color: 'var(--color-fg-placeholder)' }}
        >
          AI 분석 정보가 없습니다.
        </Text>
      )}
    </VStack>
  );
}

function ThumbnailFrame({ alt, imageSrc }: { alt: string; imageSrc: string }) {
  return (
    <Box
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '1.62 / 1',
        borderRadius: 'calc(var(--size-space-250) + var(--size-050))',
        background:
          'linear-gradient(180deg, var(--color-bg-primary-100) 0%, var(--color-bg-canvas) 100%)',
        overflow: 'hidden',
      }}
    >
      <Image
        src={imageSrc}
        alt={alt}
        fill
        unoptimized
        sizes="100vw"
        style={{ objectFit: 'cover' }}
      />
    </Box>
  );
}
