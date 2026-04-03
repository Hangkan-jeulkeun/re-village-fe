import Image from 'next/image';
import { Text } from '@vapor-ui/core';
import styles from './HouseLoader.module.css';

const HOUSES = [
  { src: '/images/home-type1-damBat.png', alt: '' },
  { src: '/images/home-type3-parking.png', alt: '' },
  { src: '/images/home-type5-nodam.png', alt: '' },
  { src: '/images/home-type2-dam.png', alt: '' },
];

interface HouseLoaderProps {
  label?: string;
}

export function HouseLoader({
  label = '잠시만 기다려 주세요',
}: HouseLoaderProps) {
  return (
    <div className={styles.overlay} role="status" aria-label={label}>
      <div className={styles.row}>
        {HOUSES.map((house, index) => (
          <Image
            key={house.src}
            src={house.src}
            alt={house.alt}
            width={72}
            height={64}
            className={styles.house}
            style={{ animationDelay: `${index * 0.55}s` }}
          />
        ))}
      </div>
      <Text
        typography="body2"
        style={{ color: 'rgb(255 255 255 / 0.75)', fontWeight: 500 }}
      >
        {label}
      </Text>
    </div>
  );
}
