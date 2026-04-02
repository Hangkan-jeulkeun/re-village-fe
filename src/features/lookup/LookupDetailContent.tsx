'use client';

import Image from 'next/image';
import { Box, HStack, Text, VStack } from '@vapor-ui/core';

import { PageLoader } from '@/components/common/PageLoader';

import { ApplicationStepLine } from './ApplicationStepLine';
import { useMyApplicationAnalysis, useMyApplicationDetail } from './queries';
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
}

const STATUS_STEP: Record<AppStatus, number> = {
  RECEIVED: 0,
  REVIEWING: 1,
  REMODELING: 2,
  LEASING: 3,
  COMPLETED: 4,
  REJECTED: 4,
};

const LEASE_TAGS = [
  {
    label: '공방',
    textColor: '#ea6f2d',
    borderColor: '#ea6f2d',
    background: '#fff7f2',
  },
  {
    label: '카페',
    textColor: '#2f7fd1',
    borderColor: '#2f7fd1',
    background: '#f1f7ff',
  },
  {
    label: '식당',
    textColor: '#35a86e',
    borderColor: '#35a86e',
    background: '#effbf4',
  },
] as const;

const ANALYSIS_COPY = `돌담형+10평형 주택은 제주 고유의 주거 이미지와 소규모 상업 운영이 결합되기 좋은 유형입니다. 외부 진입 동선이 단순하고, 전면 노출이 쉬워 공방이나 소형 카페처럼 체류형 업종과의 궁합이 좋습니다.

내부 면적이 크지 않기 때문에 좌석 수를 많이 확보하는 업종보다는 목적 방문형 프로그램을 권장합니다. 창과 출입부의 개방감을 살리면 방문 경험을 개선할 수 있고, 마당이나 전면 여유 공간은 계절형 체험 요소로 확장할 수 있습니다.

리모델링 단계에서는 외벽 질감과 지붕 형태를 유지하면서 설비와 단열을 우선 보강하는 구성이 적합합니다. 이후 임대 단계에서는 지역성, 사진 촬영 포인트, 체험 동선을 함께 안내하는 방식이 효과적입니다.`;

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

function parseDetailApplication(raw: unknown): DetailApplication | null {
  if (!raw || typeof raw !== 'object') return null;

  const item = raw as {
    id?: unknown;
    status?: unknown;
    appliedAt?: unknown;
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

  const firstImage = Array.isArray(item.images)
    ? [...item.images]
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
  };
}

export function LookupDetailContent({
  applicationId,
  activeTab,
}: {
  applicationId?: string;
  activeTab: DetailTab;
}) {
  useMyApplicationAnalysis(applicationId);
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
  const imageSrc =
    detail.thumbnailUrl ??
    LOOKUP_ASSET_IMAGE[detail.assetType] ??
    DEFAULT_ASSET_IMAGE;
  const assetLabel = LOOKUP_ASSET_LABEL[detail.assetType] ?? detail.assetType;

  return (
    <VStack style={{ gap: 'var(--size-space-300)' }}>
      <Box
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1.9 / 1',
          borderRadius: 'calc(var(--size-space-250) + var(--size-050))',
          border: '1px solid var(--color-border-normal)',
          background: 'linear-gradient(180deg, #fafcff 0%, #f5f7fb 100%)',
          overflow: 'hidden',
        }}
      >
        <Image
          src={imageSrc}
          alt="내 매물 분석 대표 이미지"
          fill
          unoptimized
          sizes="100vw"
          style={{
            objectFit: 'cover',
          }}
        />
      </Box>

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
          {LEASE_TAGS.map((tag) => (
            <Box
              key={tag.label}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 'calc(var(--size-800) + var(--size-space-150))',
                height: 'calc(var(--size-500) + var(--size-075))',
                padding: '0 var(--size-space-175)',
                borderRadius: '999px',
                border: `2px solid ${tag.borderColor}`,
                background: tag.background,
              }}
            >
              <Text
                typography="heading5"
                style={{
                  color: tag.textColor,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {tag.label}
              </Text>
            </Box>
          ))}
        </HStack>
      </VStack>

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
        {ANALYSIS_COPY}
      </Text>
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
