"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchOngAnimals, OngAnimal } from "@/services/Ong/Ong";
import DashboardHeader from "@/components/Dashboard/DashboardHeader/DashboardHeader";
import DashboardStats from "@/components/Dashboard/DashboardStats/DashboardStats";
import AnimalsGrid from "@/components/Dashboard/AnimalsGrid/AnimalsGrid";
import DonationsSection from "@/components/Dashboard/DonationsSection/DonationsSection";
import styles from "./page.module.css";

export default function Dashboard() {
  const { user, isLoading, isOng } = useAuth();
  const router = useRouter();
  const [animals, setAnimals] = useState<OngAnimal[]>([]);
  const [isLoadingAnimals, setIsLoadingAnimals] = useState(true);
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
      setAnimals(data.animals);
      setStats({
        totalAnimals: data.animals.length,
        adoptedThisMonth: data.adoptedThisMonth || 0,
        totalDonations: data.totalDonations || 0,
        activeAdoptions: data.activeAdoptions || 0,
      });
    } catch (error) {
      console.error("Error loading animals:", error);
    } finally {
      setIsLoadingAnimals(false);
    }
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
          <AnimalsGrid
            animals={animals}
            isLoading={isLoadingAnimals}
            onRefresh={loadAnimals}
          />
        </section>

        <DonationsSection />
      </main>
    </div>
  );
}
