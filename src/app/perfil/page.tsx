"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaClipboardList,
  FaDollarSign,
  FaHeart as FaHeartRegular,
  FaFileContract,
  FaHandsHelping,
  FaCalendar,
} from "react-icons/fa";
import { LuBuilding } from "react-icons/lu";
import ImageWithFallback from "@/components/UI/Images/ImageWithFallback";
import Link from "next/link";
import {
  fetchUserFavorites,
  fetchUserAdoptions,
  fetchUserDonations,
  FavoriteAnimal,
  AdoptionProcess,
  UserDonation,
} from "@/services/User/User";
import { unlikeAnimal, likeAnimal } from "@/services/Animals/Animal";
import AdoptionStatusModal from "./AdoptionStatusModal/AdoptionStatusModal";
import styles from "./page.module.css";

export default function UserProfile() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [favoriteAnimals, setFavoriteAnimals] = useState<FavoriteAnimal[]>([]);
  const [adoptionProcesses, setAdoptionProcesses] = useState<AdoptionProcess[]>(
    []
  );
  const [donations, setDonations] = useState<UserDonation[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isLoadingAdoptions, setIsLoadingAdoptions] = useState(true);
  const [isLoadingDonations, setIsLoadingDonations] = useState(true);
  const [selectedAdoption, setSelectedAdoption] =
    useState<AdoptionProcess | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user, isLoading, router]);

  const loadUserData = async () => {
    setIsLoadingFavorites(true);
    setIsLoadingAdoptions(true);
    setIsLoadingDonations(true);

    const loadFavorites = async () => {
      try {
        const favorites = await fetchUserFavorites();
        setFavoriteAnimals(favorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavoriteAnimals([]);
      } finally {
        setIsLoadingFavorites(false);
      }
    };

    const loadAdoptions = async () => {
      try {
        const adoptions = await fetchUserAdoptions();
        const sortedAdoptions = adoptions.sort((a, b) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        setAdoptionProcesses(sortedAdoptions);
      } catch (error) {
        console.error("Error loading adoptions:", error);
        setAdoptionProcesses([]);
      } finally {
        setIsLoadingAdoptions(false);
      }
    };

    const loadDonations = async () => {
      try {
        const userDonations = await fetchUserDonations();
        setDonations(userDonations);
      } catch (error) {
        console.error("Error loading donations:", error);
        setDonations([]);
      } finally {
        setIsLoadingDonations(false);
      }
    };

    await Promise.allSettled([
      loadFavorites(),
      loadAdoptions(),
      loadDonations(),
    ]);
  };

  const handleFavoriteClick = async (animalId: string) => {
    try {
      await unlikeAnimal(animalId);
      setFavoriteAnimals((prev) =>
        prev.filter((animal) => animal.uuid !== animalId)
      );
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  };

  const handleViewAdoptionDetails = (adoptionProcess: AdoptionProcess) => {
    setSelectedAdoption(adoptionProcess);
    setIsStatusModalOpen(true);
  };

  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setSelectedAdoption(null);
  };

  const getAdoptionStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "var(--yellow-capiba)";
      case "aprovado":
        return "var(--green-capiba)";
      case "rejeitado":
        return "var(--orange-capiba)";
      default:
        return "var(--text-color)";
    }
  };

  const getAdoptionStatusText = (status: string) => {
    switch (status) {
      case "pendente":
        return "Aguardando";
      case "aprovado":
        return "Aprovado";
      case "rejeitado":
        return "Rejeitado";
      default:
        return "Desconhecido";
    }
  };

  const getDonationStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "var(--yellow-capiba)";
      case "completed":
        return "var(--green-capiba)";
      case "failed":
        return "var(--orange-capiba)";
      default:
        return "var(--text-color)";
    }
  };

  const getDonationStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Processando";
      case "completed":
        return "Concluída";
      case "failed":
        return "Falhou";
      default:
        return "Desconhecido";
    }
  };

  const getDonationHeaderBackgroundColor = (status: string) => {
    switch (status) {
      case "pending":
        return "rgba(249, 202, 36, 0.15)";
      case "completed":
        return "rgba(63, 125, 88, 0.15)";
      case "failed":
        return "rgba(243, 123, 88, 0.15)";
      default:
        return "rgba(63, 125, 88, 0.15)";
    }
  };

  const getDonationHeaderTextColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#b8860b";
      case "completed":
        return "#2a6b3e";
      case "failed":
        return "#c04a2c";
      default:
        return "#2a6b3e";
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.profile}>
      <header className={styles.header}>
        <h1 className={styles.greeting}>Olá, {user.fullName || user.nome}</h1>
      </header>

      <main className={styles.main}>
        <div className={styles.sectionsRow}>
          <section className={styles.sectionLarge}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleContainer}>
                <div className={styles.sectionIconWrapper}>
                  <FaClipboardList className={styles.sectionIcon} />
                </div>
                <div>
                  <h2 className={styles.sectionTitle}>Processos de Adoção</h2>
                  <p className={styles.sectionDescription}>
                    Acompanhe suas solicitações de adoção
                  </p>
                </div>
              </div>
              <div className={styles.sectionMeta}>
                <span className={styles.sectionCount}>
                  {adoptionProcesses.length}{" "}
                  {adoptionProcesses.length === 1 ? "processo" : "processos"}
                </span>
              </div>
            </div>

            {isLoadingAdoptions ? (
              <div className={styles.loading}>Carregando processos...</div>
            ) : adoptionProcesses.length > 0 ? (
              <div className={styles.adoptionList}>
                {adoptionProcesses.map((process) => (
                  <div key={process.uuid} className={styles.adoptionRow}>
                    <div className={styles.adoptionImageContainer}>
                      <ImageWithFallback
                        src={
                          process.animal.fotos?.[0]?.url ||
                          "/images/placeholder-animal.jpg"
                        }
                        alt={process.animal.nome}
                        width={80}
                        height={80}
                        className={styles.adoptionImage}
                      />
                    </div>
                    <div className={styles.adoptionContent}>
                      <div className={styles.adoptionHeader}>
                        <div className={styles.adoptionNameRow}>
                          <h3 className={styles.adoptionAnimalName}>
                            {process.animal.nome}
                          </h3>
                          <div
                            className={styles.adoptionStatusTag}
                            style={{
                              backgroundColor: `${getAdoptionStatusColor(
                                process.status
                              )}20`,
                              borderColor: getAdoptionStatusColor(
                                process.status
                              ),
                              color: getAdoptionStatusColor(process.status),
                            }}
                          >
                            {getAdoptionStatusText(process.status)}
                          </div>
                        </div>
                        <p className={styles.adoptionOngName}>
                          <LuBuilding className={styles.locationIcon} />
                          {process.animal.ong.nome}
                        </p>
                      </div>
                      <div className={styles.adoptionDates}>
                        <span className={styles.adoptionDate}>
                          Iniciado:{" "}
                          {new Date(process.createdAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </span>
                      </div>
                    </div>
                    <div className={styles.adoptionActions}>
                      <button
                        className={styles.processButton}
                        onClick={() => handleViewAdoptionDetails(process)}
                      >
                        Ver detalhes
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaFileContract />
                </div>
                <h3 className={styles.emptyTitle}>
                  Nenhum processo de adoção ainda
                </h3>
                <p className={styles.emptyDescription}>
                  Quando você escolher um novo amigo ele vai aparecer aqui.
                </p>
                <Link href="/adote" className={styles.emptyAction}>
                  Encontrar meu pet
                </Link>
              </div>
            )}
          </section>

          <section className={styles.sectionSmall}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleContainer}>
                <div>
                  <h2 className={styles.sectionTitle}>Seus Favoritos</h2>
                  <p className={styles.sectionDescription}>
                    Seus animais preferidos estão aqui
                  </p>
                </div>
              </div>
            </div>

            {isLoadingFavorites ? (
              <div className={styles.loading}>Carregando favoritos...</div>
            ) : favoriteAnimals.length > 0 ? (
              <div className={styles.favoritesList}>
                {favoriteAnimals.map((animal) => (
                  <div key={animal.uuid} className={styles.favoriteRow}>
                    <div className={styles.favoriteImage}>
                      <ImageWithFallback
                        src={
                          animal.fotos?.[0]?.url ||
                          "/images/placeholder-animal.jpg"
                        }
                        alt={animal.nome}
                        width={48}
                        height={48}
                        className={styles.favoriteImg}
                      />
                    </div>
                    <div className={styles.favoriteInfo}>
                      <h4 className={styles.favoriteName}>{animal.nome}</h4>
                      <p className={styles.favoriteDetails}>
                        {animal.especie.nome} • {animal.raca.nome}
                      </p>
                    </div>
                    <button
                      className={styles.favoriteButton}
                      onClick={() => handleFavoriteClick(animal.uuid)}
                    >
                      <FaHeart />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <FaHeartRegular />
                </div>
                <h3 className={styles.emptyTitle}>
                  Nenhum animal favoritado ainda
                </h3>
                <p className={styles.emptyDescription}>
                  Quando você encontrar um amigo especial, clique no coração
                  para salvá-lo aqui.
                </p>
                <Link href="/adote" className={styles.emptyAction}>
                  Explorar animais
                </Link>
              </div>
            )}
          </section>
        </div>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleContainer}>
              <div className={styles.sectionIconWrapper}>
                <FaDollarSign className={styles.sectionIcon} />
              </div>
              <div>
                <h2 className={styles.sectionTitle}>Suas Contribuições</h2>
                <p className={styles.sectionDescription}>
                  Obrigado por ajudar a salvar vidas
                </p>
              </div>
            </div>
            <div className={styles.sectionMeta}>
              <span className={styles.sectionCount}>
                {donations.length}{" "}
                {donations.length === 1 ? "doação" : "doações"}
              </span>
              {donations.length > 0 && (
                <div className={styles.totalDonated}>
                  Você já doou: R${" "}
                  {donations.reduce((sum, d) => sum + d.valor, 0).toFixed(2)}
                </div>
              )}
            </div>
          </div>

          {isLoadingDonations ? (
            <div className={styles.loading}>Carregando doações...</div>
          ) : donations.length > 0 ? (
            <div className={styles.donationGrid}>
              {donations.map((donation) => (
                <div key={donation.id} className={styles.donationCard}>
                  <div
                    className={styles.donationHeader}
                    style={{
                      backgroundColor: getDonationHeaderBackgroundColor(
                        donation.status
                      ),
                    }}
                  >
                    <div
                      className={styles.donationAmount}
                      style={{
                        color: getDonationHeaderTextColor(donation.status),
                      }}
                    >
                      R$ {donation.valor.toFixed(2)}
                    </div>
                    <div
                      className={styles.donationStatus}
                      style={{
                        borderColor: getDonationStatusColor(donation.status),
                        color: getDonationStatusColor(donation.status),
                      }}
                    >
                      {getDonationStatusText(donation.status)}
                    </div>
                  </div>
                  <div className={styles.donationContent}>
                    <h3 className={styles.donationOngName}>
                      <LuBuilding className={styles.locationIcon} />
                      {donation.ongNome}
                    </h3>
                    <div className={styles.donationDate}>
                      <FaCalendar className={styles.dateIcon} />
                      {new Date(donation.data).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </div>
                    {donation.mensagem && (
                      <div className={styles.donationMessage}>
                        <span className={styles.messageLabel}>Seu recado:</span>
                        <p className={styles.messageText}>
                          {donation.mensagem}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <FaHandsHelping />
              </div>
              <h3 className={styles.emptyTitle}>
                Nenhuma doação realizada ainda
              </h3>
              <p className={styles.emptyDescription}>
                Cada contribuição faz a diferença na vida de um animal
                necessitado.
              </p>
              <Link href="/adote" className={styles.emptyAction}>
                Apoiar uma ONG
              </Link>
            </div>
          )}
        </section>
      </main>

      {selectedAdoption && (
        <AdoptionStatusModal
          isOpen={isStatusModalOpen}
          onClose={handleCloseStatusModal}
          adoptionProcess={selectedAdoption}
        />
      )}
    </div>
  );
}
