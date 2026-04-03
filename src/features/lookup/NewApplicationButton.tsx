'use client';

import { useRouter } from 'next/navigation';
import { Text } from '@vapor-ui/core';
import { useApplyStore } from '@/stores/useApplyStore';
import { useAuthStore } from '@/stores/useAuthStore';

export function NewApplicationButton() {
  const router = useRouter();
  const { reset, setMaxReachedStep } = useApplyStore();
  const accessToken = useAuthStore((s) => s.accessToken);

  const handleClick = () => {
    reset();
    if (accessToken) {
      setMaxReachedStep(2);
      router.push('/apply/step/2');
    } else {
      router.push('/apply/step/1');
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: 'calc(var(--size-500) + var(--size-300))',
        borderRadius: 'var(--size-space-200)',
        background: 'var(--color-brand-interactive)',
        border: 0,
        cursor: 'pointer',
      }}
    >
      <Text typography="heading3" style={{ color: 'var(--color-fg-inverse)' }}>
        새로 신청하기
      </Text>
    </button>
  );
}
