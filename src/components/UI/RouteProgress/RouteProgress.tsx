"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import styles from "./RouteProgress.module.css";

interface RouteProgressProps {
  anchorRef: RefObject<HTMLElement | null>;
}

const MAX_WAIT_MS = 15000;

const isInternalNavigation = (event: MouseEvent) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return false;
  }

  const anchor = (event.target as Element | null)?.closest("a");
  if (!anchor || !anchor.href) return false;
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;

  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin) return false;

  return (
    url.pathname !== window.location.pathname ||
    url.search !== window.location.search
  );
};

export default function RouteProgress({ anchorRef }: RouteProgressProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [top, setTop] = useState(0);
  const isActive = useRef(false);
  const trickleTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const updateTop = useCallback(() => {
    const bottom = anchorRef.current?.getBoundingClientRect().bottom ?? 0;
    setTop(Math.max(0, bottom));
  }, [anchorRef]);

  const clearTimers = () => {
    if (trickleTimer.current) clearInterval(trickleTimer.current);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (safetyTimer.current) clearTimeout(safetyTimer.current);
  };

  const finish = useCallback(() => {
    if (!isActive.current) return;
    isActive.current = false;
    clearTimers();
    setProgress(100);
    hideTimer.current = setTimeout(() => {
      setVisible(false);
      hideTimer.current = setTimeout(() => setProgress(0), 350);
    }, 350);
  }, []);

  const start = useCallback(() => {
    clearTimers();
    isActive.current = true;
    updateTop();
    setVisible(true);
    setProgress(10);
    trickleTimer.current = setInterval(() => {
      setProgress((current) => current + (90 - current) * 0.12);
    }, 250);
    safetyTimer.current = setTimeout(finish, MAX_WAIT_MS);
  }, [finish, updateTop]);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (isInternalNavigation(event)) start();
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [start]);

  useEffect(() => {
    finish();
  }, [pathname, searchParams, finish]);

  useEffect(() => {
    if (!visible) return;

    window.addEventListener("scroll", updateTop, { passive: true });
    return () => window.removeEventListener("scroll", updateTop);
  }, [visible, updateTop]);

  useEffect(() => clearTimers, []);

  return (
    <div
      className={`${styles.track} ${visible ? styles.visible : ""}`}
      style={{ top }}
      role="progressbar"
      aria-hidden={!visible}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
    >
      <div
        className={styles.bar}
        style={{ transform: `scaleX(${progress / 100})` }}
      />
    </div>
  );
}
