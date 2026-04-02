'use client';

import { useEffect, useRef } from 'react';
import { Text } from '@vapor-ui/core';

import { useTopToastStore } from '@/stores/useTopToastStore';

import styles from './TopBannerToast.module.css';

// entrance(380ms) + visible(2200ms) + exit(400ms)
const TOTAL_MS = 2980;

export function TopBannerToast() {
  const message = useTopToastStore((s) => s.message);
  const hide = useTopToastStore((s) => s.hide);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!message) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(hide, TOTAL_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [message, hide]);

  if (!message) return null;

  return (
    <div
      key={message}
      className={styles.banner}
      role="status"
      aria-live="polite"
    >
      <Text
        typography="body1"
        style={{ color: 'var(--color-fg-inverse)', fontWeight: 600 }}
      >
        {message}
      </Text>
    </div>
  );
}
