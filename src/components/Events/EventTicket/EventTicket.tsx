import { ArrowUpRight, Clock, MapPin, Navigation } from "lucide-react";
import { PetEvent } from "@/services/Events/Events";
import ExternalLink from "@/components/UI/ExternalLink/ExternalLink";
import { getDateParts, getShortWeekday } from "@/utils/eventDates";
import styles from "./EventTicket.module.css";

interface EventTicketProps {
  event: PetEvent;
  today: string;
  showActions?: boolean;
  compact?: boolean;
}

export default function EventTicket({
  event,
  today,
  showActions = false,
  compact = false,
}: EventTicketProps) {
  const { day, month } = getDateParts(event.date);
  const isPast = event.date < today;

  const ticketClasses = [
    styles.ticket,
    styles[event.category],
    compact ? styles.compact : "",
    isPast ? styles.past : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={ticketClasses} id={event.id}>
      <div className={styles.stub}>
        <span className={styles.weekday}>
          {getShortWeekday(event.weekday)}
        </span>
        <span className={styles.day}>{day}</span>
        <span className={styles.month}>{month}</span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{event.title}</h3>

        <ul className={styles.details}>
          {event.startTime && (
            <li className={styles.detail}>
              <Clock size={15} />
              <span>a partir das {event.startTime}</span>
            </li>
          )}
          <li className={styles.detail}>
            <MapPin size={15} />
            <span className={styles.location}>
              <strong className={styles.neighborhood}>
                {event.neighborhood}
              </strong>
              <span className={styles.address}>{event.address}</span>
            </span>
          </li>
        </ul>

        {showActions && !isPast && (
          <div className={styles.footer}>
            <ExternalLink
              href={event.bookingUrl}
              destination="o site de agendamento"
              className={styles.primaryAction}
            >
              Agendar
              <ArrowUpRight className={styles.arrowIcon} size={16} />
            </ExternalLink>
            <ExternalLink
              href={event.mapsUrl}
              destination="o mapa com a rota até o local"
              className={styles.secondaryAction}
            >
              <Navigation className={styles.navigationIcon} size={14} />
              Como chegar
            </ExternalLink>
          </div>
        )}
      </div>

      {isPast && <span className={styles.stamp}>realizado</span>}
    </article>
  );
}
