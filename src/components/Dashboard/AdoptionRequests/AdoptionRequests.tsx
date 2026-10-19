"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import ImageWithFallback from "@/components/UI/Images/ImageWithFallback";
import AdoptionReviewModal from "@/components/Dashboard/AdoptionReviewModal/AdoptionReviewModal";
import {
  AdoptionCounts,
  AdoptionStatus,
  OngAdoptionRequest,
  fetchOngAdoptions,
} from "@/services/Adoption/Adoption";
import { handleApiError } from "@/utils/ErrorHandler";
import { formatTimeAgo } from "@/utils/formatters";
import styles from "./AdoptionRequests.module.css";

interface AdoptionRequestsProps {
  onCountsChange?: (counts: AdoptionCounts) => void;
  onRequestUpdated?: () => void;
}

const tabs: Array<{ status: AdoptionStatus; label: string }> = [
  { status: "pendente", label: "Pendentes" },
  { status: "aprovado", label: "Aprovadas" },
  { status: "rejeitado", label: "Recusadas" },
];

const statusLabels: Record<AdoptionStatus, string> = {
  pendente: "Em análise",
  aprovado: "Aprovada",
  rejeitado: "Recusada",
};

const emptyMessages: Record<AdoptionStatus, string> = {
  pendente: "Nenhuma solicitação aguardando análise.",
  aprovado: "Nenhuma adoção aprovada ainda.",
  rejeitado: "Nenhuma solicitação recusada.",
};

export default function AdoptionRequests({
  onCountsChange,
  onRequestUpdated,
}: AdoptionRequestsProps) {
  const [activeStatus, setActiveStatus] = useState<AdoptionStatus>("pendente");
  const [requests, setRequests] = useState<OngAdoptionRequest[]>([]);
  const [counts, setCounts] = useState<AdoptionCounts>({
    pendente: 0,
    aprovado: 0,
    rejeitado: 0,
  });
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<OngAdoptionRequest | null>(null);

  const loadRequests = useCallback(
    async (status: AdoptionStatus, nextPage: number) => {
      const isFirstPage = nextPage === 1;

      if (isFirstPage) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const data = await fetchOngAdoptions(status, nextPage);
        setRequests((prev) =>
          isFirstPage ? data.requests : [...prev, ...data.requests]
        );
        setCounts(data.counts);
        setPage(data.pagination?.page ?? nextPage);
        setLastPage(data.pagination?.lastPage ?? nextPage);
        onCountsChange?.(data.counts);
      } catch (err) {
        setError(handleApiError(err).message);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [onCountsChange]
  );

  useEffect(() => {
    loadRequests(activeStatus, 1);
  }, [activeStatus, loadRequests]);

  const handleCloseModal = useCallback(() => {
    setSelectedRequest(null);
  }, []);

  const handleRequestUpdated = () => {
    setSelectedRequest(null);
    loadRequests(activeStatus, 1);
    onRequestUpdated?.();
  };

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Solicitações de Adoção</h2>
          {counts.pendente > 0 && (
            <span className={styles.pendingBadge}>
              {counts.pendente} aguardando
            </span>
          )}
        </div>
        <button
          type="button"
          className={styles.refreshButton}
          onClick={() => loadRequests(activeStatus, 1)}
          disabled={isLoading}
        >
          <RefreshCw size={16} />
          Atualizar
        </button>
      </div>

      <div className={styles.tabs} role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.status}
            type="button"
            role="tab"
            aria-selected={activeStatus === tab.status}
            className={`${styles.tab} ${
              activeStatus === tab.status ? styles.activeTab : ""
            }`}
            onClick={() => setActiveStatus(tab.status)}
          >
            {tab.label} ({counts[tab.status]})
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className={styles.state}>
          <RefreshCw className={styles.spinner} size={22} />
          Carregando solicitações...
        </div>
      ) : error ? (
        <div className={styles.state}>
          <p>{error}</p>
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => loadRequests(activeStatus, 1)}
          >
            Tentar novamente
          </button>
        </div>
      ) : requests.length === 0 ? (
        <div className={styles.state}>
          <p>{emptyMessages[activeStatus]}</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {requests.map((request) => {
            const adopter = request.usuario;
            const location = [adopter?.cidade, adopter?.estado]
              .filter(Boolean)
              .join(" - ");

            return (
              <li key={request.uuid}>
                <button
                  type="button"
                  className={styles.item}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className={styles.animalPhoto}>
                    <ImageWithFallback
                      src={request.animal.fotos?.[0]?.url || ""}
                      alt={request.animal.nome}
                      fill
                      sizes="56px"
                      className={styles.photo}
                    />
                  </div>

                  <div className={styles.info}>
                    <span className={styles.itemTitle}>
                      <strong>{adopter?.fullName || "Adotante"}</strong> quer
                      adotar <strong>{request.animal.nome}</strong>
                    </span>
                    <span className={styles.meta}>
                      {location && `${location} · `}
                      {formatTimeAgo(request.createdAt)}
                    </span>
                  </div>

                  <span
                    className={`${styles.statusBadge} ${
                      styles[request.status]
                    }`}
                  >
                    {statusLabels[request.status]}
                  </span>

                  <span className={styles.action}>
                    {request.status === "pendente" ? "Analisar" : "Ver detalhes"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {!isLoading && !error && page < lastPage && (
        <button
          type="button"
          className={styles.loadMoreButton}
          onClick={() => loadRequests(activeStatus, page + 1)}
          disabled={isLoadingMore}
        >
          {isLoadingMore ? "Carregando..." : "Carregar mais"}
        </button>
      )}

      <AdoptionReviewModal
        request={selectedRequest}
        onClose={handleCloseModal}
        onUpdated={handleRequestUpdated}
      />
    </section>
  );
}
