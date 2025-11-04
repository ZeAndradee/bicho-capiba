import Link from "next/link";
import { Settings, Plus } from "lucide-react";
import styles from "./DashboardHeader.module.css";

interface DashboardHeaderProps {
  ongName: string;
}

export default function DashboardHeader({ ongName }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.titleSection}>
            <h1 className={styles.title}>{ongName}</h1>
            <p className={styles.subtitle}>
              Gerencie seus animais e acompanhe suas estatísticas
            </p>
          </div>

          <div className={styles.actions}>
            <Link href="/ong/animal/criar" className={styles.addButton}>
              <Plus size={20} />
              Adicionar Animal
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
