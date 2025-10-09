import Image from "next/image";
import FilterCarousel from "@/components/Adote/Filters/FilterCarousel";
import styles from "./page.module.css";
import CloseAnimalsFeed from "@/components/Adote/CloseAnimalsFeed/CloseAnimalsFeed";

export default function Adotar() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroBlurLeft}>
          <Image
            src="/icons/blurredPaws.svg"
            alt=""
            className={styles.blurredPaws}
            width={100}
            height={100}
          />
        </div>
        <div className={styles.heroContent}>
          <div className={styles.textContainer}>
            <h1 className={styles.heroTitle}>
              Adote um Companheiro <br /> para a Vida
            </h1>
            <p className={styles.heroSubtitle}>
              Transforme uma vida e ganhe um amigo para sempre. São milhares de
              pets esperando por um lar cheio de amor, carinho e a chance de
              serem felizes.
            </p>
          </div>
          <Image
            src="/images/AdoptionHeroDog.png"
            alt="Cachorro esperando por adoção"
            className={styles.heroImage}
            width={400}
            height={400}
            priority
          />
        </div>
        <div className={styles.heroBlurRight}>
          <Image
            src="/icons/blurredPaws2.svg"
            alt=""
            className={styles.blurredPaws2}
            width={100}
            height={100}
          />
        </div>
      </section>

      <section className={styles.filtersSection}>
        <FilterCarousel />
      </section>

      <section className={styles.feedSection}>
        <CloseAnimalsFeed />
      </section>
    </div>
  );
}
