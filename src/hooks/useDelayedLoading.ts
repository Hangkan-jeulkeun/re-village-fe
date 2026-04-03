'use client';

import { useEffect, useRef, useState } from 'react';

interface DelayedLoadingState {
  visible: boolean;
  active: boolean;
}

export function useDelayedLoading(
  isLoading: boolean,
  delayMs = 1000,
  minimumVisibleMs = 0,
  fadeOutMs = 320,
): DelayedLoadingState {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const shownAtRef = useRef<number | null>(null);
  const hideTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!visible) {
        return;
      }

      const shownAt = shownAtRef.current;
      const elapsed = shownAt ? Date.now() - shownAt : minimumVisibleMs;
      const remaining = Math.max(0, minimumVisibleMs - elapsed);

      const fadeTimeoutId = window.setTimeout(() => {
        setActive(false);
        hideTimeoutRef.current = window.setTimeout(() => {
          setVisible(false);
          shownAtRef.current = null;
          hideTimeoutRef.current = null;
        }, fadeOutMs);
      }, remaining);

      return () => {
        window.clearTimeout(fadeTimeoutId);
        if (hideTimeoutRef.current !== null) {
          window.clearTimeout(hideTimeoutRef.current);
        }
      };
    }

    if (visible) {
      if (hideTimeoutRef.current !== null) {
        window.clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      const reactivateId = window.setTimeout(() => setActive(true), 0);
      return () => window.clearTimeout(reactivateId);
    }

    const timeoutId = window.setTimeout(() => {
      shownAtRef.current = Date.now();
      setVisible(true);
      setActive(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [active, delayMs, fadeOutMs, isLoading, minimumVisibleMs, visible]);

  return { visible, active };
}
