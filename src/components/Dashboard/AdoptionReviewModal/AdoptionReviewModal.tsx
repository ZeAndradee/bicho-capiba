"use client";

import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import {
  FaEnvelope,
  FaPhone,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import ImageWithFallback from "@/components/UI/Images/ImageWithFallback";
import Error from "@/components/UI/Error/Error";
import {
  Adopter,
  OngAdoptionRequest,
  updateAdoptionStatus,
} from "@/services/Adoption/Adoption";
import { handleApiError, ErrorState } from "@/utils/ErrorHandler";
import { formatAge, formatDate } from "@/utils/formatters";
import styles from "./AdoptionReviewModal.module.css";

interface AdoptionReviewModalProps {
  request: OngAdoptionRequest | null;
  onClose: () => void;
  onUpdated: (updated: OngAdoptionRequest) => void;
}

type Mode = "view" | "approve" | "reject";

type InfoValue = string | number | null | undefined;

const residenceLabels: Record<string, string> = {
  casa: "Casa",
  apartamento: "Apartamento",
  chacara: "Chácara",
  sitio: "Sítio",
};

const petSexLabels: Record<string, string> = {
  machos: "Machos",
  femeas: "Fêmeas",
  ambos: "Ambos",
};

const childrenAgeLabels: Record<string, string> = {
  "0-2": "0-2 anos",
  "3-5": "3-5 anos",
  "6-10": "6-10 anos",
  "11-15": "11-15 anos",
  "16+": "16+ anos",
  variadas: "Idades variadas",
};

const availableTimeLabels: Record<string, string> = {
  "poucas-horas": "Poucas horas por dia",
  "meio-periodo": "Meio período",
  "periodo-integral": "Período integral",
  "fins-de-semana": "Apenas fins de semana",
};

const statusLabels: Record<OngAdoptionRequest["status"], string> = {
  pendente: "Em análise",
  aprovado: "Aprovada",
  rejeitado: "Recusada",
};

const yesNo = (value: boolean | number | null | undefined) => {
  if (value === null || value === undefined) return null;
  return value ? "Sim" : "Não";
};

const labelOf = (labels: Record<string, string>, value: string | null) => {
  if (!value) return null;
  return labels[value] || value;
};

const whatsappLink = (phone: string | null) => {
  const digits = phone?.replace(/\D/g, "") || "";
  if (digits.length < 10 || digits.length > 11) return null;
  return `https://wa.me/55${digits}`;
};

function InfoList({ items }: { items: Array<[string, InfoValue]> }) {
  const visibleItems = items.filter(
    ([, value]) => value !== null && value !== undefined && value !== ""
  );

  if (visibleItems.length === 0) {
    return <p className={styles.emptyInfo}>Não informado</p>;
  }

  return (
    <dl className={styles.infoList}>
      {visibleItems.map(([label, value]) => (
        <div key={label} className={styles.infoItem}>
          <dt>{label}</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

function AdopterDetails({ adopter }: { adopter: Adopter }) {
  const location = [adopter.bairro, adopter.cidade, adopter.estado]
    .filter(Boolean)
    .join(", ");
  const whatsapp = whatsappLink(adopter.telefone);

  return (
    <>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Contato</h3>
        <div className={styles.contactList}>
          <a href={`mailto:${adopter.email}`} className={styles.contactItem}>
            <FaEnvelope className={styles.contactIcon} />
            {adopter.email}
          </a>
          {adopter.telefone && (
            <a href={`tel:${adopter.telefone}`} className={styles.contactItem}>
              <FaPhone className={styles.contactIcon} />
              {adopter.telefone}
            </a>
          )}
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactItem}
            >
              <FaWhatsapp className={styles.contactIcon} />
              Conversar no WhatsApp
            </a>
          )}
          {location && (
            <span className={styles.contactItem}>
              <FaMapMarkerAlt className={styles.contactIcon} />
              {location}
            </span>
          )}
        </div>
        <InfoList
          items={[
            [
              "Idade",
              adopter.dataNascimento ? formatAge(adopter.dataNascimento) : null,
            ],
          ]}
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Moradia</h3>
        <InfoList
          items={[
            ["Tipo de residência", labelOf(residenceLabels, adopter.tipoResidencia)],
            ["Área externa", yesNo(adopter.areaExterna)],
            ["Tela de proteção", yesNo(adopter.telaProtetora)],
            ["Moradores", adopter.quantidadeMoradores],
          ]}
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Família</h3>
        <InfoList
          items={[
            ["Composição familiar", adopter.composicaoFamiliar],
            ["Possui crianças", yesNo(adopter.possuiCriancas)],
            ["Quantidade de crianças", adopter.quantidadeCriancas],
            [
              "Faixa etária das crianças",
              labelOf(childrenAgeLabels, adopter.faixaEtariaCriancas),
            ],
            [
              "Criança com necessidade especial",
              yesNo(adopter.criancaNecessidadeEspecial),
            ],
            ["Necessidade da criança", adopter.tipoNecessidadeCriancas],
            [
              "Familiar com necessidade especial",
              yesNo(adopter.familiarNecessidadeEspecial),
            ],
            ["Necessidade do familiar", adopter.tipoNecessidadeEspecialFamiliar],
          ]}
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Outros animais</h3>
        <InfoList
          items={[
            ["Possui animais", yesNo(adopter.possuiAnimais)],
            ["Quantidade", adopter.quantidadeAnimais],
            ["Idade dos animais", adopter.idadeAnimais],
            ["Sexo dos animais", labelOf(petSexLabels, adopter.sexoAnimais)],
          ]}
        />
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Experiência e rotina</h3>
        <InfoList
          items={[
            ["Já teve animais", yesNo(adopter.experienciaComAnimais)],
            ["Comportamento dos animais", adopter.comportamentoAnimais],
            [
              "Conhece as despesas de um animal",
              yesNo(adopter.conhecimentoDespesasAnimais),
            ],
            [
              "Tempo disponível",
              labelOf(availableTimeLabels, adopter.tempoDisponivel),
            ],
          ]}
        />
      </section>
    </>
  );
}

export default function AdoptionReviewModal({
  request,
  onClose,
  onUpdated,
}: AdoptionReviewModalProps) {
  const [mode, setMode] = useState<Mode>("view");
  const [motivo, setMotivo] = useState("");
  const [motivoError, setMotivoError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);

  useEffect(() => {
    setMode("view");
    setMotivo("");
    setMotivoError(null);
    setError(null);
  }, [request]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose();
      }
    };

    if (request) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [request, isSubmitting, onClose]);

  if (!request) return null;

  const adopterName = request.usuario?.fullName || "Adotante";
  const isPending = request.status === "pendente";

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isSubmitting) {
      onClose();
    }
  };

  const submit = async (status: "aprovado" | "rejeitado") => {
    const trimmedMotivo = motivo.trim();

    if (status === "rejeitado" && !trimmedMotivo) {
      setMotivoError("Informe o motivo para o adotante entender a decisão.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updated = await updateAdoptionStatus(request.uuid, {
        status,
        motivo: trimmedMotivo || undefined,
      });
      onUpdated(updated);
    } catch (err) {
      setError(
        handleApiError(err, {
          403: "Você não tem permissão para responder esta solicitação.",
          404: "Solicitação não encontrada.",
          409: "Esta solicitação já foi respondida ou o animal já foi adotado.",
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="adoption-review-title"
      >
        <div className={styles.header}>
          <div className={styles.headerInfo}>
            <div className={styles.animalPhoto}>
              <ImageWithFallback
                src={request.animal.fotos?.[0]?.url || ""}
                alt={request.animal.nome}
                fill
                sizes="56px"
                className={styles.photo}
              />
            </div>
            <div>
              <h2 id="adoption-review-title" className={styles.title}>
                {adopterName} quer adotar {request.animal.nome}
              </h2>
              <span className={styles.subtitle}>
                Solicitado em {formatDate(request.createdAt)}
              </span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
            aria-label="Fechar"
            disabled={isSubmitting}
          >
            <IoClose />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.statusRow}>
            <span className={`${styles.statusBadge} ${styles[request.status]}`}>
              {statusLabels[request.status]}
            </span>
            {!isPending && (
              <span className={styles.subtitle}>
                Respondida em {formatDate(request.updatedAt)}
              </span>
            )}
          </div>

          {request.status === "rejeitado" && request.motivo && (
            <div className={styles.reasonBox}>
              <strong>Motivo informado:</strong> {request.motivo}
            </div>
          )}

          {request.usuario ? (
            <AdopterDetails adopter={request.usuario} />
          ) : (
            <p className={styles.emptyInfo}>
              Os dados deste adotante não estão mais disponíveis.
            </p>
          )}
        </div>

        {isPending && (
          <div className={styles.footer}>
            <Error error={error} />

            {mode === "view" && (
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.rejectButton}
                  onClick={() => setMode("reject")}
                >
                  <FaTimes />
                  Recusar
                </button>
                <button
                  type="button"
                  className={styles.approveButton}
                  onClick={() => setMode("approve")}
                >
                  <FaCheck />
                  Aprovar
                </button>
              </div>
            )}

            {mode === "approve" && (
              <div className={styles.confirmBox}>
                <p>
                  Ao aprovar, {request.animal.nome} será marcado como adotado e
                  as outras solicitações pendentes para ele serão recusadas
                  automaticamente.
                </p>
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setMode("view")}
                    disabled={isSubmitting}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    className={styles.approveButton}
                    onClick={() => submit("aprovado")}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Aprovando..." : "Confirmar aprovação"}
                  </button>
                </div>
              </div>
            )}

            {mode === "reject" && (
              <div className={styles.confirmBox}>
                <label htmlFor="adoption-reject-reason" className={styles.label}>
                  Motivo da recusa
                </label>
                <textarea
                  id="adoption-reject-reason"
                  className={styles.textarea}
                  value={motivo}
                  maxLength={1000}
                  rows={4}
                  placeholder="Explique de forma gentil por que a adoção não foi aprovada. O adotante verá esta mensagem."
                  onChange={(e) => {
                    setMotivo(e.target.value);
                    setMotivoError(null);
                  }}
                />
                {motivoError && (
                  <span className={styles.fieldError}>{motivoError}</span>
                )}
                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => setMode("view")}
                    disabled={isSubmitting}
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    className={styles.rejectConfirmButton}
                    onClick={() => submit("rejeitado")}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Enviando..." : "Confirmar recusa"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
