"use client";

import { useState } from "react";
import Image from "next/image";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";
import styles from "./FilterCarousel.module.css";

const filters = [
  {
    title: "Gatos",
    imageSrc: "/images/CatFilter.png",
    imageAlt: "Gato",
  },
  {
    title: "Cachorros",
    imageSrc: "/images/DogFilter.png",
    imageAlt: "Cachorro",
  },
  {
    title: "Equinos",
    imageSrc: "/images/HorseFilter.png",
    imageAlt: "Cavalo",
  },
  {
    title: "Roedores",
    imageSrc: "/images/RatFilter.png",
    imageAlt: "Rato",
  },
  {
    title: "Répteis",
    imageSrc: "/images/SnakeFilter.png",
    imageAlt: "Cobra",
    width: "120px",
  },
];

export default function FilterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const cardsPerView = 3;
  const maxIndex = Math.max(0, filters.length - cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className={styles.carousel}>
      <button
        className={styles.arrowButton}
        onClick={prevSlide}
        aria-label="Filtro anterior"
        style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
      >
        <FaArrowLeft size={25} />
      </button>

      <div className={styles.cardsContainer}>
        <div
          className={styles.cardsWrapper}
          style={{
            transform: `translateX(-${currentIndex * 30.3}%)`,
          }}
        >
          {filters.map((filter, index) => (
            <div key={index} className={styles.cardItem}>
              <div className={styles.card}>
                <Image
                  src={filter.imageSrc}
                  alt={filter.imageAlt}
                  width={150}
                  height={150}
                  style={{
                    width: filter.width ? filter.width : "auto",
                  }}
                  className={styles.image}
                />
                <h3 className={styles.title}>{filter.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={styles.arrowButton}
        onClick={nextSlide}
        aria-label="Próximo filtro"
        style={{ opacity: currentIndex === maxIndex ? 0.3 : 1 }}
      >
        <FaArrowRight size={25} />
      </button>
    </div>
  );
}
