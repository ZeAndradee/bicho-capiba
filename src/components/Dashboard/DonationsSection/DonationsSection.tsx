import { DollarSign, TrendingUp, Users, Calendar } from "lucide-react";
import styles from "./DonationsSection.module.css";

export default function DonationsSection() {
  const recentDonations = [
    {
      id: 1,
      donor: "Maria Silva",
      amount: 150,
      date: "2024-01-15",
      animal: "Luna",
    },
    {
      id: 2,
      donor: "João Santos",
      amount: 80,
      date: "2024-01-14",
      animal: "Rex",
    },
    {
      id: 3,
      donor: "Ana Costa",
      amount: 200,
      date: "2024-01-13",
      animal: "Geral",
    },
  ];

  const monthlyStats = {
    currentMonth: 1250,
    lastMonth: 980,
    growth: 27.6,
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Doações</h2>
        <span className={styles.badge}>Em breve</span>
      </div>

      <div className={styles.content}>
        <div className={styles.statsCard}>
          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <DollarSign size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                R$ {monthlyStats.currentMonth.toLocaleString()}
              </span>
              <span className={styles.statLabel}>Este mês</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <TrendingUp size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>+{monthlyStats.growth}%</span>
              <span className={styles.statLabel}>Crescimento</span>
            </div>
          </div>

          <div className={styles.statItem}>
            <div className={styles.statIcon}>
              <Users size={20} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{recentDonations.length}</span>
              <span className={styles.statLabel}>Doadores únicos</span>
            </div>
          </div>
        </div>

        <div className={styles.donationsCard}>
          <h3 className={styles.donationsTitle}>Doações Recentes</h3>
          <div className={styles.donationsList}>
            {recentDonations.map((donation) => (
              <div key={donation.id} className={styles.donationItem}>
                <div className={styles.donationInfo}>
                  <span className={styles.donorName}>{donation.donor}</span>
                  <span className={styles.donationTarget}>
                    {donation.animal === "Geral"
                      ? "Doação geral"
                      : `Para ${donation.animal}`}
                  </span>
                </div>
                <div className={styles.donationDetails}>
                  <span className={styles.donationAmount}>
                    R$ {donation.amount}
                  </span>
                  <span className={styles.donationDate}>
                    <Calendar size={12} />
                    {new Date(donation.date).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
