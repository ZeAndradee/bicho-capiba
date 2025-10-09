import { useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaMars,
  FaVenus,
  FaClock,
  FaPaw,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import styles from "./AnimalCard.module.css";

interface AnimalCardProps {
  id: string;
  name: string;
  image: string;
  gender: "male" | "female";
  age: string;
  breed: string;
  distance: string;
  neighborhood: string;
  city: string;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
}

export default function AnimalCard({
  id,
  name,
  image,
  gender,
  age,
  breed,
  distance,
  neighborhood,
  city,
  isFavorite = false,
  onFavoriteClick,
}: AnimalCardProps) {
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleFavoriteClick = () => {
    onFavoriteClick?.(id);
  };

  return (
    <div className={styles.card}>
      <div
        className={`${styles.imageContainer} ${
          isImageHovered ? styles.imageHovered : ""
        }`}
      >
        <Link
          href={`/adote/${id}`}
          className={styles.imageLink}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <Image src={image} alt={name} className={styles.image} width={300} height={300} />
        </Link>
        <button
          className={`${styles.favoriteButton} ${
            isFavorite ? styles.favoriteButtonLiked : ""
          }`}
          onClick={handleFavoriteClick}
          title={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          {isFavorite ? (
            <FaHeart className={styles.heartFilled} />
          ) : (
            <FaRegHeart className={styles.heart} />
          )}
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.nameRow}>
          <Link href={`/adote/${id}`} className={styles.nameLink}>
            <h3 className={styles.name}>{name}</h3>
          </Link>
          <Link
            href={`/adote/animais?gender=${gender}`}
            className={styles.genderLink}
          >
            <div
              className={styles.genderIcon}
              title={gender === "male" ? "Macho" : "Fêmea"}
            >
              {gender === "male" ? <FaMars /> : <FaVenus />}
            </div>
          </Link>
        </div>

        <div className={styles.infoRow}>
          <Link
            href={`/adote/animais?age=${age.replace(" ", "")}`}
            className={styles.ageLink}
          >
            <div className={styles.infoItem}>
              <FaClock className={styles.icon} />
              <span className={styles.text}>{age}</span>
            </div>
          </Link>
          <Link
            href={`/adote/animais?breed=${breed
              .toLowerCase()
              .replace(" ", "-")}`}
            className={styles.speciesLink}
          >
            <div className={styles.infoItem}>
              <FaPaw className={styles.icon} />
              <span className={styles.text}>{breed}</span>
            </div>
          </Link>
        </div>

        <div className={styles.locationRow}>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt className={styles.icon} />
            <span className={styles.text}>
              {distance} • {neighborhood}, {city}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
