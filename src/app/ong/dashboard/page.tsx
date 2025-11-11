"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchOngAnimals, OngAnimal } from "@/services/Ong/Ong";
import DashboardHeader from "@/components/Dashboard/DashboardHeader/DashboardHeader";
import DashboardStats from "@/components/Dashboard/DashboardStats/DashboardStats";
import AnimalCard from "@/components/UI/AnimalsCard/AnimalCard";
import DonationsSection from "@/components/Dashboard/DonationsSection/DonationsSection";
import { RefreshCw } from "lucide-react";
import styles from "./page.module.css";

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const [animals, setAnimals] = useState<OngAnimal[]>([]);
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(true);
  const [filter, setFilter] = useState<string>("todos");
  const [stats, setStats] = useState({
    totalAnimals: 0,
    adoptedThisMonth: 0,
    totalDonations: 0,
    activeAdoptions: 0,
  });

  useEffect(() => {
    if (user) {
      loadAnimals();
    }
  }, [user]);

  const loadAnimals = async () => {
    try {
      setIsLoadingAnimals(true);
      const data = await fetchOngAnimals();
      const animals = data.result || [];
      setAnimals(animals);
      setStats({
        totalAnimals: animals.length,
        adoptedThisMonth: animals.filter(a => a.statusAnimal === "Adotado").length,
        totalDonations: 0,
        activeAdoptions: animals.filter(a => a.statusAnimal === "Pendente").length,
      });
    } catch (error) {
      console.error("Error loading animals:", error);
    } finally {
      setIsLoadingAnimals(false);
    }
  };

  const filteredAnimals = animals.filter((animal) => {
    if (filter === "todos") return true;
    return animal.statusAnimal.toLowerCase() === filter.toLowerCase();
  });

  const calculateAge = (dataNascimento: string) => {
    const age = new Date().getFullYear() - new Date(dataNascimento).getFullYear();
    return `${age} anos`;
  };

  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.dashboard}>
      <DashboardHeader ongName={user.nome || ''} />

      <main className={styles.main}>
        <DashboardStats stats={stats} />

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Meus Animais</h2>
            <Link href="/ong/animal/criar" className={styles.addAnimalButton}>
              <Plus size={20} />
              Adicionar Animal
            </Link>
          </div>

          <div className={styles.animalsContainer}>
            <div className={styles.filters}>
              <button
                className={`${styles.filterButton} ${
                  filter === "todos" ? styles.active : ""
                }`}
                onClick={() => setFilter("todos")}
              >
                Todos ({animals.length})
              </button>
              <button
                className={`${styles.filterButton} ${
                  filter === "disponivel" ? styles.active : ""
                }`}
                onClick={() => setFilter("disponivel")}
              >
                Disponíveis (
                {animals.filter((a) => a.statusAnimal === "Disponivel").length})
              </button>
              <button
                className={`${styles.filterButton} ${
                  filter === "pendente" ? styles.active : ""
                }`}
                onClick={() => setFilter("pendente")}
              >
                Pendentes (
                {animals.filter((a) => a.statusAnimal === "Pendente").length})
              </button>
              <button
                className={`${styles.filterButton} ${
                  filter === "adotado" ? styles.active : ""
                }`}
                onClick={() => setFilter("adotado")}
              >
                Adotados ({animals.filter((a) => a.statusAnimal === "Adotado").length})
              </button>
            </div>

            {isLoadingAnimals ? (
              <div className={styles.loading}>
                <RefreshCw className={styles.spinner} size={24} />
                Carregando animais...
              </div>
            ) : filteredAnimals.length === 0 ? (
              <div className={styles.emptyState}>
                <p>Nenhum animal encontrado nesta categoria.</p>
                <Link href="/ong/animal/criar" className={styles.addButton}>
                  Adicionar primeiro animal
                </Link>
              </div>
            ) : (
              <div className={styles.animalsGrid}>
                {filteredAnimals.map((animal) => (
                  <AnimalCard
                    key={animal.uuid}
                    id={animal.uuid}
                    nome={animal.nome}
                    image={animal.fotos?.[0]?.url || null}
                    sexo={animal.sexo}
                    idade={calculateAge(animal.dataNascimento)}
                    raca={{ id: 1, nome: animal.porte, especieId: 1 }}
                    distancia="0 km"
                    bairroOng={user?.nome || ""}
                    cidadeOng=""
                    isFavorite={animal.isLiked}
                    isPreview={true}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <DonationsSection />
      </main>
    </div>
  );
}
