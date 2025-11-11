"use client";

import { useState, useEffect } from "react";
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
    title: "Coelhos",
    imageSrc: "/images/RabbitFilter.png",
    imageAlt: "Coelho",
  },
  {
    title: "Roedores",
    imageSrc: "/images/RatFilter.png",
    imageAlt: "Rato",
  },
];

export default function FilterCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width <= 640) {
        setCardsPerView(1);
      } else if (width <= 968) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    };

    updateCardsPerView();
    window.addEventListener("resize", updateCardsPerView);
    return () => window.removeEventListener("resize", updateCardsPerView);
  }, []);

  const maxIndex = Math.max(0, filters.length - cardsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const getTranslatePercentage = () => {
    if (cardsPerView === 1) return 100;
    if (cardsPerView === 2) return 50;
    return 33.33;
  };

  return (
    <div className={styles.carousel}>
      <button
        className={styles.arrowButton}
        onClick={prevSlide}
        aria-label="Filtro anterior"
        style={{ opacity: currentIndex === 0 ? 0.3 : 1 }}
        disabled={currentIndex === 0}
      >
        <FaArrowLeft size={25} />
      </button>

      <div className={styles.cardsContainer}>
        <div
          className={styles.cardsWrapper}
          style={{
            transform: `translateX(-${
              currentIndex * getTranslatePercentage()
            }%)`,
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
        disabled={currentIndex === maxIndex}
      >
        <FaArrowRight size={25} />
      </button>
    </div>
  );
}
