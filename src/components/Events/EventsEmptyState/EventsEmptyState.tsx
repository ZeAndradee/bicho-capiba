import Image from "next/image";
import Link from "next/link";
import styles from "./EventsEmptyState.module.css";

interface EventsEmptyStateProps {
  cityName: string;
  compact?: boolean;
  kicker?: string;
  title?: string;
  description?: string;
  action?: { label: string; href: string; external?: boolean };
}

export default function EventsEmptyState({
  cityName,
  compact = false,
  kicker = "",
  title,
  description,
  action,
}: EventsEmptyStateProps) {
  return (
    <div className={`${styles.empty} ${compact ? styles.compact : ""}`}>
      <span className={styles.ticketHole} aria-hidden />
      <p className={styles.kicker}>{kicker}</p>
      <h3 className={styles.title}>
        {title ?? `Ainda não temos eventos em ${cityName}`}
      </h3>
      <p className={styles.description}>
        {description ??
          "Estamos mapeando mutirões de castração, vacinação e feiras de adoção na cidade. Volte logo!"}
      </p>
      {action &&
        (action.external ? (
          <a
            href={action.href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.action}
          >
            {action.label}
          </a>
        ) : (
          <Link href={action.href} className={styles.action}>
            {action.label}
          </Link>
        ))}
      <Image
        src="/images/AnimalSilhouette.png"
        alt=""
        width={708}
        height={127}
        className={styles.silhouette}
      />
    </div>
  );
}
