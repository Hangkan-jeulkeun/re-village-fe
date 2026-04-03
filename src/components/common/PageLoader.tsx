import styles from './PageLoader.module.css';

interface PageLoaderProps {
  /** true면 화면 전체를 덮는 fixed 오버레이, false면 부모 영역 안에서 중앙 정렬 */
  fullScreen?: boolean;
}

export function PageLoader({ fullScreen = false }: PageLoaderProps) {
  return (
    <div className={fullScreen ? styles.fullScreen : styles.inline}>
      <div className={styles.spinner} />
    </div>
  );
}
