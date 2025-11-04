"use client";

import { ErrorState } from "@/utils/ErrorHandler";
import { FaExclamationTriangle } from "react-icons/fa";
import styles from "./Error.module.css";

interface ErrorProps {
  error: ErrorState | null;
  className?: string;
}

export default function Error({ error, className }: ErrorProps) {
  if (!error) return null;

  return (
    <div className={`${styles.errorContainer} ${className || ""}`}>
      <FaExclamationTriangle className={styles.errorIcon} />
      <span className={styles.errorMessage}>{error.message}</span>
    </div>
  );
}