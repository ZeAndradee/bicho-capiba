"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import styles from "./Header.module.css";

const navigationItems = [
  { label: "Inicio", href: "/" },
  { label: "Adote", href: "/adote" },
  { label: "Faça uma doação", href: "/doacao" },
  { label: "Meu Pet dos Sonhos", href: "/pet-sonhos" },
];

const rightNavigationItems = [
  { label: "Para ONGs", href: "/para-ongs" },
  { label: "Entrar", href: "/entrar" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href={"/"}>
          <Image
            src="/icons/logoCapibaDark.svg"
            alt="Bicho Capiba Logo"
            width={200}
            height={40}
            style={{ textAlign: "left" }}
            priority
          />
        </Link>
      </div>

      <nav className={styles.desktopNav}>
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${
              pathname === item.href ? styles.active : ""
            }`}
          >
            {item.label}
            {pathname === item.href && <span className={styles.dot}></span>}
          </Link>
        ))}
      </nav>

      <nav className={styles.rightNav}>
        {rightNavigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${
              pathname === item.href ? styles.active : ""
            }`}
          >
            {item.label}
            {pathname === item.href && <span className={styles.dot}></span>}
          </Link>
        ))}
      </nav>

      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
        <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ''}`}></span>
      </button>

      <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.mobileNavLink} ${
                pathname === item.href ? styles.active : ""
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className={styles.mobileRightNav}>
            {rightNavigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileNavLink} ${styles.mobileRightNavLink} ${
                  pathname === item.href ? styles.active : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>

      {isMenuOpen && <div className={styles.overlay} onClick={toggleMenu}></div>}
    </header>
  );
}
