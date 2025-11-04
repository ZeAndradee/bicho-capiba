import { useState } from "react";
import { Edit, Trash2, RefreshCw, Eye } from "lucide-react";
import Link from "next/link";
import ImageWithFallback from "@/components/UI/Images/ImageWithFallback";
import { OngAnimal } from "@/services/Ong/Ong";
import styles from "./AnimalsGrid.module.css";

interface AnimalsGridProps {
  animals: OngAnimal[];
  isLoading: boolean;
  onRefresh: () => void;
}

export default function AnimalsGrid({
  animals,
  isLoading,
  onRefresh,
}: AnimalsGridProps) {
  const [filter, setFilter] = useState<string>("todos");

  const filteredAnimals = animals.filter((animal) => {
    if (filter === "todos") return true;
    return animal.status.toLowerCase() === filter.toLowerCase();
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "available";
      case "Em andamento":
        return "process";
      case "Adotado":
        return "adopted";
      default:
        return "available";
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <RefreshCw className={styles.spinner} size={24} />
        Carregando animais...
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
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
              filter === "disponível" ? styles.active : ""
            }`}
            onClick={() => setFilter("disponível")}
          >
            Disponíveis (
            {animals.filter((a) => a.status === "Disponível").length})
          </button>
          <button
            className={`${styles.filterButton} ${
              filter === "Em andamento" ? styles.active : ""
            }`}
            onClick={() => setFilter("Em andamento")}
          >
            Em andamento (
            {animals.filter((a) => a.status === "Em andamento").length})
          </button>
          <button
            className={`${styles.filterButton} ${
              filter === "adotado" ? styles.active : ""
            }`}
            onClick={() => setFilter("adotado")}
          >
            Adotados ({animals.filter((a) => a.status === "Adotado").length})
          </button>
        </div>

        <button className={styles.refreshButton} onClick={onRefresh}>
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      {filteredAnimals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Nenhum animal encontrado nesta categoria.</p>
          <Link href="/ong/animal/criar" className={styles.addButton}>
            Adicionar primeiro animal
          </Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredAnimals.map((animal) => (
            <div key={animal.id} className={styles.card}>
              <div className={styles.imageContainer}>
                <ImageWithFallback
                  src={animal.images?.[0]?.url || ""}
                  alt={animal.nome}
                  className={styles.image}
                  fill
                  sizes="(max-width: 300px)"
                />
                <div
                  className={`${styles.status} ${
                    styles[getStatusColor(animal.status)]
                  }`}
                >
                  {animal.status}
                </div>
              </div>

              <div className={styles.content}>
                <h3 className={styles.name}>{animal.nome}</h3>
                <div className={styles.details}>
                  <span>{animal.sexo === "M" ? "Macho" : "Fêmea"}</span>
                  <span>•</span>
                  <span>{animal.idade} anos</span>
                  <span>•</span>
                  <span>{animal.raca}</span>
                </div>

                <div className={styles.actions}>
                  <Link
                    href={`/adote/${animal.id}`}
                    className={styles.viewButton}
                    title="Ver perfil público"
                  >
                    <Eye size={16} />
                  </Link>
                  <Link
                    href={`/ong/dashboard/animal/${animal.id}/editar`}
                    className={styles.editButton}
                    title="Editar animal"
                  >
                    <Edit size={16} />
                  </Link>
                  <button
                    className={styles.deleteButton}
                    title="Remover animal"
                    onClick={() => {
                      if (
                        confirm(
                          `Tem certeza que deseja remover ${animal.nome}?`
                        )
                      ) {
                        console.log("Delete animal:", animal.id);
                      }
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
