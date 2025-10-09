import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";
import styles from "./AdoptionDonationSections.module.css";

export default function AdoptionDonationSections() {
  return (
    <div className={styles.sectionsContainer}>
      <div className={styles.adoptionSection}>
        <div className={styles.imageContainer}>
          <Image
            src="/images/CatAdoptionCard.png"
            alt="Gato para adoção"
            width={228}
            height={228}
            className={styles.adoptionImage}
          />
        </div>
        <div className={styles.adoptionContent}>
          <h2 className={styles.adoptionTitle}>Adote um pet</h2>
          <p className={styles.adoptionSubtitle}>
            Transforme uma vida e ganhe um amigo para sempre. Milhares de pets
            estão esperando por um lar cheio de amor. Que tal ser você a fazer a
            diferença?
          </p>
          <button className={styles.adoptionButton}>
            Quero adotar
            <FaArrowRight size={20} />
          </button>
        </div>
      </div>

      <div className={styles.donationSection}>
        <div className={styles.donationContent}>
          <h2 className={styles.donationTitle}>Apoie uma ONG</h2>
          <p className={styles.donationSubtitle}>
            Transforme uma vida e ganhe um amigo para sempre. Milhares de pets
            estão esperando por um lar cheio de amor. Que tal ser você a fazer a
            diferença?
          </p>
          <button className={styles.donationButton}>
            Apoiar uma ONG
            <FaArrowRight size={20} />
          </button>
        </div>
        <div className={styles.imageContainer}>
          <Image
            src="/images/DogDonationCard.png"
            alt="Cachorro para doação"
            width={228}
            height={228}
            className={styles.donationImage}
          />
        </div>
      </div>
    </div>
  );
}
