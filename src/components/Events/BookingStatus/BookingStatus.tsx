import { getCityEvents } from "@/services/Events/Events";
import { getTodayInRecife } from "@/utils/eventDates";
import styles from "./BookingStatus.module.css";

interface BookingStatusProps {
  citySlug: string;
}

export default async function BookingStatus({ citySlug }: BookingStatusProps) {
  const data = await getCityEvents(citySlug).catch(() => null);
  const today = getTodayInRecife();
  const todayEvent = data?.events.find((event) => event.date === today);
  if (!todayEvent) return null;

  return (
    <a href={`#${todayEvent.id}`} className={styles.tooltip}>
      acontecendo hoje!
    </a>
  );
}
