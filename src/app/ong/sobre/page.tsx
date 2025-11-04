import Image from "next/image";
import Link from "next/link";
import Button from "@/components/UI/Button/Button";
import {
  FaArrowRight,
  FaHeart,
  FaUsers,
  FaCalendarCheck,
  FaGlobe,
  FaSearch,
  FaStore,
  FaDollarSign,
  FaClipboardList,
} from "react-icons/fa";
import styles from "./page.module.css";

export default function OngsSobre() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Onde ONGs e tutores se encontram</h1>
          <p className={styles.heroSubtitle}>
            Alcance mais tutores, simplifique o processo de adoção e tenha uma
            visão clara do impacto da sua ONG — tudo em uma única plataforma.
          </p>
          <Link href="/ong/cadastro">
            <Button
              variant="primary"
              color="yellow"
              size="large"
              icon={<FaArrowRight size={20} />}
              iconPosition="right"
            >
              Comece Agora
            </Button>
          </Link>
        </div>
        <div className={styles.heroImage}>
          <Image
            src="/icons/ongsAbout.svg"
            alt="ONG conectando animais com famílias"
            width={600}
            height={500}
            priority
          />
        </div>
      </section>

      <section className={styles.solutionsSection}>
        <h2 className={styles.sectionTitle}>Nossas soluções</h2>
        <p className={styles.sectionSubtitle}>
          As soluções do Bicho Capiba conectam animais com famílias em todos os
          lugares onde pessoas procuram por pets para adotar.
        </p>

        <div className={styles.solutionsGrid}>
          <div className={styles.solutionItem}>
            <FaSearch className={styles.solutionIcon} />
            <div className={styles.solutionContent}>
              <h3>Rede de Alcance</h3>
              <p>
                Receba interesse direto de adotantes através do Google, redes
                sociais e diretórios de pets.
              </p>
              <Link href="#" className={styles.learnMore}>
                Saiba mais
              </Link>
            </div>
          </div>

          <div className={styles.solutionItem}>
            <FaStore className={styles.solutionIcon} />
            <div className={styles.solutionContent}>
              <h3>Marketplace Bicho Capiba</h3>
              <p>
                Alcance milhares de pessoas procurando por pets para adotar no
                Bicho Capiba.
              </p>
              <Link href="#" className={styles.learnMore}>
                Saiba mais
              </Link>
            </div>
          </div>

          <div className={styles.solutionItem}>
            <FaDollarSign className={styles.solutionIcon} />
            <div className={styles.solutionContent}>
              <h3>Doações Seguras</h3>
              <p>
                Receba doações diretamente através da plataforma de forma segura
                e transparente.
              </p>
              <Link href="#" className={styles.learnMore}>
                Saiba mais
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.trustSection}>
        <h2 className={styles.sectionTitle}>
          Impulsionando ONGs de todos os tamanhos
        </h2>
        <p className={styles.sectionSubtitle}>
          Desde abrigos locais até grandes redes de proteção animal, o Bicho
          Capiba conecta quem resgata a quem quer adotar — impulsionando o
          crescimento e a visibilidade das ONGs em todo o país.
        </p>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>
            Recursos essenciais para sua ONG
          </h2>
          <p className={styles.sectionSubtitle}>
            Todas as soluções do Bicho Capiba incluem recursos para economizar
            tempo da sua ONG e ajudar você a conectar mais animais com famílias.
          </p>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <FaCalendarCheck className={styles.featureIcon} />
              <h3>Disponibilidade Flexível</h3>
              <p>
                Configure seus dias disponíveis para visitas e adoções de forma
                personalizada.
              </p>
            </div>

            <div className={styles.featureCard}>
              <FaClipboardList className={styles.featureIcon} />
              <h3>Formulários Personalizados</h3>
              <p>
                Crie formulários de adoção customizados para sua ONG através da
                plataforma.
              </p>
            </div>

            <div className={styles.featureCard}>
              <FaUsers className={styles.featureIcon} />
              <h3>Gestão de Adotantes</h3>
              <p>
                Acompanhe interessados e gerencie todo o processo de adoção
                online.
              </p>
            </div>

            <div className={styles.featureCard}>
              <FaDollarSign className={styles.featureIcon} />
              <h3>Receber Doações</h3>
              <p>
                Permita que apoiadores façam doações diretamente para sua ONG
                através da plataforma.
              </p>
            </div>

            <div className={styles.featureCard}>
              <FaHeart className={styles.featureIcon} />
              <h3>Perfis Detalhados</h3>
              <p>
                Crie perfis completos dos animais com fotos, histórias e
                características.
              </p>
            </div>

            <div className={styles.featureCard}>
              <FaGlobe className={styles.featureIcon} />
              <h3>Visibilidade Online</h3>
              <p>
                Aumente o alcance da sua ONG com presença digital profissional.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
