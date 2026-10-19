import EventTicketSkeleton from "../EventTicketSkeleton/EventTicketSkeleton";
import styles from "./CityEventsContent.module.css";

export default function CityEventsContentSkeleton() {
  return (
    <div className={styles.sections} aria-busy="true" aria-label="Carregando eventos">
      <div className={styles.pastSection}>
        <span className={styles.skeletonHeader} />
        <div className={styles.skeletonRow}>
          <EventTicketSkeleton />
          <EventTicketSkeleton />
          <EventTicketSkeleton />
        </div>
      </div>
    </div>
  );
}
