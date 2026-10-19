import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import Breadcrumb from "@/components/UI/Breadcrumb/Breadcrumb";
import StripTitle from "@/components/Events/StripTitle/StripTitle";
import CityHeroImage from "@/components/Events/CityHeroImage/CityHeroImage";
import BookingStatus from "@/components/Events/BookingStatus/BookingStatus";
import CityEventsContent from "@/components/Events/CityEventsContent/CityEventsContent";
import CityEventsContentSkeleton from "@/components/Events/CityEventsContent/CityEventsContentSkeleton";
import { eventCities, getEventCity } from "@/data/eventCities";
import styles from "./page.module.css";

export const revalidate = 3600;
export const dynamicParams = false;

interface CityPageProps {
  params: Promise<{ cidade: string }>;
}

export function generateStaticParams() {
  return eventCities.map((city) => ({ cidade: city.slug }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { cidade } = await params;
  const city = getEventCity(cidade);
  if (!city) return {};

  return {
    title: `Eventos pet em ${city.name} - Bicho Capiba`,
    description: `Castração gratuita, vacinação e feiras de adoção em ${city.name}.`,
  };
}

export default async function CityEvents({ params }: CityPageProps) {
  const { cidade } = await params;
  const city = getEventCity(cidade);
  if (!city) notFound();

  const program = city.program;
  const otherCities = eventCities.filter((item) => item.slug !== city.slug);

  return (
    <div className={styles.page}>
      <section
        className={`${styles.hero} ${city.heroImage ? styles.heroWithImage : ""}`}
      >
        {city.heroImage && <CityHeroImage src={city.heroImage} />}
        <div className={styles.heroText}>
          <Breadcrumb
            className={styles.breadcrumb}
            items={[
              { label: "Eventos", href: "/eventos" },
              { label: city.name },
            ]}
          />
          <StripTitle words={["eventos em", city.label]} size="medium" />
          {program ? (
            <>
              <p className={styles.subtitle}>{program.description}</p>
              <div className={styles.heroMeta}>
                <a
                  href={program.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.heroAction}
                >
                  {program.bookingLabel}
                  <ArrowUpRight size={18} />
                </a>
                <Suspense fallback={null}>
                  <BookingStatus citySlug={city.slug} />
                </Suspense>
              </div>
              <p className={styles.source}>
                Fonte:{" "}
                <a
                  href={program.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {program.sourceName}
                </a>
              </p>
            </>
          ) : (
            <p className={styles.subtitle}>
              Mutirões de castração, vacinação e feiras de adoção em {city.name}
              . Estamos chegando por aqui!
            </p>
          )}
        </div>
      </section>

      <Suspense fallback={<CityEventsContentSkeleton />}>
        <CityEventsContent city={city} />
      </Suspense>

      <section className={styles.otherCities}>
        <h2 className={styles.sectionTitle}>outras cidades</h2>
        <div className={styles.cityLinks}>
          {otherCities.map((item) => (
            <Link
              key={item.slug}
              href={`/eventos/${item.slug}`}
              className={styles.cityLink}
            >
              <span>{item.name}</span>
              <span className={styles.cityState}>{item.state}</span>
              <ChevronRight size={18} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
