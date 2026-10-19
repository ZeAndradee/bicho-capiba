import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PawPrint } from "lucide-react";
import EventsCalendar from "@/components/Events/EventsCalendar/EventsCalendar";
import EventsHowItWorks from "@/components/Events/EventsHowItWorks/EventsHowItWorks";
import CityEventsColumn from "@/components/Events/CityEventsColumn/CityEventsColumn";
import { eventCities } from "@/data/eventCities";
import styles from "./page.module.css";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Eventos pet - Bicho Capiba",
  description:
    "Castração gratuita, vacinação e feiras de adoção em Recife, Rio de Janeiro e São Paulo.",
};

export default function Eventos() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.title}>
            eventos
            <span className={styles.titleHighlight}>
              na sua cidade
              <svg
                className={styles.titleUnderline}
                viewBox="0 0 300 24"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M4 16 C 60 4, 110 4, 150 12 S 240 22, 296 8"
                  pathLength={1}
                />
              </svg>
            </span>
          </h1>
          <p className={styles.subtitle}>
            Descubra o que está acontecendo perto de você: castração gratuita,
            vacinação e feiras de adoção para participar junto com o seu pet.
          </p>
          <Link href="/eventos/recife" className={styles.heroAction}>
            Ver agenda de Recife
            <ArrowRight size={18} />
          </Link>
        </div>
        <EventsCalendar />
      </section>

      <EventsHowItWorks />

      <section className={styles.cities}>
        {eventCities.map((city) => (
          <CityEventsColumn key={city.slug} city={city} />
        ))}
      </section>

      <section className={styles.comingSoon}>
        <PawPrint className={styles.comingSoonIcon} size={28} />
        <h2 className={styles.comingSoonTitle}>mais cidades em breve</h2>
        <p className={styles.comingSoonText}>
          Estamos trabalhando para trazer eventos e notícias de outras cidades e
          estados. Logo, logo a sua cidade aparece por aqui!
        </p>
      </section>
    </div>
  );
}
