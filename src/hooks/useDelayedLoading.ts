'use client';

import { useEffect, useRef, useState } from 'react';

export function useDelayedLoading(
  isLoading: boolean,
  delayMs = 1000,
  minimumVisibleMs = 0,
): boolean {
  const [showDelayedLoader, setShowDelayedLoader] = useState(false);
  const shownAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isLoading) {
      if (!showDelayedLoader) {
        return;
      }

      const shownAt = shownAtRef.current;
      const elapsed = shownAt ? Date.now() - shownAt : minimumVisibleMs;
      const remaining = Math.max(0, minimumVisibleMs - elapsed);

      const timeoutId = window.setTimeout(() => {
        setShowDelayedLoader(false);
        shownAtRef.current = null;
      }, remaining);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }

    if (showDelayedLoader) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      shownAtRef.current = Date.now();
      setShowDelayedLoader(true);
    }, delayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delayMs, isLoading, minimumVisibleMs, showDelayedLoader]);

  return showDelayedLoader;
}
