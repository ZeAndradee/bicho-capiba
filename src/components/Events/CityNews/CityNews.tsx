import Link from "next/link";
import { ReactNode } from "react";
import { ArrowUpRight, Newspaper } from "lucide-react";
import ExternalLink from "@/components/UI/ExternalLink/ExternalLink";
import { EventCity } from "@/data/eventCities";
import { getCityNews, PetNews } from "@/services/News/News";
import { getDateKey, getDateParts } from "@/utils/eventDates";
import styles from "./CityNews.module.css";

interface CityNewsProps {
  city: EventCity;
  compact?: boolean;
  fallback?: ReactNode;
}

const COMPACT_LIMIT = 3;

interface NewsCardProps {
  news: PetNews;
  city: EventCity;
  compact?: boolean;
}

function NewsCard({ news, city, compact = false }: NewsCardProps) {
  const { day, month, year } = getDateParts(
    getDateKey(new Date(news.publishedAt)),
  );

  return (
    <ExternalLink
      href={news.url}
      destination="a notícia completa"
      className={`${styles.card} ${compact ? styles.compact : ""}`}
    >
      <span className={styles.masthead}>{news.source}</span>
      <span className={styles.edition}>
        <span className={styles.editionCity}>edição {city.name}</span>
        <time dateTime={news.publishedAt} className={styles.date}>
          {day} {month} {year}
        </time>
      </span>
      <span className={styles.headline}>{news.title}</span>
      <span className={styles.columns} aria-hidden>
        <span className={styles.column} />
        <span className={styles.column} />
      </span>
      <span className={styles.readMore}>
        leia a matéria completa
        <ArrowUpRight size={15} />
      </span>
    </ExternalLink>
  );
}

export default async function CityNews({
  city,
  compact = false,
  fallback = null,
}: CityNewsProps) {
  const news = await getCityNews(city.newsKeywords).catch(() => []);
  if (!news.length) return fallback;

  if (compact) {
    const visibleNews = news.slice(0, COMPACT_LIMIT);

    return (
      <div className={styles.compactList}>
        {visibleNews.map((item) => (
          <NewsCard key={item.id} news={item} city={city} compact />
        ))}
        <Link href={`/eventos/${city.slug}`} className={styles.more}>
          ver tudo sobre {city.name}
        </Link>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>últimas notícias</h2>
        <p className={styles.subtitle}>
          O que saiu na imprensa sobre castração, vacinação e feiras de adoção
          em {city.name} nos últimos dois meses.
        </p>
      </div>

      <ul className={styles.grid}>
        {news.map((item) => (
          <li key={item.id} className={styles.item}>
            <NewsCard news={item} city={city} />
          </li>
        ))}
      </ul>

      <p className={styles.disclaimer}>
        Notícias reunidas automaticamente via Google Notícias. Confira datas e
        regras na fonte oficial.
      </p>
    </section>
  );
}
