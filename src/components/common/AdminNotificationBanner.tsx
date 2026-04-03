'use client';

import { useEffect, useRef } from 'react';
import { Toast } from '@vapor-ui/core';

import { useNotificationStore } from '@/stores/useNotificationStore';

export function AdminNotificationBanner() {
  const { notifications, markRead } = useNotificationStore();
  const { add } = Toast.useToastManager();
  const shownRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const unread = notifications.filter((n) => !n.read);

    for (const n of unread) {
      if (shownRef.current.has(n.id)) continue;
      shownRef.current.add(n.id);

      add({
        title: '관리자 안내',
        description: n.message,
        colorPalette: 'info',
      });

      markRead(n.id);
    }
  }, [notifications, add, markRead]);

  return null;
}
