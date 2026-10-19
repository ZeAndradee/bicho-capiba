import { CalendarDays, MapPin, MousePointerClick } from "lucide-react";
import EventsLoopVideo from "../EventsLoopVideo/EventsLoopVideo";
import styles from "./EventsHowItWorks.module.css";

const steps = [
  {
    icon: MapPin,
    accent: "orange",
    title: "Escolha sua cidade",
    description:
      "Veja quais eventos estão rolando no mês em Recife, Rio de Janeiro ou São Paulo.",
  },
  {
    icon: CalendarDays,
    accent: "yellow",
    title: "Confira a agenda",
    description:
      "Filtre por castração, vacinação ou adoção e veja data, horário e local de cada evento.",
  },
  {
    icon: MousePointerClick,
    accent: "green",
    title: "Agende ou conheça os pets",
    description:
      "Garanta sua vaga direto na fonte oficial ou conheça os pets das feiras de adoção.",
  },
];

export default function EventsHowItWorks() {
  return (
    <section className={styles.section}>
      <div className={styles.content}>
        <h2 className={styles.title}>como funciona?</h2>
        <ol className={styles.steps}>
          {steps.map(({ icon: Icon, accent, title, description }, index) => (
            <li key={title} className={`${styles.step} ${styles[accent]}`}>
              <span className={styles.stepNumber}>
                <Icon size={18} />
              </span>
              <div className={styles.stepText}>
                <h3 className={styles.stepTitle}>{title}</h3>
                <p className={styles.stepDescription}>{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <EventsLoopVideo />
    </section>
  );
}
