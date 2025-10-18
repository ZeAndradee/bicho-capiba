import Image from "next/image";
import { FaInstagram, FaTiktok, FaGithub } from "react-icons/fa";
import styles from "./Footer.module.css";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.container}>
          <div className={styles.logoSection}>
            <Image
              src="/icons/logoCapiba.svg"
              alt="Bicho Capiba"
              width={200}
              height={60}
              className={styles.logo}
            />

            <div className={styles.socialIcons}>
              <a
                href="https://instagram.com/bichocapiba"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <FaInstagram size={24} />
              </a>

              <a
                href="https://tiktok.com/@bichocapiba"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <FaTiktok size={24} />
              </a>

              <a
                href="https://github.com/Samuel-Duque/bicho-capiba"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <FaGithub size={24} />
              </a>
            </div>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.linkColumn}>
              <h3>Adoção</h3>
              <ul>
                <li>
                  <a href="/adocao">Encontrar um Pet</a>
                </li>
                <li>
                  <a href="/como-adotar">Como Adotar</a>
                </li>
                <li>
                  <a href="/requisitos">Requisitos</a>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h3>Doação</h3>
              <ul>
                <li>
                  <a href="/doacao">Fazer Doação</a>
                </li>
                <li>
                  <a href="/campanhas">Campanhas</a>
                </li>
                <li>
                  <a href="/voluntariado">Voluntariado</a>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h3>Sobre</h3>
              <ul>
                <li>
                  <a href="/sobre">Nossa História</a>
                </li>
                <li>
                  <a href="/contato">Contato</a>
                </li>
                <li>
                  <a href="/transparencia">Transparência</a>
                </li>
              </ul>
            </div>

            <div className={styles.linkColumn}>
              <h3>Legal</h3>
              <ul>
                <li>
                  <a href="/privacidade">Política de Privacidade</a>
                </li>
                <li>
                  <a href="/termos">Termos de Uso</a>
                </li>
                <li>
                  <a href="/cookies">Política de Cookies</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.container}>
            <p>
              &copy; {year || 2025} Bicho Capiba. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
