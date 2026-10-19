"use client";

import { ReactNode, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./EventsCarousel.module.css";

interface EventsCarouselProps {
  title: ReactNode;
  children: ReactNode;
}

export default function EventsCarousel({ title, children }: EventsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * track.clientWidth * 0.8, behavior: "smooth" });
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.control}
            onClick={() => scroll(-1)}
            aria-label="Eventos anteriores"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className={styles.control}
            onClick={() => scroll(1)}
            aria-label="Próximos eventos"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <div className={styles.track} ref={trackRef}>
        {children}
      </div>
    </section>
  );
}
