import Link from "next/link";
import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import { EventCity } from "@/data/eventCities";
import { getCityEvents } from "@/services/Events/Events";
import { getTodayInRecife, splitEventsByDate } from "@/utils/eventDates";
import EventTicket from "../EventTicket/EventTicket";
import EventTicketSkeleton from "../EventTicketSkeleton/EventTicketSkeleton";
import EventsEmptyState from "../EventsEmptyState/EventsEmptyState";
import CityNews from "../CityNews/CityNews";
import styles from "./CityEventsColumn.module.css";

interface CityEventsColumnProps {
  city: EventCity;
  limit?: number;
}

async function CityEventsList({ city, limit = 5 }: CityEventsColumnProps) {
  const data = await getCityEvents(city.slug).catch(() => null);

  if (!data) {
    return (
      <EventsEmptyState
        cityName={city.name}
        compact
        title="Não conseguimos carregar a agenda agora"
        description="Tente novamente em alguns minutos ou confira a fonte oficial."
        action={
          city.program
            ? {
                label: `Abrir ${city.program.sourceName}`,
                href: city.program.bookingUrl,
                external: true,
              }
            : undefined
        }
      />
    );
  }

  const today = getTodayInRecife();
  const { upcoming } = splitEventsByDate(data.events, today);

  if (!upcoming.length) {
    return data.source ? (
      <EventsEmptyState
        cityName={city.name}
        compact
        kicker="agenda fechada"
        title="Nenhuma data confirmada por enquanto"
        description={`A próxima agenda de ${city.name} ainda não foi divulgada. Volte em breve!`}
      />
    ) : (
      <CityNews
        city={city}
        compact
        fallback={<EventsEmptyState cityName={city.name} compact />}
      />
    );
  }

  const visibleEvents = upcoming.slice(0, limit);
  const hiddenCount = upcoming.length - visibleEvents.length;

  return (
    <div className={styles.list}>
      {visibleEvents.map((event) => (
        <Link
          key={event.id}
          href={`/eventos/${city.slug}#${event.id}`}
          className={styles.ticketLink}
        >
          <EventTicket
            event={event}
            today={today}
            compact
          />
        </Link>
      ))}
      {hiddenCount > 0 && (
        <Link href={`/eventos/${city.slug}`} className={styles.more}>
          + {hiddenCount} {hiddenCount === 1 ? "evento" : "eventos"} em{" "}
          {city.name}
        </Link>
      )}
    </div>
  );
}

export default function CityEventsColumn({
  city,
  limit,
}: CityEventsColumnProps) {
  return (
    <section className={styles.column}>
      <Link href={`/eventos/${city.slug}`} className={styles.titleLink}>
        <h2 className={styles.title}>{city.label}</h2>
        <ChevronRight className={styles.titleIcon} size={28} />
      </Link>

      <Suspense
        fallback={
          <div className={styles.list}>
            <EventTicketSkeleton compact />
            <EventTicketSkeleton compact />
            <EventTicketSkeleton compact />
          </div>
        }
      >
        <CityEventsList city={city} limit={limit} />
      </Suspense>
    </section>
  );
}
