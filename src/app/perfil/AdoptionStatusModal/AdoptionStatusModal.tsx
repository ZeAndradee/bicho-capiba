"use client";

import { useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { FaClock, FaCheck, FaTimes, FaEnvelope, FaPhone } from "react-icons/fa";
import { AdoptionProcess } from "@/services/User/User";
import styles from "./AdoptionStatusModal.module.css";

interface AdoptionStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  adoptionProcess: AdoptionProcess;
}

export default function AdoptionStatusModal({
  isOpen,
  onClose,
  adoptionProcess,
}: AdoptionStatusModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "pendente":
        return "Em Análise";
      case "aprovado":
        return "Aprovado";
      case "rejeitado":
        return "Não Aprovado";
      default:
        return "Status Desconhecido";
    }
  };


  const getNextStepsContent = (status: string) => {
    const getStatusClass = () => {
      switch (status) {
        case "pendente":
          return styles.statusYellow;
        case "aprovado":
          return styles.statusGreen;
        case "rejeitado":
          return styles.statusOrange;
        default:
          return "";
      }
    };

    const statusClass = getStatusClass();

    switch (status) {
      case "pendente":
        return (
          <div className={`${styles.nextStepsContent} ${statusClass}`}>
            <h4 className={styles.nextStepsTitle}>Próximos Passos:</h4>
            <ul className={styles.nextStepsList}>
              <li>A ONG está analisando sua solicitação de adoção</li>
              <li>
                Verifique o seu email durante o prazo para acompanhar o status
              </li>
              <li>Mantenha seus dados de contato atualizados</li>
            </ul>
            <div className={styles.estimatedTime}>
              <FaClock className={styles.estimatedTimeIcon} />
              <span>
                <strong>Tempo estimado:</strong> 3 a 7 dias úteis
              </span>
            </div>
          </div>
        );
      case "aprovado":
        return (
          <div className={`${styles.nextStepsContent} ${statusClass}`}>
            <h4 className={styles.nextStepsTitle}>Próximos Passos:</h4>
            <ul className={styles.nextStepsList}>
              <li>Prepare os documentos solicitados pela ONG</li>
              <li>Aguarde o contato para agendar uma visita</li>
              <li>Prepare sua casa para receber o novo amigo</li>
              <li>
                Tenha em mãos os itens básicos (ração, bebedouro, caminha)
              </li>
            </ul>
          </div>
        );
      case "rejeitado":
        return (
          <div className={`${styles.nextStepsContent} ${statusClass}`}>
            <h4 className={styles.nextStepsTitle}>O que fazer agora:</h4>
            <ul className={styles.nextStepsList}>
              <li>
                Não desista! Existem muitos outros animais esperando por um lar
              </li>
              <li>Considere entrar em contato com outras ONGs</li>
              <li>Revise os critérios de adoção e tente novamente no futuro</li>
              <li>Continue acompanhando os animais disponíveis</li>
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  const renderProcessSteps = () => {
    const status = adoptionProcess.status;

    const getStatusTheme = () => {
      switch (status) {
        case "aprovado":
          return {
            completedClass: styles.stepGreen,
            currentClass: styles.stepGreen,
            connectorClass: styles.stepConnectorGreen,
          };
        case "rejeitado":
          return {
            completedClass: styles.stepOrange,
            currentClass: styles.stepOrange,
            connectorClass: styles.stepConnectorOrange,
          };
        case "pendente":
        default:
          return {
            completedClass: styles.stepYellow,
            currentClass: styles.stepYellow,
            connectorClass: styles.stepConnectorYellow,
          };
      }
    };

    const theme = getStatusTheme();

    if (status === "rejeitado") {
      return (
        <div className={styles.processContainer}>
          <div className={styles.processStep}>
            <div className={`${styles.stepIcon} ${theme.completedClass}`}>
              <FaCheck />
            </div>
            <span className={styles.stepText}>Solicitação Enviada</span>
            <div
              className={`${styles.connectionLine} ${theme.connectorClass}`}
            ></div>
          </div>
          <div className={styles.processStep}>
            <div className={`${styles.stepIcon} ${theme.currentClass}`}>
              <FaTimes />
            </div>
            <span className={styles.stepText}>Não Aprovado</span>
            <div className={styles.connectionLine}></div>
          </div>
          <div className={styles.processStep}>
            <div className={`${styles.stepIcon} ${styles.stepPending}`}>
              <FaCheck />
            </div>
            <span className={styles.stepText}>Aprovado</span>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.processContainer}>
        <div className={styles.processStep}>
          <div className={`${styles.stepIcon} ${theme.completedClass}`}>
            <FaCheck />
          </div>
          <span className={styles.stepText}>Solicitação Enviada</span>
          <div
            className={`${styles.connectionLine} ${theme.connectorClass}`}
          ></div>
        </div>
        <div className={styles.processStep}>
          <div
            className={`${styles.stepIcon} ${
              status === "pendente" ? theme.currentClass : theme.completedClass
            }`}
          >
            {status === "pendente" ? <FaClock /> : <FaCheck />}
          </div>
          <span className={styles.stepText}>Em Análise</span>
          <div
            className={`${styles.connectionLine} ${
              status === "aprovado" ? theme.connectorClass : ""
            }`}
          ></div>
        </div>
        <div className={styles.processStep}>
          <div
            className={`${styles.stepIcon} ${
              status === "aprovado" ? theme.completedClass : styles.stepPending
            }`}
          >
            <FaCheck />
          </div>
          <span className={styles.stepText}>Aprovado</span>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h2 className={styles.title}>
              Adoção - {adoptionProcess.animal.nome}
            </h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            type="button"
          >
            <IoClose />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.processSection}>
            <div className={styles.processHeader}>
              <h3 className={styles.processTitle}>Progresso da Adoção</h3>
              <div
                className={styles.statusBadge}
                style={{
                  backgroundColor: `${getStatusColor(
                    adoptionProcess.status
                  )}20`,
                  borderColor: getStatusColor(adoptionProcess.status),
                  color: getStatusColor(adoptionProcess.status),
                }}
              >
                {getStatusText(adoptionProcess.status)}
              </div>
            </div>
            <div className={styles.dateInfo}>
              <span className={styles.dateText}>
                Solicitado em:{" "}
                {new Date(adoptionProcess.createdAt).toLocaleDateString(
                  "pt-BR"
                )}
              </span>
              <span className={styles.dateText}>
                Última atualização:{" "}
                {new Date(adoptionProcess.updatedAt).toLocaleDateString(
                  "pt-BR"
                )}
              </span>
            </div>
            {renderProcessSteps()}

            {adoptionProcess.status === "rejeitado" &&
              adoptionProcess.motivo && (
                <div className={styles.rejectionSection}>
                  <h4 className={styles.rejectionTitle}>
                    Motivo da Não Aprovação
                  </h4>
                  <div className={styles.rejectionContent}>
                    <p className={styles.rejectionText}>
                      {adoptionProcess.motivo}
                    </p>
                  </div>
                </div>
              )}
          </div>

          {getNextStepsContent(adoptionProcess.status)}

          {adoptionProcess.status === "aprovado" && (
            <>
              <div className={styles.approvedMessage}>
                <p className={styles.approvedMessageText}>
                  A ONG entrará em contato <b>através do email cadastrado</b>{" "}
                  para os próximos passos.
                </p>
              </div>

              <div className={styles.contactSection}>
                <h4 className={styles.contactTitle}>Contato da ONG</h4>
                <div className={styles.contactInfo}>
                  <div className={styles.contactItem}>
                    <FaEnvelope className={styles.contactIcon} />
                    <span>{adoptionProcess.animal.ong.email}</span>
                  </div>
                  <div className={styles.contactItem}>
                    <FaPhone className={styles.contactIcon} />
                    <span>{adoptionProcess.animal.ong.telefone}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
