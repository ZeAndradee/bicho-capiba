import styles from "./EventTicketSkeleton.module.css";

interface EventTicketSkeletonProps {
  compact?: boolean;
}

export default function EventTicketSkeleton({
  compact = false,
}: EventTicketSkeletonProps) {
  return (
    <div
      className={`${styles.ticket} ${compact ? styles.compact : ""}`}
      aria-hidden
    >
      <div className={styles.stub} />
      <div className={styles.body}>
        <span className={`${styles.line} ${styles.chip}`} />
        <span className={`${styles.line} ${styles.title}`} />
        <span className={`${styles.line} ${styles.meta}`} />
        <span className={`${styles.line} ${styles.address}`} />
        <span className={`${styles.line} ${styles.tag}`} />
      </div>
    </div>
  );
}
