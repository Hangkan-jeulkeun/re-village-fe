'use client';

import { useNotificationStore } from '@/stores/useNotificationStore';

export function AdminNotificationBanner() {
  const { notifications, markRead } = useNotificationStore();
  const unread = notifications.filter((n) => !n.read);

  if (unread.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--gap-xs)',
        padding: 'var(--gap-sm) var(--screen-margin)',
      }}
    >
      {unread.map((n) => (
        <div
          key={n.id}
          role="alert"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 'var(--gap-sm)',
            padding: 'var(--gap-sm) var(--gap-md)',
            borderRadius: 'var(--size-senior-radius)',
            background: 'var(--color-bg-primary-100)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-fg-primary)',
              }}
            >
              관리자 안내
            </span>
            <span
              style={{
                fontSize: '14px',
                color: 'var(--color-fg-normal)',
                lineHeight: 1.5,
              }}
            >
              {n.message}
            </span>
          </div>
          <button
            type="button"
            aria-label="알림 닫기"
            onClick={() => markRead(n.id)}
            style={{
              flexShrink: 0,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'var(--color-fg-subtle)',
              lineHeight: 1,
              padding: '0 2px',
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
