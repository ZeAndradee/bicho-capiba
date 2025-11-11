"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import UserImage from "../UserImage/UserImage";
import {
  User,
  Settings,
  Heart,
  LogOut,
  Building2,
  BarChart3,
} from "lucide-react";
import styles from "./Header.module.css";

const navigationItems = [
  { label: "Inicio", href: "/" },
  { label: "Adote", href: "/adote" },
  { label: "Faça uma doação", href: "/doacao" },
  { label: "Meu Pet dos Sonhos", href: "/pet-sonhos" },
];

const rightNavigationItems = [
  { label: "Para ONGs", href: "/ong/sobre" },
  { label: "Entrar", href: "/entrar" },
];

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileUserDropdownOpen, setIsMobileUserDropdownOpen] =
    useState(false);
  const { user, logout, isLoading, isOng } = useAuth();
  const userDropdownRef = useRef<HTMLDivElement>(null);

  const isAuthPage =
    pathname === "/entrar" ||
    pathname === "/cadastro" ||
    pathname === "/cadastro-ong" ||
    pathname === "/cadastro-sucesso";

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserDropdownOpen(false);
      setIsMobileUserDropdownOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
  };

  const toggleMobileUserDropdown = () => {
    setIsMobileUserDropdownOpen(!isMobileUserDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const displayName = user
    ? (isOng ? user.nome : user.fullName) || ""
    : "";

  const getRightNavItems = () => {
    if (isAuthPage) {
      return [
        { label: "Para ONGs", href: "/ong/sobre" },
        { label: "Início", href: "/" },
      ];
    }

    if (user) {
      const items = [];

      if (isOng) {
        items.push({ label: "Dashboard", href: "/ong/dashboard" });
      } else {
        items.push({ label: "Para ONGs", href: "/ong/sobre" });
      }

      return items;
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
          </Link>
        ))}
        {user && (
          <div className={styles.userDropdown} ref={userDropdownRef}>
            <UserImage
              src=""
              alt={displayName}
              size="md"
              fallbackText={displayName}
              onClick={toggleUserDropdown}
              className={styles.userImageButton}
            />
            {isUserDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span className={styles.userName}>{displayName}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </div>
                <div className={styles.dropdownDivider}></div>
                {isOng && (
                  <Link
                    href="/ong/dashboard"
                    className={styles.dropdownItem}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <BarChart3 size={16} />
                    <span>Dashboard</span>
                  </Link>
                )}
                {!isOng && (
                  <Link
                    href="/perfil"
                    className={styles.dropdownItem}
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    <User size={16} />
                    <span>Perfil</span>
                  </Link>
                )}
                <Link
                  href={isOng ? "/ong/configuracoes" : "/perfil/configuracoes"}
                  className={styles.dropdownItem}
                  onClick={() => setIsUserDropdownOpen(false)}
                >
                  <Settings size={16} />
                  <span>Configurações</span>
                </Link>
                <div className={styles.dropdownDivider}></div>
                <button
                  onClick={handleLogout}
                  className={styles.dropdownLogout}
                  disabled={isLoading}
                >
                  <LogOut size={16} />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
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
          {user && (
            <div className={styles.mobileUserSection}>
              <div
                className={styles.mobileUserInfo}
                onClick={toggleMobileUserDropdown}
              >
                <UserImage
                  src=""
                  alt={displayName}
                  size="lg"
                  fallbackText={displayName}
                  className={styles.mobileUserImage}
                />
                <div className={styles.mobileUserDetails}>
                  <span className={styles.mobileUserName}>{displayName}</span>
                  <span className={styles.mobileUserEmail}>{user.email}</span>
                </div>
              </div>
              {isMobileUserDropdownOpen && (
                <div className={styles.mobileUserDropdown}>
                  {isOng && (
                    <Link
                      href="/ong/dashboard"
                      className={`${styles.mobileNavLink} ${styles.mobileUserLink}`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileUserDropdownOpen(false);
                      }}
                    >
                      <BarChart3 size={16} />
                      <span>Dashboard</span>
                    </Link>
                  )}
                  {!isOng && (
                    <Link
                      href="/perfil"
                      className={`${styles.mobileNavLink} ${styles.mobileUserLink}`}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileUserDropdownOpen(false);
                      }}
                    >
                      <User size={16} />
                      <span>Perfil</span>
                    </Link>
                  )}
                  <Link
                    href="/configuracoes"
                    className={`${styles.mobileNavLink} ${styles.mobileUserLink}`}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsMobileUserDropdownOpen(false);
                    }}
                  >
                    <Settings size={16} />
                    <span>Configurações</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className={`${styles.mobileNavLink} ${styles.mobileLogout}`}
                    disabled={isLoading}
                  >
                    <LogOut size={16} />
                    <span>Sair</span>
                  </button>
                </div>
              )}
            </div>
          )}
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
          </div>
        </nav>
      </div>

      {isMenuOpen && (
        <div className={styles.overlay} onClick={toggleMenu}></div>
      )}
    </header>
  );
}
