import { Heart, PawPrint, DollarSign, Clock } from "lucide-react";
import styles from "./DashboardStats.module.css";

interface Stats {
  totalAnimals: number;
  adoptedAnimals: number;
  totalDonations: number;
  activeAdoptions: number;
}

interface DashboardStatsProps {
  stats: Stats;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const statCards = [
    {
      title: "Total de Animais",
      value: stats.totalAnimals,
      icon: PawPrint,
      color: "orange",
    },
    {
      title: "Animais Adotados",
      value: stats.adoptedAnimals,
      icon: Heart,
      color: "green",
    },
    {
      title: "Solicitações Pendentes",
      value: stats.activeAdoptions,
      icon: Clock,
      color: "yellow",
    },
    {
      title: "Total em Doações",
      value: `R$ ${stats.totalDonations.toLocaleString()}`,
      icon: DollarSign,
      color: "green",
    },
  ];

  return (
    <section className={styles.statsContainer}>
      <h2 className={styles.title}>Estatísticas</h2>
      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} className={`${styles.statCard} ${styles[stat.color]}`}>
            <div className={styles.statIcon}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statValue}>{stat.value}</h3>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}