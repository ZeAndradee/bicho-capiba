"use client";

import { CSSProperties } from "react";
import styles from "./StepSlider.module.css";

export interface StepSliderOption {
  value: string;
  label: string;
  description?: string;
}

interface StepSliderProps {
  options: StepSliderOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  invalid?: boolean;
}

export default function StepSlider({
  options,
  value,
  onChange,
  label,
  invalid = false,
}: StepSliderProps) {
  const selectedIndex = options.findIndex((option) => option.value === value);
  const hasValue = selectedIndex >= 0;
  const position = hasValue ? selectedIndex : 0;
  const fill = options.length > 1 ? (position / (options.length - 1)) * 100 : 0;
  const selected = hasValue ? options[selectedIndex] : null;

  const selectIndex = (index: number) => onChange(options[index].value);

  return (
    <div
      className={`${styles.slider} ${hasValue ? "" : styles.untouched} ${
        invalid ? styles.invalid : ""
      }`}
    >
      <div className={styles.summary} aria-live="polite">
        <strong>{selected ? selected.label : "Arraste para escolher"}</strong>
        {selected?.description && <span>{selected.description}</span>}
      </div>
      <input
        type="range"
        className={styles.range}
        min={0}
        max={options.length - 1}
        step={1}
        value={position}
        aria-label={label}
        aria-valuetext={selected?.label}
        style={{ "--fill": `${hasValue ? fill : 0}%` } as CSSProperties}
        onChange={(e) => selectIndex(Number(e.target.value))}
        onPointerUp={(e) => selectIndex(Number(e.currentTarget.value))}
        onKeyUp={(e) => selectIndex(Number(e.currentTarget.value))}
      />
      <div className={styles.ticks}>
        {options.map((option, index) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.tick} ${
              index === selectedIndex ? styles.tickActive : ""
            }`}
            onClick={() => selectIndex(index)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
