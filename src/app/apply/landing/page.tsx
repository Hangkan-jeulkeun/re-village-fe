import Image from 'next/image';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import styles from './Landing.module.css';
import { Logo } from '@/components/common/base/Logo';

const ILLUSTRATIONS = [
  { src: '/images/home-type1-damBat.png', alt: '담장 박쥐 일러스트' },
  { src: '/images/home-type2-dam.png', alt: '담장 일러스트' },
  { src: '/images/home-type3-parking.png', alt: '주차장 일러스트' },
  { src: '/images/home-type4-tree.png', alt: '나무 일러스트' },
  { src: '/images/home-type5-nodam.png', alt: '담장 없는 집 일러스트' },
  { src: '/images/home-type6-nomalcity.png', alt: '도시 일러스트' },
];

export default function ApplyLandingPage() {
  return (
    <AppLayout className={styles.page}>
      <div className={styles.logoWrapper}>
        <Logo height={52} />
      </div>
      <div className={styles.illustration}>
        <div className={styles.illustrationTrack}>
          {[...ILLUSTRATIONS, ...ILLUSTRATIONS].map((img, i) => (
            <Image
              key={`${img.src}-${i}`}
              src={img.src}
              alt={img.alt}
              width={190}
              height={190}
              className={styles.illustrationImage}
              priority={i < ILLUSTRATIONS.length}
            />
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.heading}>시작하기</p>
        <p className={styles.subtitle}>빈집 애물단지를, 미래 신줏단지로</p>

        <Link href="/apply/step/1" className={styles.primaryBtn}>
          빈집 수리 신청하기
        </Link>
        <Link href="/lookup/phone-verification" className={styles.secondaryBtn}>
          신청 현황 확인하기
        </Link>

        <p className={styles.caption}>
          고령의 신줏단지, 제주특별자치도 빈집 지원사업
        </p>
      </div>
    </AppLayout>
  );
}
