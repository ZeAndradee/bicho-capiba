import { Ban, CalendarClock, Cat, Dog, Hospital } from "lucide-react";
import { EventRestriction, EventSlot } from "@/services/Events/Events";
import styles from "./CastramovelInfo.module.css";

interface CastramovelInfoProps {
  slots: EventSlot[];
  restriction: EventRestriction | null;
  notices: string[];
}

const capitalize = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

const getNoticeMeta = (notice: string) => {
  if (/hospital veterin/i.test(notice)) {
    return { title: "Hospital Veterinário", icon: <Hospital size={20} /> };
  }
  return { title: "Só com agendamento", icon: <CalendarClock size={20} /> };
};

export default function CastramovelInfo({
  slots,
  restriction,
  notices,
}: CastramovelInfoProps) {
  if (!slots.length && !restriction && !notices.length) return null;

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>como funciona no dia</h2>
        <p className={styles.subtitle}>
          Cada horário atende um grupo. Chegue meia hora antes com o comprovante
          do agendamento.
        </p>
      </div>

      {slots.length > 0 && (
        <ol className={styles.timeline}>
          {slots.map((slot) => (
            <li
              key={`${slot.time}-${slot.audience}`}
              className={`${styles.stop} ${styles[slot.species]}`}
            >
              <span className={styles.node}>
                {slot.species === "cat" ? <Cat size={22} /> : <Dog size={22} />}
              </span>
              <div className={styles.stopText}>
                <span className={styles.time}>{slot.time}</span>
                <span className={styles.audience}>
                  {capitalize(slot.audience)}
                </span>
                <span className={styles.arrival}>
                  chegada às {slot.arrival}
                </span>
              </div>
            </li>
          ))}
        </ol>
      )}

      {(restriction || notices.length > 0) && (
        <div className={styles.cards}>
          {restriction && (
            <article className={styles.card}>
              <span className={styles.cardIcon}>
                <Ban size={20} />
              </span>
              <h3 className={styles.cardTitle}>
                Braquicefálicos não são atendidos
              </h3>
              <p className={styles.cardText}>
                {restriction.title}, os pets de focinho curto. Alguns exemplos
                de raças:
              </p>
              {restriction.groups.map((group) => (
                <div key={group.label} className={styles.group}>
                  <span className={styles.groupLabel}>{group.label}</span>
                  <div className={styles.chips}>
                    {group.items.map((item) => (
                      <span key={item} className={styles.chip}>
                        {item}
                      </span>
                    ))}
                    <span className={`${styles.chip} ${styles.chipMuted}`}>
                      entre outras
                    </span>
                  </div>
                </div>
              ))}
            </article>
          )}

          {notices.map((notice) => {
            const { title, icon } = getNoticeMeta(notice);
            return (
              <article key={notice} className={styles.card}>
                <span className={styles.cardIcon}>{icon}</span>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardText}>{notice}</p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
