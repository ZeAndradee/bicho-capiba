"use client";

import { MouseEvent, ReactNode, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight, Globe, PawPrint, X } from "lucide-react";
import styles from "./ExternalLink.module.css";

interface ExternalLinkProps {
  href: string;
  destination: string;
  className?: string;
  children: ReactNode;
}

const getHostname = (href: string) => {
  try {
    return new URL(href).hostname.replace(/^www\./, "");
  } catch {
    return href;
  }
};

export default function ExternalLink({
  href,
  destination,
  className,
  children,
}: ExternalLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const continueRef = useRef<HTMLAnchorElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    continueRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      trigger?.focus();
    };
  }, [isOpen]);

  const handleTriggerClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setIsOpen(false);
  };

  return (
    <>
      <a
        ref={triggerRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleTriggerClick}
      >
        {children}
      </a>

      {isOpen &&
        createPortal(
          <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div
              className={styles.modal}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
            >
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setIsOpen(false)}
                aria-label="Fechar"
              >
                <X size={18} />
              </button>

              <div className={styles.paws} aria-hidden>
                {[0, 1, 2, 3, 4].map((step) => (
                  <PawPrint
                    key={step}
                    className={styles.paw}
                    style={{ animationDelay: `${0.15 + step * 0.22}s` }}
                    size={20}
                  />
                ))}
              </div>

              <h2 id={titleId} className={styles.title}>
                Você está saindo do Bicho Capiba
              </h2>
              <p className={styles.description}>
                Vamos abrir {destination} em uma nova aba. Pode ir tranquilo, a
                gente fica aqui te esperando!
              </p>

              <span className={styles.host}>
                <Globe size={14} />
                {getHostname(href)}
              </span>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.stayButton}
                  onClick={() => setIsOpen(false)}
                >
                  Ficar por aqui
                </button>
                <a
                  ref={continueRef}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.continueButton}
                  onClick={() => setIsOpen(false)}
                >
                  Continuar
                  <ArrowUpRight className={styles.continueIcon} size={16} />
                </a>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
