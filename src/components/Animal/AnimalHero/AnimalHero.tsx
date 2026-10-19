"use client";

import { useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ImageWithFallback from "@/components/UI/Images/ImageWithFallback";
import styles from "./AnimalHero.module.css";

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
}

interface AnimalHeroProps {
  animal: Animal | null;
}

export default function AnimalHero({ animal }: AnimalHeroProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  if (!animal) {
    return null;
  }

  const { nome, images } = animal;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const leftImageIndex =
    currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
  const rightImageIndex =
    currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;

  const hasMultipleImages = images.length > 1;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !hasMultipleImages) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(deltaX) < 40) return;
    if (deltaX < 0) {
      nextImage();
    } else {
      prevImage();
    }
  };

  return (
    <section className={styles.hero}>
      <div className={styles.carousel}>
        {hasMultipleImages && (
          <div className={styles.leftSideImages}>
            <div
              className={styles.sideImageContainer}
              onClick={() => setCurrentImageIndex(leftImageIndex)}
            >
              <ImageWithFallback
                src={images[leftImageIndex]}
                alt={`${nome} - Imagem ${leftImageIndex + 1}`}
                fill
                className={styles.sideImage}
                sizes="150px"
              />
            </div>
          </div>
        )}

        <div
          className={styles.mainImageContainer}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <ImageWithFallback
            src={images[currentImageIndex]}
            alt={`${nome} - Imagem ${currentImageIndex + 1}`}
            fill
            className={styles.mainImage}
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        </div>

        {hasMultipleImages && (
          <div className={styles.rightSideImages}>
            <div
              className={styles.sideImageContainer}
              onClick={() => setCurrentImageIndex(rightImageIndex)}
            >
              <ImageWithFallback
                src={images[rightImageIndex]}
                alt={`${nome} - Imagem ${rightImageIndex + 1}`}
                fill
                className={styles.sideImage}
                sizes="150px"
              />
            </div>
          </div>
        )}

        {hasMultipleImages && (
          <>
            <button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevImage}
              aria-label="Imagem anterior"
            >
              <FaChevronLeft />
            </button>

            <button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextImage}
              aria-label="Próxima imagem"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>
      {hasMultipleImages && (
        <div className={styles.dotsContainer}>
          {images.map((_, index) => (
            <button
              key={index}
              className={`${styles.dot} ${
                index === currentImageIndex ? styles.activeDot : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
              aria-label={`Ir para imagem ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
