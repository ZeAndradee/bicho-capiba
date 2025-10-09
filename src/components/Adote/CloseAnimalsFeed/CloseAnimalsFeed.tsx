"use client";

import React, { useState } from "react";
import AnimalCard from "@/components/UI/AnimalsCard/AnimalCard";
import Filter, { FilterOption } from "@/components/UI/Filter/Filter";
import { mockAnimals } from "@/data/MockAnimals";
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
  age: string;
  gender: string;
  distance: string;
  species: string;
}

const ageOptions: FilterOption[] = [
  { value: "meses", label: "Filhotes (meses)", icon: <LiaBirthdayCakeSolid /> },
  { value: "1 ano", label: "1 ano" },
  { value: "2 anos", label: "2 anos" },
  { value: "3 anos", label: "3 anos" },
  { value: "4 anos", label: "4+ anos" },
];

const genderOptions: FilterOption[] = [
  { value: "male", label: "Macho", icon: <FaMars /> },
  { value: "female", label: "Fêmea", icon: <FaVenus /> },
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>({
    age: "",
    gender: "",
    distance: "",
    species: "",
  });

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
      age: "",
      gender: "",
      distance: "",
      species: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (filter) => filter !== ""
  );

  const filteredAnimals = mockAnimals.filter((animal) => {
    if (filters.age && !animal.age.includes(filters.age)) return false;
    if (filters.gender && animal.gender !== filters.gender) return false;
    if (filters.distance && !animal.distance.includes(filters.distance))
      return false;
    if (filters.species && animal.species !== filters.species) return false;
    return true;
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Conheça os animais perto de você</h1>

        <div className={styles.filters}>
          <Filter
            value={filters.age}
            onChange={(value) => handleFilterChange("age", value)}
            options={ageOptions}
            placeholder="Todas as idades"
          />

          <Filter
            value={filters.gender}
            onChange={(value) => handleFilterChange("gender", value)}
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
            value={filters.species}
            onChange={(value) => handleFilterChange("species", value)}
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
              key={animal.id}
              id={animal.id}
              name={animal.name}
              image={animal.image}
              gender={animal.gender}
              age={animal.age}
              breed={animal.breed}
              distance={animal.distance}
              neighborhood={animal.neighborhood}
              city={animal.city}
              isFavorite={favorites.includes(animal.id)}
              onFavoriteClick={handleFavoriteClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CloseAnimalsFeed;
