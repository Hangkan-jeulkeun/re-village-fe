'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Text } from '@vapor-ui/core';
import AppLayout from '@/components/layout/AppLayout';

export default function Home() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setProgress((previous) => {
        const next = Math.min(previous + 4, 100);

        if (next === 100) {
          window.clearInterval(timer);
          window.setTimeout(() => {
            router.replace('/apply/landing');
          }, 250);
        }

        return next;
      });
    }, 70);

    return () => {
      window.clearInterval(timer);
    };
  }, [router]);

  return (
    <AppLayout
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 24px 32px',
        background:
          'radial-gradient(circle at top, rgb(48 116 220 / 0.22), transparent 34%), linear-gradient(180deg, #0d1326 0%, #121a31 100%)',
        color: '#ffffff',
      }}
    >
      <div
        style={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Box
          aria-hidden="true"
          style={{
            position: 'relative',
            width: '84px',
            height: '84px',
            marginBottom: '28px',
            borderRadius: '28px',
            background: 'rgb(255 255 255 / 0.08)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              inset: '18px 40px 18px 18px',
              borderRadius: '12px',
              background: '#3174dc',
            }}
          />
          <span
            style={{
              position: 'absolute',
              inset: '18px 18px 18px 40px',
              borderRadius: '12px',
              background: '#ffffff',
            }}
          />
        </Box>
        <Text typography="body3" style={{ color: '#90ade2', fontWeight: 700 }}>
          빈집 활용 서비스 테스트
        </Text>
        <Text
          typography="heading2"
          style={{ marginTop: '12px', fontWeight: 700, lineHeight: 1.16 }}
        >
          유휴 공간을 다시 연결하는 신청 플랫폼
        </Text>
        <Text
          typography="body2"
          style={{
            marginTop: '18px',
            color: 'rgb(255 255 255 / 0.72)',
            lineHeight: 1.7,
          }}
        >
          신청 접수, 진행 조회, 관리자 처리 흐름을 하나의 앱에서 관리합니다.
        </Text>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: 'rgb(255 255 255 / 0.72)',
            fontSize: '13px',
            fontWeight: 600,
          }}
        >
          <span>서비스 준비 중</span>
          <span>{progress}%</span>
        </div>
        <div
          style={{
            height: '8px',
            borderRadius: '999px',
            background: 'rgb(255 255 255 / 0.12)',
            overflow: 'hidden',
          }}
          aria-hidden="true"
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              borderRadius: '999px',
              background: 'linear-gradient(90deg, #3174dc 0%, #7db0ff 100%)',
              transition: 'width 0.07s linear',
            }}
          />
        </div>
      </div>
    </AppLayout>
  );
}
