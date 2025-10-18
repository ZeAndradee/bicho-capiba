import styles from "./AnimalCardSkeleton.module.css";

export default function AnimalCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <div className={styles.imageSkeleton}></div>
      </div>

      <div className={styles.content}>
        <div className={styles.nameRow}>
          <div className={styles.nameSkeleton}></div>
        </div>

        <div className={styles.locationRow}>
          <div className={styles.infoItemSkeleton}>
            <div className={styles.textSkeletonLong}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
