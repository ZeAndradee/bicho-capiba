import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import styles from "./Breadcrumb.module.css";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  return (
    <nav className={`${styles.breadcrumb} ${className}`} aria-label="Navegação">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <Fragment key={`${item.label}-${index}`}>
            {item.href && !isLast ? (
              <Link href={item.href} className={styles.link}>
                {item.label}
              </Link>
            ) : (
              <span
                className={styles.current}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <ChevronRight
                size={14}
                className={styles.separator}
                aria-hidden
              />
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
