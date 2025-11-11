"use client";

import { useState, useEffect } from "react";
import { LuBuilding, LuCake, LuHeartOff } from "react-icons/lu";
import { BsFillTelephoneFill } from "react-icons/bs";
import ImageWithFallback from "@/components/UI/Images/ImageWithFallback";
import AdoptionModal from "@/components/Animal/AdoptionModal/AdoptionModal";
import { formatUrlParam } from "@/utils/formatters";
import styles from "./AnimalInfo.module.css";

interface Animal {
  id: string;
  nome: string;
  images: string[];
  sexo: "M" | "F";
  idade: string;
  raca: string;
  distancia: string;
  bairroOng: string;
  cidadeOng: string;
  descricao: string;
  historia?: string;
  castrado?: boolean;
}

interface Ong {
  nome: string;
  endereco: string;
  telefone: string;
  imagem: string;
}

interface AnimalInfoProps {
  animal: Animal | null;
  ong: Ong | null;
  shouldOpenModal?: boolean;
}

export default function AnimalInfo({
  animal,
  ong,
  shouldOpenModal = false,
}: AnimalInfoProps) {
  const [showFullStory, setShowFullStory] = useState(false);
  const [isAdoptionModalOpen, setIsAdoptionModalOpen] = useState(false);

  useEffect(() => {
    if (shouldOpenModal && animal && ong) {
      setIsAdoptionModalOpen(true);
    }
  }, [shouldOpenModal, animal, ong]);

  if (!animal || !ong) {
    return null;
  }

  const storyText = animal.historia || animal.descricao;
  const maxLength = 550;
  const shouldTruncate = storyText.length > maxLength;
  const displayText =
    shouldTruncate && !showFullStory
      ? storyText.substring(0, maxLength) + "..."
      : storyText;

  const encodedAddress = formatUrlParam(ong.endereco);
  const mapUrl = `https://maps.google.com/maps?q=${encodedAddress}&output=embed`;

  return (
    <section className={styles.animalInfo}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <h1 className={styles.title}>Olá, meu nome é {animal.nome}</h1>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <LuBuilding className={styles.statIcon} />
              <span>{ong.nome}</span>
            </div>
            <div className={styles.statItem}>
              <LuCake className={styles.statIcon} />
              <span>{animal.idade}</span>
            </div>
            <div className={styles.statItem}>
              <LuHeartOff className={styles.statIcon} />
              <span>{animal.castrado ? "Castrado" : "Não castrado"}</span>
            </div>
          </div>

          <button
            className={`${styles.adoptButton} ${styles.adoptButtonMobile}`}
            onClick={() => setIsAdoptionModalOpen(true)}
          >
            Quero adotar {animal.sexo === "M" ? "o" : "a"} {animal.nome}
          </button>

          <h2 className={styles.historyTitle}>Minha História</h2>
          <div className={styles.historySection}>
            <div className={styles.historyText}>
              {displayText.split("\n").map((paragraph, index) => (
                <p key={index} className={styles.paragraph}>
                  {paragraph}
                </p>
              ))}
            </div>
            {shouldTruncate && (
              <button
                className={styles.showMoreButton}
                onClick={() => setShowFullStory(!showFullStory)}
              >
                {showFullStory ? "Mostrar menos" : "Ver história completa"}
              </button>
            )}
          </div>
        </div>

        <div className={styles.rightColumn}>
          <button
            className={`${styles.adoptButton} ${styles.adoptButtonDesktop}`}
            onClick={() => setIsAdoptionModalOpen(true)}
          >
            Quero adotar {animal.sexo === "M" ? "o" : "a"} {animal.nome}
          </button>

          <div className={styles.mapContainer}>
            <iframe
              src={mapUrl}
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.map}
            />
          </div>

          <div className={styles.ongInfo}>
            <div className={styles.ongHeader}>
              <div className={styles.ongImageContainer}>
                <ImageWithFallback
                  src={ong.imagem}
                  alt={`Logo da ${ong.nome}`}
                  fill
                  className={styles.ongImage}
                  sizes="80px"
                />
              </div>
              <div className={styles.ongDetails}>
                <h3 className={styles.ongName}>{ong.nome}</h3>
                <p className={styles.ongAddress}>{ong.endereco}</p>
              </div>
              <button className={styles.phoneButton}>
                <BsFillTelephoneFill className={styles.phoneIcon} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <AdoptionModal
        isOpen={isAdoptionModalOpen}
        onClose={() => setIsAdoptionModalOpen(false)}
        animal={animal}
      />
    </section>
  );
}
