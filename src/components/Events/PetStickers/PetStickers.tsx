import Image from "next/image";
import { PawPrint } from "lucide-react";
import styles from "./PetStickers.module.css";

interface PetStickersProps {
  caption?: string;
}

export default function PetStickers({ caption }: PetStickersProps) {
  return (
    <div className={styles.stickers} aria-hidden>
      <div className={`${styles.sticker} ${styles.dog}`}>
        <Image src="/images/DogFilter.png" alt="" width={243} height={238} priority />
      </div>
      <div className={`${styles.sticker} ${styles.cat}`}>
        <Image src="/images/CatFilter.png" alt="" width={243} height={238} priority />
      </div>
      <PawPrint className={`${styles.paw} ${styles.pawOne}`} size={34} />
      <PawPrint className={`${styles.paw} ${styles.pawTwo}`} size={22} />
      <PawPrint className={`${styles.paw} ${styles.pawThree}`} size={18} />
      {caption && <span className={styles.caption}>{caption}</span>}
    </div>
  );
}
