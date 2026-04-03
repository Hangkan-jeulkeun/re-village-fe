import Image from 'next/image';
import Link from 'next/link';
import { Box, Text } from '@vapor-ui/core';

export interface LookupTabItem {
  key: string;
  label: string;
  href: string;
}

export function LookupPageShell({ children }: { children: React.ReactNode }) {
  return (
    <Box
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--color-bg-canvas-sub)',
      }}
    >
      {children}
    </Box>
  );
}

export function LookupTopBar({
  backHref,
  title,
  tabs,
  activeTab,
}: {
  backHref?: string;
  title: string;
  tabs: LookupTabItem[];
  activeTab: string;
}) {
  return (
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
          position: 'relative',
          padding: 'var(--size-space-200)',
          textAlign: 'center',
          borderBottom: '1px solid var(--color-bg-primary-100)',
        }}
      >
        {backHref ? (
          <Link
            href={backHref}
            aria-label="뒤로가기"
            style={{
              position: 'absolute',
              left: 'var(--size-space-200)',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 'var(--size-300)',
              minHeight: 'var(--size-300)',
              color: 'var(--color-fg-normal)',
              textDecoration: 'none',
            }}
          >
            <Image
              src="/icons/arrow.svg"
              alt=""
              width={18}
              height={18}
              priority
            />
          </Link>
        ) : null}
        <Text typography="heading5" style={{ color: 'var(--color-fg-normal)' }}>
          {title}
        </Text>
      </Box>

      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${tabs.length}, 1fr)`,
        }}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeTab;

          return (
            <Link
              key={tab.key}
              href={tab.href}
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
                {tab.label}
              </Text>
            </Link>
          );
        })}
      </Box>
    </Box>
  );
}
