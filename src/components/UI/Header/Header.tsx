"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, logout, isLoading } = useAuth();

  const isAuthPage = pathname === "/entrar" || pathname === "/cadastro" || pathname === "/cadastro-ong" || pathname === "/cadastro-sucesso";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getRightNavItems = () => {
    if (isAuthPage) {
      return [
        { label: "Para ONGs", href: "/para-ongs" },
        { label: "Início", href: "/" },
      ];
    }

    if (user) {
      return [
        { label: "Para ONGs", href: "/para-ongs" },
        { label: `Olá, ${user.fullName}`, href: "/perfil" },
      ];
    }

    return rightNavigationItems;
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

      {!isAuthPage && (
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
      )}

      <nav className={styles.rightNav}>
        {getRightNavItems().map((item) => (
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
        {user && (
          <button
            onClick={handleLogout}
            className={styles.logoutButton}
            disabled={isLoading}
          >
            Sair
          </button>
        )}
      </nav>

      <button
        className={styles.hamburger}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span
          className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
        ></span>
        <span
          className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
        ></span>
        <span
          className={`${styles.hamburgerLine} ${isMenuOpen ? styles.open : ""}`}
        ></span>
      </button>

      <div
        className={`${styles.mobileMenu} ${
          isMenuOpen ? styles.mobileMenuOpen : ""
        }`}
      >
        <nav className={styles.mobileNav}>
          {!isAuthPage &&
            navigationItems.map((item) => (
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
            {getRightNavItems().map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.mobileNavLink} ${
                  styles.mobileRightNavLink
                } ${pathname === item.href ? styles.active : ""}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className={`${styles.mobileNavLink} ${styles.logoutButton}`}
                disabled={isLoading}
              >
                Sair
              </button>
            )}
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={toggleMenu}></div>
      )}
    </header>
  );
}
