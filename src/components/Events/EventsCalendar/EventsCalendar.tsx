import { EventCategory } from "@/services/Events/Events";
import { getTodayInRecife } from "@/utils/eventDates";
import styles from "./EventsCalendar.module.css";

const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const chipLabels: Record<EventCategory, string> = {
  castracao: "Castração",
  vacinacao: "Vacinação",
  adocao: "Feira de adoção",
};

const sampleEvents: Record<number, EventCategory> = {
  3: "vacinacao",
  6: "adocao",
  8: "castracao",
  11: "castracao",
  15: "adocao",
  19: "vacinacao",
  23: "vacinacao",
  26: "adocao",
  29: "castracao",
};

const getMonthCells = (year: number, month: number) => {
  const leading = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const total = Math.ceil((leading + daysInMonth) / 7) * 7;

  return Array.from({ length: total }, (_, index) => {
    const day = index - leading + 1;
    return day >= 1 && day <= daysInMonth ? day : null;
  });
};

export default function EventsCalendar() {
  const [year, month, today] = getTodayInRecife().split("-").map(Number);
  const monthName = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
  const cells = getMonthCells(year, month);
  let chipOrder = 0;

  return (
    <div className={styles.wrapper} aria-hidden>
      <div className={styles.calendar}>
        <p className={styles.month}>
          {monthName} {year}
        </p>
        <div className={styles.weekdays}>
          {weekdays.map((weekday) => (
            <span key={weekday} className={styles.weekday}>
              {weekday}
            </span>
          ))}
        </div>
        <div className={styles.grid}>
          {cells.map((day, index) => {
            const category = day ? sampleEvents[day] : undefined;

            return (
              <div
                key={index}
                className={`${styles.cell} ${
                  day === today ? styles.today : ""
                }`}
              >
                {day && <span className={styles.day}>{day}</span>}
                {category && (
                  <span
                    className={`${styles.chip} ${styles[category]}`}
                    style={{ animationDelay: `${0.15 + chipOrder++ * 0.03}s` }}
                  >
                    {chipLabels[category]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
