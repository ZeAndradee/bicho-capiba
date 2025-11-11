"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import {
  FaQuestionCircle,
  FaArrowRight,
  FaClock,
  FaCheck,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { formatUrlParam } from "@/utils/formatters";
import { getApiInstance } from "@/hooks/Api";
import { handleApiError, ErrorState } from "@/utils/ErrorHandler";
import Error from "@/components/UI/Error/Error";
import { validateAdoptionForm } from "@/validators/adoption";
import styles from "./AdoptionModal.module.css";

interface Animal {
  id: string;
  nome: string;
  sexo: "M" | "F";
}

interface AdoptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  animal: Animal;
}

interface FormData {
  tipo_residencia: string;
  area_externa: boolean | null;
  possui_animais: boolean | null;
  quantidade_animais: string;
  tela_protetora: boolean | null;
  quantidade_moradores: string;
  idade_animais: string;
  sexo_animais: string;
  comportamento_animais: string;
  possui_criancas: boolean | null;
  quantidade_criancas: string;
  crianca_necessidade_especial: boolean | null;
  faixa_etaria_criancas: string;
  tipo_necessidade_criancas: string;
  composicao_familiar: string;
  familiar_necessidade_especial: boolean | null;
  tipo_necessidade_especial_familiar: string;
  experiencia_com_animais: boolean | null;
  conhecimento_despesas_animais: boolean | null;
  tempo_disponivel: string;
}

export default function AdoptionModal({
  isOpen,
  onClose,
  animal,
}: AdoptionModalProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "auth" | "explanation" | "form" | "success"
  >("auth");
  const [formData, setFormData] = useState<FormData>({
    tipo_residencia: "",
    area_externa: null,
    possui_animais: null,
    quantidade_animais: "",
    tela_protetora: null,
    quantidade_moradores: "",
    idade_animais: "",
    sexo_animais: "",
    comportamento_animais: "",
    possui_criancas: null,
    quantidade_criancas: "",
    crianca_necessidade_especial: null,
    faixa_etaria_criancas: "",
    tipo_necessidade_criancas: "",
    composicao_familiar: "",
    familiar_necessidade_especial: null,
    tipo_necessidade_especial_familiar: "",
    experiencia_com_animais: null,
    conhecimento_despesas_animais: null,
    tempo_disponivel: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (isOpen) {
      if (isAuthenticated) {
        setCurrentStep("explanation");
      } else {
        setCurrentStep("auth");
      }
    }
  }, [isOpen, isAuthenticated]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest(`.${styles.tooltip}`)) {
        setActiveTooltip(null);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleInputChange = (
    field: keyof FormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLoginRedirect = () => {
    router.push(`/entrar?redirect=${formatUrlParam(`/adote/${animal.id}`)}`);
  };

  const handleSignupRedirect = () => {
    router.push(`/cadastro?redirect=${formatUrlParam(`/adote/${animal.id}`)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setValidationErrors({});

    const errors = validateAdoptionForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      const api = getApiInstance();
      await api.post("/adoptions", {
        animal_id: animal.id,
        ...formData,
      });

      setCurrentStep("success");
    } catch (error) {
      const errorState = handleApiError(error, {
        400: "Verifique os campos preenchidos e tente novamente.",
        422: "Alguns campos são obrigatórios. Verifique e tente novamente.",
      });
      setError(errorState);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Tooltip = ({ text, id }: { text: string; id: string }) => (
    <div className={styles.tooltip}>
      <FaQuestionCircle
        className={styles.tooltipIcon}
        onClick={() => setActiveTooltip(activeTooltip === id ? null : id)}
      />
      <span
        className={`${styles.tooltipText} ${
          activeTooltip === id ? styles.tooltipActive : ""
        }`}
      >
        {text}
      </span>
    </div>
  );

  const renderAuthStep = () => (
    <div className={styles.authModalContent}>
      <div className={styles.authHero}>
        <h2 className={styles.authTitle}>Quer adotar esse pet?</h2>
        <p className={styles.authSubtitle}>
          Para adotar {animal.sexo === "M" ? "o" : "a"} {animal.nome}, você
          precisa fazer login ou criar uma conta
        </p>
      </div>

      <div className={styles.authButtons}>
        <button
          type="button"
          className={styles.authLoginButton}
          onClick={handleLoginRedirect}
        >
          Entrar
        </button>
        <button
          type="button"
          className={styles.authSignupButton}
          onClick={handleSignupRedirect}
        >
          Criar conta
          <FaArrowRight />
        </button>
      </div>
    </div>
  );

  const renderSuccessStep = () => (
    <div className={styles.successContent}>
      <h2 className={styles.successTitle}>Solicitação Enviada!</h2>
      <div className={styles.successText}>
        <p>
          Sua solicitação de adoção para {animal.sexo === "M" ? "o" : "a"}{" "}
          <strong>{animal.nome}</strong> foi enviada com sucesso!
        </p>
        <p>
          A ONG responsável irá analisar sua solicitação e entrará em contato
          com você através do email cadastrado.
        </p>
        <p>
          <strong>Acompanhe o status:</strong> Você pode verificar o andamento
          da sua solicitação a qualquer momento através do seu perfil ou por
          email.
        </p>
        <p>
          <strong>Processo de adoção:</strong>
        </p>
        <div className={styles.processContainer}>
          <div className={styles.processStep}>
            <div className={`${styles.stepIcon} ${styles.stepCompleted}`}>
              <FaCheck />
            </div>
            <span className={styles.stepText}>Solicitação Enviada</span>
            <div
              className={`${styles.connectionLine} ${styles.connectionLineCompleted}`}
            ></div>
          </div>
          <div className={styles.processStep}>
            <div className={`${styles.stepIcon} ${styles.stepCurrent}`}>
              <FaClock />
            </div>
            <span className={styles.stepText}>Em Análise</span>
            <div className={styles.connectionLine}></div>
          </div>
          <div className={styles.processStep}>
            <div className={`${styles.stepIcon} ${styles.stepPending}`}>
              <FaCheck />
            </div>
            <span className={styles.stepText}>Aprovado</span>
          </div>
        </div>
      </div>
      <div className={styles.successActions}>
        <button
          type="button"
          className={styles.statusButton}
          onClick={() => router.push("/perfil")}
        >
          Ver Status de Adoção
        </button>
        <button
          type="button"
          className={styles.successButton}
          onClick={onClose}
        >
          Entendi
        </button>
      </div>
    </div>
  );

  const renderExplanationStep = () => (
    <div className={styles.explanationContent}>
      <div className={styles.explanationTitleContainer}>
        <h3 className={styles.explanationTitle}>Como funciona?</h3>
        <div className={styles.explanationTitleSpacer}></div>
      </div>
      <div className={styles.explanationText}>
        <p>
          Para garantir a segurança e o bem-estar de todos, o Bicho Capiba segue
          um processo criterioso de adoção.
        </p>
        <p>
          O próximo passo é preencher um formulário com informações sobre sua
          família, residência e experiência com animais. <br /> <br /> Essas
          informações ajudam a ONG responsável a:
        </p>
        <ul className={styles.explanationList}>
          <li>Garantir que {animal.nome} terá um lar seguro e adequado</li>
          <li>Assegurar a compatibilidade entre o animal e sua família</li>
          <li>Proteger tanto o animal quanto você</li>
          <li>Cumprir as diretrizes de adoção responsável da ONG</li>
        </ul>
        <p>
          <strong>Importante:</strong> Todas as informações são confidenciais e
          utilizadas exclusivamente para o processo de adoção.
        </p>
      </div>
      <div className={styles.explanationActions}>
        <button type="button" className={styles.cancelButton} onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className={styles.continueButton}
          onClick={() => setCurrentStep("form")}
        >
          Continuar para o Formulário
          <FaArrowRight />
        </button>
      </div>
    </div>
  );

  const renderFormStep = () => (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Informações da Residência</h3>

        <div className={styles.field}>
          <label className={styles.label}>Tipo de Residência</label>
          <select
            className={styles.select}
            value={formData.tipo_residencia}
            onChange={(e) =>
              handleInputChange("tipo_residencia", e.target.value)
            }
            required
          >
            <option value="">Selecione...</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="chacara">Chácara</option>
            <option value="sitio">Sítio</option>
          </select>
          {validationErrors.tipo_residencia && (
            <span className={styles.error}>
              {validationErrors.tipo_residencia}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Possui área externa?
            <Tooltip
              text="Quintal, varanda ou área descoberta onde o animal possa ficar"
              id="area_externa"
            />
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="area_externa"
                checked={formData.area_externa === true}
                onChange={() => handleInputChange("area_externa", true)}
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="area_externa"
                checked={formData.area_externa === false}
                onChange={() => handleInputChange("area_externa", false)}
              />
              Não
            </label>
          </div>
          {validationErrors.area_externa && (
            <span className={styles.error}>
              {validationErrors.area_externa}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Possui tela protetora?
            <Tooltip
              text="Telas de proteção em janelas e varandas para evitar quedas"
              id="tela_protetora"
            />
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="tela_protetora"
                checked={formData.tela_protetora === true}
                onChange={() => handleInputChange("tela_protetora", true)}
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="tela_protetora"
                checked={formData.tela_protetora === false}
                onChange={() => handleInputChange("tela_protetora", false)}
              />
              Não
            </label>
          </div>
          {validationErrors.tela_protetora && (
            <span className={styles.error}>
              {validationErrors.tela_protetora}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Quantidade de moradores na casa
          </label>
          <input
            type="number"
            className={styles.input}
            value={formData.quantidade_moradores || ""}
            onChange={(e) =>
              handleInputChange("quantidade_moradores", e.target.value)
            }
            min="1"
            required
          />
          {validationErrors.quantidade_moradores && (
            <span className={styles.error}>
              {validationErrors.quantidade_moradores}
            </span>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Outros Animais</h3>

        <div className={styles.field}>
          <label className={styles.label}>Já possui outros animais?</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="possui_animais"
                checked={formData.possui_animais === true}
                onChange={() => handleInputChange("possui_animais", true)}
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="possui_animais"
                checked={formData.possui_animais === false}
                onChange={() => handleInputChange("possui_animais", false)}
              />
              Não
            </label>
          </div>
        </div>

        {formData.possui_animais === true && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Quantos animais?</label>
              <input
                type="number"
                className={styles.input}
                value={formData.quantidade_animais || ""}
                onChange={(e) =>
                  handleInputChange("quantidade_animais", e.target.value)
                }
                min="1"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Idade dos animais</label>
              <input
                type="text"
                className={styles.input}
                value={formData.idade_animais}
                onChange={(e) =>
                  handleInputChange("idade_animais", e.target.value)
                }
                placeholder="Ex: 2 anos, 6 meses..."
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Sexo dos animais</label>
              <select
                className={styles.select}
                value={formData.sexo_animais}
                onChange={(e) =>
                  handleInputChange("sexo_animais", e.target.value)
                }
              >
                <option value="">Selecione...</option>
                <option value="machos">Machos</option>
                <option value="femeas">Fêmeas</option>
                <option value="ambos">Ambos</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Comportamento dos animais</label>
              <textarea
                className={styles.textarea}
                value={formData.comportamento_animais}
                onChange={(e) =>
                  handleInputChange("comportamento_animais", e.target.value)
                }
                placeholder="Descreva o comportamento dos seus animais..."
                rows={3}
              />
            </div>
          </>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Crianças na Família</h3>

        <div className={styles.field}>
          <label className={styles.label}>Possui crianças em casa?</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="possui_criancas"
                checked={formData.possui_criancas === true}
                onChange={() => handleInputChange("possui_criancas", true)}
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="possui_criancas"
                checked={formData.possui_criancas === false}
                onChange={() => handleInputChange("possui_criancas", false)}
              />
              Não
            </label>
          </div>
        </div>

        {formData.possui_criancas === true && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Quantidade de crianças</label>
              <input
                type="number"
                className={styles.input}
                value={formData.quantidade_criancas || ""}
                onChange={(e) =>
                  handleInputChange("quantidade_criancas", e.target.value)
                }
                min="1"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Faixa etária das crianças</label>
              <select
                className={styles.select}
                value={formData.faixa_etaria_criancas}
                onChange={(e) =>
                  handleInputChange("faixa_etaria_criancas", e.target.value)
                }
              >
                <option value="">Selecione...</option>
                <option value="0-2">0-2 anos</option>
                <option value="3-5">3-5 anos</option>
                <option value="6-10">6-10 anos</option>
                <option value="11-15">11-15 anos</option>
                <option value="16+">16+ anos</option>
                <option value="variadas">Idades variadas</option>
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Alguma criança possui necessidade especial?
              </label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="crianca_necessidade_especial"
                    checked={formData.crianca_necessidade_especial === true}
                    onChange={() =>
                      handleInputChange("crianca_necessidade_especial", true)
                    }
                  />
                  Sim
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="crianca_necessidade_especial"
                    checked={formData.crianca_necessidade_especial === false}
                    onChange={() =>
                      handleInputChange("crianca_necessidade_especial", false)
                    }
                  />
                  Não
                </label>
              </div>
            </div>

            {formData.crianca_necessidade_especial === true && (
              <div className={styles.field}>
                <label className={styles.label}>
                  Tipo de necessidade especial
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.tipo_necessidade_criancas}
                  onChange={(e) =>
                    handleInputChange(
                      "tipo_necessidade_criancas",
                      e.target.value
                    )
                  }
                  placeholder="Descreva a necessidade especial..."
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Informações Gerais</h3>

        <div className={styles.field}>
          <label className={styles.label}>Composição familiar</label>
          <textarea
            className={styles.textarea}
            value={formData.composicao_familiar}
            onChange={(e) =>
              handleInputChange("composicao_familiar", e.target.value)
            }
            placeholder="Descreva quem mora na casa (idades, parentesco, etc.)"
            rows={3}
            required
          />
          {validationErrors.composicao_familiar && (
            <span className={styles.error}>
              {validationErrors.composicao_familiar}
            </span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Algum familiar possui necessidade especial?
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="familiar_necessidade_especial"
                checked={formData.familiar_necessidade_especial === true}
                onChange={() =>
                  handleInputChange("familiar_necessidade_especial", true)
                }
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="familiar_necessidade_especial"
                checked={formData.familiar_necessidade_especial === false}
                onChange={() =>
                  handleInputChange("familiar_necessidade_especial", false)
                }
              />
              Não
            </label>
          </div>
        </div>

        {formData.familiar_necessidade_especial === true && (
          <div className={styles.field}>
            <label className={styles.label}>Tipo de necessidade especial</label>
            <input
              type="text"
              className={styles.input}
              value={formData.tipo_necessidade_especial_familiar}
              onChange={(e) =>
                handleInputChange(
                  "tipo_necessidade_especial_familiar",
                  e.target.value
                )
              }
              placeholder="Descreva a necessidade especial..."
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>
            Possui experiência com animais?
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="experiencia_com_animais"
                checked={formData.experiencia_com_animais === true}
                onChange={() =>
                  handleInputChange("experiencia_com_animais", true)
                }
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="experiencia_com_animais"
                checked={formData.experiencia_com_animais === false}
                onChange={() =>
                  handleInputChange("experiencia_com_animais", false)
                }
              />
              Não
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Tem conhecimento sobre as despesas com animais?
            <Tooltip
              text="Ração, veterinário, vacinas, medicamentos, etc."
              id="despesasAnimais"
            />
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="conhecimento_despesas_animais"
                checked={formData.conhecimento_despesas_animais === true}
                onChange={() =>
                  handleInputChange("conhecimento_despesas_animais", true)
                }
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="conhecimento_despesas_animais"
                checked={formData.conhecimento_despesas_animais === false}
                onChange={() =>
                  handleInputChange("conhecimento_despesas_animais", false)
                }
              />
              Não
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Tempo disponível para o animal</label>
          <select
            className={styles.select}
            value={formData.tempo_disponivel}
            onChange={(e) =>
              handleInputChange("tempo_disponivel", e.target.value)
            }
            required
          >
            <option value="">Selecione...</option>
            <option value="poucas-horas">Poucas horas por dia</option>
            <option value="meio-periodo">Meio período</option>
            <option value="periodo-integral">Período integral</option>
            <option value="fins-de-semana">Apenas fins de semana</option>
          </select>
          {validationErrors.tempo_disponivel && (
            <span className={styles.error}>
              {validationErrors.tempo_disponivel}
            </span>
          )}
        </div>
      </div>

      {error && <Error error={error} />}

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => setCurrentStep("explanation")}
          disabled={isSubmitting}
        >
          Voltar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
        </button>
      </div>
    </form>
  );

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={`${styles.modal} ${
          currentStep === "auth" ? styles.modalAuth : ""
        }`}
      >
        {currentStep === "auth" ? (
          renderAuthStep()
        ) : currentStep === "explanation" ? (
          renderExplanationStep()
        ) : currentStep === "success" ? (
          renderSuccessStep()
        ) : (
          <>
            <div className={styles.header}>
              <div className={styles.titleContainer}>
                <h2 className={styles.title}>
                  Adotar {animal.sexo === "M" ? "o" : "a"} {animal.nome}
                </h2>
              </div>
              <button
                className={styles.closeButton}
                onClick={onClose}
                type="button"
              >
                <IoClose />
              </button>
            </div>{" "}
            {renderFormStep()}
          </>
        )}
      </div>
    </div>
  );
}
