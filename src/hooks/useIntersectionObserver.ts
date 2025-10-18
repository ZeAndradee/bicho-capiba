import { useEffect, useRef } from 'react';

interface UseIntersectionObserverOptions {
  onIntersect: () => void;
  threshold?: number;
  enabled?: boolean;
}

export const useIntersectionObserver = ({
  onIntersect,
  threshold = 0.1,
  enabled = true
}: UseIntersectionObserverOptions) => {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    const currentElement = targetRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersect();
        }
      },
      { threshold }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [onIntersect, threshold, enabled]);

  return targetRef;
};