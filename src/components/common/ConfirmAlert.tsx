'use client';

import { Box, Button, Dialog, HStack, Text, VStack } from '@vapor-ui/core';

const ALERT_RADIUS = 'calc(var(--size-150) + var(--size-075) / 2)';

export interface ConfirmAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  isPending?: boolean;
}

export function ConfirmAlert({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = '취소',
  onConfirm,
  isPending = false,
}: ConfirmAlertProps) {
  return (
    <Dialog.Root open={open} onOpenChange={(isOpen) => onOpenChange(isOpen)}>
      <Dialog.Popup
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 'min(calc(100vw - var(--size-space-250) * 2), 40rem)',
          padding: 0,
          border: 'none',
          borderRadius: ALERT_RADIUS,
          overflow: 'hidden',
          background: 'var(--color-bg-canvas)',
          boxShadow: '0 20px 48px rgb(15 23 42 / 0.18)',
        }}
      >
        <Dialog.Header
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: 0,
            borderBottom:
              '1px solid color-mix(in srgb, var(--color-border-normal) 72%, white)',
          }}
        >
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              minHeight: 'calc(var(--size-600) + var(--size-space-250))',
              padding: 'var(--size-space-175) var(--size-space-250)',
              background: 'var(--color-bg-canvas)',
            }}
          >
            <Dialog.Title>
              <Text
                typography="heading5"
                style={{
                  color: 'var(--color-fg-normal)',
                }}
              >
                알림
              </Text>
            </Dialog.Title>
          </Box>
        </Dialog.Header>

        <VStack
          style={{
            width: '100%',
            alignItems: 'stretch',
            gap: 'var(--size-space-300)',
            padding:
              'var(--size-space-400) var(--size-space-350) var(--size-space-350)',
            background: 'var(--color-bg-canvas)',
          }}
        >
          <VStack
            style={{
              gap: 'var(--size-space-175)',
              alignItems: 'center',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <Dialog.Title>
              <Text
                typography="heading3"
                style={{
                  color: 'var(--color-fg-normal)',
                  fontWeight: 800,
                  lineHeight: 1.35,
                  wordBreak: 'keep-all',
                }}
              >
                {title}
              </Text>
            </Dialog.Title>

            {description ? (
              <Dialog.Description>
                <Text
                  typography="heading4"
                  style={{
                    color: 'var(--color-fg-normal)',
                    fontWeight: 500,
                    lineHeight: 1.4,
                    wordBreak: 'keep-all',
                  }}
                >
                  {description}
                </Text>
              </Dialog.Description>
            ) : null}
          </VStack>

          <Dialog.Footer
            style={{
              width: '100%',
              padding: 0,
            }}
          >
            <HStack
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--size-space-150)',
                width: '100%',
              }}
            >
              <Button
                size="lg"
                onClick={() => onOpenChange(false)}
                style={{
                  width: '100%',
                  height: 'var(--size-senior-btn)',
                  borderRadius: ALERT_RADIUS,
                  border: '2px solid var(--color-border-normal)',
                  background: 'var(--color-bg-canvas)',
                  color: 'var(--color-fg-normal)',
                }}
              >
                <Text
                  typography="heading4"
                  style={{ color: 'var(--color-fg-normal)', fontWeight: 700 }}
                >
                  {cancelLabel}
                </Text>
              </Button>

              <Button
                size="lg"
                onClick={onConfirm}
                disabled={isPending}
                style={{
                  width: '100%',
                  height: 'var(--size-senior-btn)',
                  borderRadius: ALERT_RADIUS,
                  border: 'none',
                  background:
                    'color-mix(in srgb, var(--color-error-bg) 96%, white)',
                  color: 'var(--color-error)',
                }}
              >
                <Text
                  typography="heading4"
                  style={{ color: 'var(--color-error)', fontWeight: 700 }}
                >
                  {confirmLabel}
                </Text>
              </Button>
            </HStack>
          </Dialog.Footer>
        </VStack>
      </Dialog.Popup>
    </Dialog.Root>
  );
}
