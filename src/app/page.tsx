'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HouseLoader } from '@/components/common/HouseLoader';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      router.replace('/apply/landing');
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [router]);

  return <HouseLoader label="서비스를 불러오는 중입니다" />;
}
