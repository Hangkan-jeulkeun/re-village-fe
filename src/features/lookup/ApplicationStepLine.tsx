'use client';

import { Box, Text, VStack } from '@vapor-ui/core';

const STEP_LABELS = ['접수', '검토 중', '리모델링', '임대 중', '반환'] as const;

export function ApplicationStepLine({ activeIndex }: { activeIndex: number }) {
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
