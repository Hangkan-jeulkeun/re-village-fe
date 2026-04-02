import Image from 'next/image';
import { Box, HStack, Text, VStack } from '@vapor-ui/core';
import AppLayout from '@/components/layout/AppLayout';
import {
  LookupPageShell,
  LookupTopBar,
  type LookupTabItem,
} from '@/app/lookup/history/LookupTopBar';

type DetailTab = 'building' | 'analysis';
type AppStatus =
  | 'RECEIVED'
  | 'REVIEWING'
  | 'REMODELING'
  | 'LEASING'
  | 'COMPLETED';

const TABS: LookupTabItem[] = [
  { key: 'building', label: '건물 정보', href: '/lookup/detail' },
  {
    key: 'analysis',
    label: '내 매물 분석',
    href: '/lookup/detail?tab=analysis',
  },
];

const DETAIL_IMAGE = '/images/home-type1-damBat.png';
const ANALYSIS_IMAGE = '/images/main.png';
const STEP_LABELS = ['접수', '검토 중', '리모델링', '임대 중', '반환'] as const;
const ACTIVE_STATUS: AppStatus = 'REMODELING';
const STATUS_STEP: Record<AppStatus, number> = {
  RECEIVED: 0,
  REVIEWING: 1,
  REMODELING: 2,
  LEASING: 3,
  COMPLETED: 4,
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

export default async function LookupDetailPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const activeTab: DetailTab =
    resolvedSearchParams?.tab === 'analysis' ? 'analysis' : 'building';

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
          tabs={TABS}
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
          {activeTab === 'building' ? <BuildingInfoTab /> : <AnalysisTab />}
        </Box>
      </LookupPageShell>
    </AppLayout>
  );
}

function BuildingInfoTab() {
  return (
    <VStack style={{ gap: 'var(--size-space-300)' }}>
      <ThumbnailFrame imageSrc={DETAIL_IMAGE} alt="건물 대표 이미지" />

      <VStack style={{ gap: 'var(--size-space-175)' }}>
        <Text
          typography="heading3"
          style={{
            color: 'var(--color-fg-normal)',
            fontWeight: 800,
            lineHeight: 1.2,
          }}
        >
          서귀포시 동홍동
        </Text>

        <Text
          typography="body1"
          style={{
            color: 'var(--color-fg-subtle)',
            fontWeight: 600,
          }}
        >
          신청일 2025.11.05 · 빌라 · 84.5 m²
        </Text>
      </VStack>

      <VStack style={{ gap: 'var(--size-space-175)' }}>
        <Text
          typography="heading4"
          style={{
            color: 'var(--color-fg-subtle)',
            fontWeight: 700,
          }}
        >
          진행 내역
        </Text>
        <Text
          typography="heading3"
          style={{
            color: 'var(--color-fg-normal)',
            fontWeight: 800,
          }}
        >
          리모델링 진행 중
        </Text>
      </VStack>

      <ProgressTimeline activeIndex={STATUS_STEP[ACTIVE_STATUS]} />
    </VStack>
  );
}

function AnalysisTab() {
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
          src={ANALYSIS_IMAGE}
          alt="내 매물 분석 대표 이미지"
          fill
          unoptimized
          sizes="100vw"
          style={{
            objectFit: 'contain',
            padding: 'var(--size-space-250)',
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
        돌담형+10평형
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

function ProgressTimeline({ activeIndex }: { activeIndex: number }) {
  return (
    <VStack style={{ gap: 'var(--size-space-175)' }}>
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
                    left: 'calc(50% + 14px)',
                    width: 'calc(100% - 28px)',
                    height: '2px',
                    transform: 'translateY(-50%)',
                    borderRadius: '999px',
                    background:
                      isComplete || isActive
                        ? 'color-mix(in srgb, var(--color-fg-primary) 50%, white)'
                        : 'var(--color-bg-primary-100)',
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
                  width: isActive ? 'var(--size-600)' : 'var(--size-300)',
                  height: isActive ? 'var(--size-600)' : 'var(--size-300)',
                  borderRadius: '999px',
                  background: isActive
                    ? 'color-mix(in srgb, var(--color-fg-primary) 14%, white)'
                    : 'transparent',
                  border: isActive
                    ? '2px solid color-mix(in srgb, var(--color-fg-primary) 40%, white)'
                    : 'none',
                }}
              >
                <Box
                  style={{
                    width: isActive ? 'var(--size-300)' : 'var(--size-250)',
                    height: isActive ? 'var(--size-300)' : 'var(--size-250)',
                    borderRadius: '999px',
                    background:
                      isComplete || isActive
                        ? 'var(--color-fg-primary)'
                        : 'color-mix(in srgb, var(--color-fg-primary) 22%, white)',
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
          const isComplete = index < activeIndex;

          return (
            <Text
              key={label}
              typography="body2"
              style={{
                textAlign: 'center',
                color:
                  isActive || isComplete
                    ? 'var(--color-fg-primary)'
                    : 'color-mix(in srgb, var(--color-fg-primary) 35%, white)',
                fontWeight: isActive ? 800 : 600,
                lineHeight: 1.4,
                wordBreak: 'keep-all',
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
