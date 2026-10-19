import { PawPrint } from "lucide-react";
import EventTicket from "../EventTicket/EventTicket";
import EventsCarousel from "../EventsCarousel/EventsCarousel";
import EventsEmptyState from "../EventsEmptyState/EventsEmptyState";
import CastramovelInfo from "../CastramovelInfo/CastramovelInfo";
import CityNews from "../CityNews/CityNews";
import { EventCity } from "@/data/eventCities";
import { getCityEvents } from "@/services/Events/Events";
import { getTodayInRecife, splitEventsByDate } from "@/utils/eventDates";
import styles from "./CityEventsContent.module.css";

interface CityEventsContentProps {
  city: EventCity;
}

export default async function CityEventsContent({
  city,
}: CityEventsContentProps) {
  const data = await getCityEvents(city.slug).catch(() => null);
  const program = city.program;

  if (!data) {
    return (
      <div className={styles.sections}>
        <EventsEmptyState
          cityName={city.name}
          title="Não conseguimos carregar a agenda agora"
          description="Tente novamente em alguns minutos ou confira as datas direto na fonte oficial."
          action={
            program
              ? {
                  label: `Abrir ${program.sourceName}`,
                  href: program.bookingUrl,
                  external: true,
                }
              : undefined
          }
        />
        <CityNews city={city} />
      </div>
    );
  }

  if (!data.source) {
    return (
      <CityNews
        city={city}
        fallback={
          <EventsEmptyState
            cityName={city.name}
            action={{ label: "Ver eventos em Recife", href: "/eventos/recife" }}
          />
        }
      />
    );
  }

  const today = getTodayInRecife();
  const { upcoming, past } = splitEventsByDate(data.events, today);

  return (
    <div className={styles.sections}>
      {upcoming.length > 0 ? (
        <EventsCarousel
          title={
            <>
              próximas datas
              <PawPrint className={styles.titlePaw} size={26} />
            </>
          }
        >
          {upcoming.map((event) => (
            <EventTicket
              key={event.id}
              event={event}
              today={today}
              showActions
            />
          ))}
        </EventsCarousel>
      ) : (
        <EventsEmptyState
          cityName={city.name}
          kicker="agenda fechada"
          title="Nenhuma data confirmada por enquanto"
          description="A prefeitura ainda não divulgou a próxima agenda do Castramóvel. Volte em breve!"
          action={
            data.bookingUrl
              ? {
                  label: `Abrir ${data.source.name}`,
                  href: data.bookingUrl,
                  external: true,
                }
              : undefined
          }
        />
      )}

      <CastramovelInfo
        slots={data.slots}
        restriction={data.restriction}
        notices={data.notices}
      />

      {past.length > 0 && (
        <section className={styles.pastSection}>
          <h2 className={styles.sectionTitle}>já aconteceram</h2>
          <div className={styles.pastGrid}>
            {past.map((event) => (
              <EventTicket key={event.id} event={event} today={today} compact />
            ))}
          </div>
        </section>
      )}

      <CityNews city={city} />
    </div>
  );
}
