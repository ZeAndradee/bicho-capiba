import Image from "next/image";
import styles from "./CityHeroImage.module.css";

interface CityHeroImageProps {
  src: string;
}

export default function CityHeroImage({ src }: CityHeroImageProps) {
  return (
    <div className={styles.wrapper} aria-hidden>
      <div className={styles.media}>
        <Image
          src={src}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={70}
          sizes="(max-width: 968px) 100vw, 60vw"
          className={styles.image}
        />
      </div>
    </div>
  );
}
