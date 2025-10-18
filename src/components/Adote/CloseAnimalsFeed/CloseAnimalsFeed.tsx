"use client";

import React, { useState, useEffect, useCallback } from "react";
import AnimalCard from "@/components/UI/AnimalsCard/AnimalCard";
import Filter, { FilterOption } from "@/components/UI/Filter/Filter";
import CloseAnimalsFeedSkeleton from "@/components/UI/Skeletons/CloseAnimalsFeedSkeleton";
import AnimalCardSkeleton from "@/components/UI/Skeletons/AnimalCardSkeleton";
import { fetchAnimals } from "@/services/Animals/Animal";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import {
  FaMars,
  FaVenus,
  FaLocationDot,
  FaDog,
  FaCat,
  FaHorse,
  FaFeather,
  FaCarrot,
  FaRotateLeft,
  FaPaw,
} from "react-icons/fa6";
import { LiaBirthdayCakeSolid } from "react-icons/lia";

import styles from "./CloseAnimalsFeed.module.css";

interface Filters {
  idade: string;
  sexo: string;
  distance: string;
  especie: string;
}

const speciesMap: { [key: string]: string } = {
  Cachorro: "dog",
  Gato: "cat",
  Cavalo: "horse",
  Pássaro: "bird",
  Coelho: "rabbit",
};

const ageOptions: FilterOption[] = [
  { value: "meses", label: "Filhotes (meses)", icon: <LiaBirthdayCakeSolid /> },
  { value: "1 ano", label: "1 ano" },
  { value: "2 anos", label: "2 anos" },
  { value: "3 anos", label: "3 anos" },
  { value: "4 anos", label: "4+ anos" },
];

const genderOptions: FilterOption[] = [
  { value: "M", label: "Macho", icon: <FaMars /> },
  { value: "F", label: "Fêmea", icon: <FaVenus /> },
];

const distanceOptions: FilterOption[] = [
  { value: "0.", label: "Menos de 1km", icon: <FaLocationDot /> },
  { value: "1.", label: "1-2km" },
  { value: "2.", label: "2-3km" },
  { value: "3.", label: "3km+" },
];

const speciesOptions: FilterOption[] = [
  { value: "dog", label: "Cachorro", icon: <FaDog /> },
  { value: "cat", label: "Gato", icon: <FaCat /> },
  { value: "horse", label: "Cavalo", icon: <FaHorse /> },
  { value: "bird", label: "Pássaro", icon: <FaFeather /> },
  { value: "rabbit", label: "Coelho", icon: <FaCarrot /> },
];

const CloseAnimalsFeed = () => {
  const [animals, setAnimals] = useState<Array<{
    uuid: string;
    nome: string;
    sexo: "M" | "F";
    idade: number;
    raca: string;
    especie: string;
    fotos?: Array<{ url: string }>;
    ong?: { bairro?: string; cidade?: string };
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    idade: "",
    sexo: "",
    distance: "",
    especie: "",
  });

  const loadAnimals = useCallback(
    async (page: number = 1, reset: boolean = false) => {
      try {
        if (page === 1) {
          setLoading(true);
        } else {
          setLoadingMore(true);
        }

        const { animals: newAnimals } = await fetchAnimals(
          page,
          10
        );

        setAnimals((prev) => {
          if (reset) {
            return newAnimals;
          } else {
            return [...prev, ...newAnimals];
          }
        });

        setHasMoreData(newAnimals.length > 0);
      } catch (error) {
        console.error("Failed to fetch animals:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    []
  );

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMoreData) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [loadingMore, hasMoreData]);

  const observerRef = useIntersectionObserver({
    onIntersect: handleLoadMore,
    enabled: hasMoreData && animals.length > 0,
  });

  useEffect(() => {
    loadAnimals(1, true);
  }, [loadAnimals]);

  useEffect(() => {
    if (currentPage > 1) {
      loadAnimals(currentPage, false);
    }
  }, [currentPage, loadAnimals]);

  const handleFavoriteClick = (animalId: string) => {
    setFavorites((prev) =>
      prev.includes(animalId)
        ? prev.filter((id) => id !== animalId)
        : [...prev, animalId]
    );
  };

  const handleFilterChange = (filterType: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      idade: "",
      sexo: "",
      distance: "",
      especie: "",
    });
    setCurrentPage(1);
    loadAnimals(1, true);
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  const filteredAnimals = animals.filter((animal) => {
    if (
      filters.idade &&
      animal.idade.toString() !== filters.idade.replace(" anos", "")
    )
      return false;
    if (filters.sexo && animal.sexo !== filters.sexo) return false;
    if (filters.distance) return false;
    if (
      filters.especie &&
      (speciesMap[animal.especie] || animal.especie.toLowerCase()) !==
        filters.especie
    )
      return false;
    return true;
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Conheça os animais perto de você</h1>

          <div className={styles.filters}>
            <Filter
              value={filters.idade}
              onChange={(value) => handleFilterChange("idade", value)}
              options={ageOptions}
              placeholder="Todas as idades"
            />

            <Filter
              value={filters.sexo}
              onChange={(value) => handleFilterChange("sexo", value)}
              options={genderOptions}
              placeholder="Todos os gêneros"
            />

            <Filter
              value={filters.distance}
              onChange={(value) => handleFilterChange("distance", value)}
              options={distanceOptions}
              placeholder="Todas as distâncias"
            />

            <Filter
              value={filters.especie}
              onChange={(value) => handleFilterChange("especie", value)}
              options={speciesOptions}
              placeholder="Todas as espécies"
            />
          </div>
        </div>
        <CloseAnimalsFeedSkeleton />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Conheça os animais perto de você</h1>

        <div className={styles.filters}>
          <Filter
            value={filters.idade}
            onChange={(value) => handleFilterChange("idade", value)}
            options={ageOptions}
            placeholder="Todas as idades"
          />

          <Filter
            value={filters.sexo}
            onChange={(value) => handleFilterChange("sexo", value)}
            options={genderOptions}
            placeholder="Todos os gêneros"
          />

          <Filter
            value={filters.distance}
            onChange={(value) => handleFilterChange("distance", value)}
            options={distanceOptions}
            placeholder="Todas as distâncias"
          />

          <Filter
            value={filters.especie}
            onChange={(value) => handleFilterChange("especie", value)}
            options={speciesOptions}
            placeholder="Todas as espécies"
          />
        </div>
      </div>

      <div className={styles.resultsRow}>
        <span className={styles.resultsCount}>
          {filteredAnimals.length}{" "}
          {filteredAnimals.length === 1
            ? "animal encontrado"
            : "animais encontrados"}
          {hasActiveFilters && " com esses filtros"}
        </span>
        {hasActiveFilters && (
          <button className={styles.resetButton} onClick={resetFilters}>
            <FaRotateLeft />
            Limpar filtros
          </button>
        )}
      </div>

      {filteredAnimals.length === 0 ? (
        <div className={styles.noResults}>
          <FaPaw className={styles.noResultsIcon} />
          <h3>Nenhum animal encontrado</h3>
          <p>Não foram encontrados animais com os filtros selecionados.</p>
          <button className={styles.resetButton} onClick={resetFilters}>
            <FaRotateLeft />
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className={styles.feed}>
          {filteredAnimals.map((animal) => (
            <AnimalCard
              key={animal.uuid}
              id={animal.uuid}
              nome={animal.nome}
              image={animal.fotos?.[0]?.url || ""}
              sexo={animal.sexo}
              idade={animal.idade}
              raca={animal.raca}
              distancia="Próximo"
              bairroOng={animal.ong?.bairro || "Não informado"}
              cidadeOng={animal.ong?.cidade || "Não informado"}
              isFavorite={favorites.includes(animal.uuid)}
              onFavoriteClick={handleFavoriteClick}
            />
          ))}
          {loadingMore && (
            <>
              <AnimalCardSkeleton />
              <AnimalCardSkeleton />
              <AnimalCardSkeleton />
            </>
          )}
        </div>
      )}

      <div ref={observerRef} className={styles.observer} />
    </div>
  );
};

export default CloseAnimalsFeed;
