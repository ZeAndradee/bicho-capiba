import AnimalCardSkeleton from "./AnimalCardSkeleton";
import styles from "./CloseAnimalsFeedSkeleton.module.css";

export default function CloseAnimalsFeedSkeleton() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleSkeleton}></div>

        <div className={styles.filters}>
          <div className={styles.filterSkeleton}></div>
          <div className={styles.filterSkeleton}></div>
          <div className={styles.filterSkeleton}></div>
          <div className={styles.filterSkeleton}></div>
        </div>
      </div>

      <div className={styles.resultsRow}>
        <div className={styles.resultsSkeleton}></div>
      </div>

      <div className={styles.feed}>
        {Array.from({ length: 8 }).map((_, index) => (
          <AnimalCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}