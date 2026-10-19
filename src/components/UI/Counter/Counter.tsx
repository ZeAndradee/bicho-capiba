"use client";

import { Minus, Plus } from "lucide-react";
import styles from "./Counter.module.css";

interface CounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label: string;
  unit?: [string, string];
}

export default function Counter({
  value,
  onChange,
  min = 0,
  max = 20,
  label,
  unit,
}: CounterProps) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const unitLabel = unit ? (value === 1 ? unit[0] : unit[1]) : null;

  return (
    <div className={styles.counter} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        aria-label={`Diminuir ${label}`}
      >
        <Minus size={20} />
      </button>
      <div className={styles.display} aria-live="polite">
        <span className={styles.value}>{value}</span>
        {unitLabel && <span className={styles.unit}>{unitLabel}</span>}
      </div>
      <button
        type="button"
        className={styles.button}
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        aria-label={`Aumentar ${label}`}
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
