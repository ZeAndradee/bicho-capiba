"use client";

import { ReactNode } from "react";
import { Check } from "lucide-react";
import styles from "./ChoiceGroup.module.css";

type ChoiceValue = string | boolean;

export interface ChoiceOption<T extends ChoiceValue> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface BaseProps<T extends ChoiceValue> {
  options: ChoiceOption<T>[];
  label: string;
  variant?: "chips" | "cards" | "toggle";
  invalid?: boolean;
}

interface SingleProps<T extends ChoiceValue> extends BaseProps<T> {
  multiple?: false;
  value: T | null;
  onChange: (value: T) => void;
}

interface MultipleProps<T extends ChoiceValue> extends BaseProps<T> {
  multiple: true;
  value: T[];
  onChange: (value: T[]) => void;
}

type ChoiceGroupProps<T extends ChoiceValue> =
  | SingleProps<T>
  | MultipleProps<T>;

export default function ChoiceGroup<T extends ChoiceValue>(
  props: ChoiceGroupProps<T>
) {
  const { options, label, variant = "chips", invalid = false } = props;

  const isSelected = (optionValue: T) =>
    props.multiple
      ? props.value.includes(optionValue)
      : props.value === optionValue;

  const handleSelect = (optionValue: T) => {
    if (props.multiple) {
      props.onChange(
        props.value.includes(optionValue)
          ? props.value.filter((item) => item !== optionValue)
          : [...props.value, optionValue]
      );
      return;
    }

    props.onChange(optionValue);
  };

  return (
    <div
      className={`${styles.group} ${styles[variant]} ${
        invalid ? styles.invalid : ""
      }`}
      role={props.multiple ? "group" : "radiogroup"}
      aria-label={label}
    >
      {options.map((option) => {
        const selected = isSelected(option.value);

        return (
          <button
            key={String(option.value)}
            type="button"
            role={props.multiple ? "checkbox" : "radio"}
            aria-checked={selected}
            className={`${styles.option} ${selected ? styles.selected : ""}`}
            onClick={() => handleSelect(option.value)}
          >
            {option.icon && <span className={styles.icon}>{option.icon}</span>}
            <span className={styles.label}>{option.label}</span>
            {props.multiple && selected && (
              <Check size={16} className={styles.check} aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}
