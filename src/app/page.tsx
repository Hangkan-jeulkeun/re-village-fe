'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import styles from './splash.module.css';

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
    <AppLayout className={styles.page}>
      <div className={styles.illustration}>
        <Image
          src="/images/home-type3-parking.png"
          alt=""
          aria-hidden="true"
          width={360}
          height={280}
          className={styles.illustrationImage}
          priority
        />
        <Image
          src="/images/home-type5-nodam.png"
          alt=""
          aria-hidden="true"
          width={360}
          height={280}
          className={styles.illustrationImage}
          priority
        />
      </div>

      <div className={styles.bottom}>
        <p className={styles.heading}>시작하기</p>
        <p className={styles.subtitle}>서비스를 불러오는 중입니다</p>

        <div className={styles.progressWrap} aria-hidden="true">
          <div
            className={styles.progressBar}
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className={styles.caption}>제주특별자치도 빈집 지원 사업</p>
      </div>
    </AppLayout>
  );
}
