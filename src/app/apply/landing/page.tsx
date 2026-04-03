import Image from 'next/image';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import styles from './Landing.module.css';
import { Logo } from '@/components/common/base/Logo';

export default function ApplyLandingPage() {
  return (
    <AppLayout className={styles.page}>
      <div className={styles.logoWrapper}>
        <Logo height={52} />
      </div>
      <div className={styles.illustration}>
        <Image
          src="/images/home-type3-parking.png"
          alt="한집줄를 일러스트"
          width={360}
          height={280}
          className={styles.illustrationImage}
          priority
        />
        <Image
          src="/images/home-type5-nodam.png"
          alt="한집줄를 일러스트"
          width={360}
          height={280}
          className={styles.illustrationImage}
          priority
        />
      </div>

      <div className={styles.bottom}>
        <p className={styles.heading}>시작하기</p>
        <p className={styles.subtitle}>전화번호로 신청 현황을 확인하세요</p>

        <Link href="/apply/step/1" className={styles.primaryBtn}>
          빈집 수리 신청하기
        </Link>
        <Link href="/lookup/phone-verification" className={styles.secondaryBtn}>
          신청 현황 확인하기
        </Link>

        <p className={styles.caption}>제주특별자치도 빈집 지원 사업</p>
      </div>
    </AppLayout>
  );
}
