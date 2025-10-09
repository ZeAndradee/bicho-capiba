"use client";

import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaCheck } from "react-icons/fa6";
import styles from "./Filter.module.css";

export interface FilterOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
}

interface FilterProps {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
  className?: string;
}

export default function Filter({
  value,
  onChange,
  options,
  placeholder = "Selecione...",
  className = "",
}: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const filterClasses = [
    styles.filter,
    isOpen ? styles.open : '',
    className
  ].filter(Boolean).join(" ");

  return (
    <div className={filterClasses} ref={filterRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className={styles.triggerContent}>
          {selectedOption?.icon && (
            <span className={styles.triggerIcon}>{selectedOption.icon}</span>
          )}
          <span className={styles.triggerText}>{displayText}</span>
        </div>
        <FaChevronDown className={styles.chevron} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button
            type="button"
            className={`${styles.option} ${!value ? styles.selected : ''}`}
            onClick={() => handleOptionClick('')}
          >
            <span className={styles.optionText}>{placeholder}</span>
            {!value && <FaCheck className={styles.checkIcon} />}
          </button>

          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.option} ${option.value === value ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              <div className={styles.optionContent}>
                {option.icon && (
                  <span className={styles.optionIcon}>{option.icon}</span>
                )}
                <span className={styles.optionText}>{option.label}</span>
              </div>
              {option.value === value && <FaCheck className={styles.checkIcon} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}