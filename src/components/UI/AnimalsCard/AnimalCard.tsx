import { useState, useEffect } from "react";
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
import ImageWithFallback from "../Images/ImageWithFallback";
import { likeAnimal, unlikeAnimal } from "@/services/Animals/Animal";
import { formatAge } from "@/utils/formatters";
import styles from "./AnimalCard.module.css";

interface AnimalCardProps {
  id: string;
  nome: string;
  image: string;
  sexo: "M" | "F";
  idade?: number;
  data_nascimento?: string;
  raca: { id: number; nome: string; especieId: number };
  distancia: string;
  bairroOng: string;
  cidadeOng: string;
  isFavorite?: boolean;
  onFavoriteClick?: (id: string) => void;
  isPreview?: boolean;
}

export default function AnimalCard({
  id,
  nome,
  image,
  sexo,
  idade,
  data_nascimento,
  raca,
  distancia,
  bairroOng,
  cidadeOng,
  isFavorite = false,
  onFavoriteClick,
  isPreview = false,
}: AnimalCardProps) {
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [image]);

  const getAgeDisplay = () => {
    if (data_nascimento) {
      return formatAge(data_nascimento);
    }
    if (idade !== undefined) {
      return idade === 1 ? "1 ano" : `${idade} anos`;
    }
    return "0 anos";
  };

  const getAgeValue = () => {
    if (data_nascimento) {
      const birth = new Date(data_nascimento);
      const now = new Date();
      const totalDays = Math.floor(
        (now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24)
      );
      return Math.floor(totalDays / 365);
    }
    return idade || 0;
  };

  const handleFavoriteClick = async () => {
    try {
      if (isFavorite) {
        await unlikeAnimal(id);
      } else {
        await likeAnimal(id);
      }
      onFavoriteClick?.(id);
    } catch (error) {
      console.error("Failed to toggle like:", error);
    }
  };

  return (
    <div className={styles.card}>
      <div
        className={`${styles.imageContainer} ${
          isImageHovered ? styles.imageHovered : ""
        }`}
      >
        {isPreview ? (
          <div
            className={styles.imageLink}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            {imageError || image.includes("placeholder") ? (
              <ImageWithFallback
                src="/images/placeholder-animal.jpg"
                alt={nome}
                className={styles.image}
                fill
                sizes="(max-height: 200px)"
              />
            ) : (
              <img
                src={image}
                alt={nome}
                className={styles.image}
                onError={() => setImageError(true)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        ) : (
          <Link
            href={`/adote/${id}`}
            className={styles.imageLink}
            onMouseEnter={() => setIsImageHovered(true)}
            onMouseLeave={() => setIsImageHovered(false)}
          >
            <ImageWithFallback
              src={image}
              alt={nome}
              className={styles.image}
              fill
              sizes="(max-height: 200px)"
            />
          </Link>
        )}
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
          {isPreview ? (
            <div className={styles.nameLink}>
              <h3 className={styles.name}>{nome}</h3>
            </div>
          ) : (
            <Link href={`/adote/${id}`} className={styles.nameLink}>
              <h3 className={styles.name}>{nome}</h3>
            </Link>
          )}
          {isPreview ? (
            <div className={styles.genderLink}>
              <div
                className={styles.genderIcon}
                title={sexo === "M" ? "Macho" : "Fêmea"}
              >
                {sexo === "M" ? <FaMars /> : <FaVenus />}
              </div>
            </div>
          ) : (
            <Link
              href={`/adote/animais?gender=${sexo}`}
              className={styles.genderLink}
            >
              <div
                className={styles.genderIcon}
                title={sexo === "M" ? "Macho" : "Fêmea"}
              >
                {sexo === "M" ? <FaMars /> : <FaVenus />}
              </div>
            </Link>
          )}
        </div>

        <div className={styles.infoRow}>
          {isPreview ? (
            <div className={styles.ageLink}>
              <div className={styles.infoItem}>
                <FaClock className={styles.icon} />
                <span className={styles.text}>{getAgeDisplay()}</span>
              </div>
            </div>
          ) : (
            <Link
              href={`/adote/animais?age=${getAgeValue()}`}
              className={styles.ageLink}
            >
              <div className={styles.infoItem}>
                <FaClock className={styles.icon} />
                <span className={styles.text}>{getAgeDisplay()}</span>
              </div>
            </Link>
          )}
          {isPreview ? (
            <div className={styles.speciesLink}>
              <div className={styles.infoItem}>
                <FaPaw className={styles.icon} />
                <span className={styles.text}>{raca.nome}</span>
              </div>
            </div>
          ) : (
            <Link
              href={`/adote/animais?breed=${
                raca.nome || "".toLowerCase().replace(" ", "-")
              }`}
              className={styles.speciesLink}
            >
              <div className={styles.infoItem}>
                <FaPaw className={styles.icon} />
                <span className={styles.text}>{raca.nome}</span>
              </div>
            </Link>
          )}
        </div>

        <div className={styles.locationRow}>
          <div className={styles.infoItem}>
            <FaMapMarkerAlt className={styles.icon} />
            <span className={styles.text}>
              {distancia} • {bairroOng}, {cidadeOng}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
