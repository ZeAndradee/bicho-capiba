"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import {
  FaQuestionCircle,
  FaArrowRight,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { formatUrlParam } from "@/utils/formatters";
import { getApiInstance } from "@/hooks/Api";
import { handleApiError, ErrorState } from "@/utils/ErrorHandler";
import Error from "@/components/UI/Error/Error";
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
  tipoResidencia: string;
  areaExterna: boolean | null;
  possuiAnimais: boolean | null;
  quantidadeAnimais: number | null;
  telaProtetora: boolean | null;
  quantidadeMoradores: number | null;
  idadeAnimais: string;
  sexoAnimais: string;
  comportamentoAnimais: string;
  possuiCriancas: boolean | null;
  quantidadeCriancas: number | null;
  criancaNecessidadeEspecial: boolean | null;
  faixaEtariaCriancas: string;
  tipoNecessidadeCriancas: string;
  composicaoFamiliar: string;
  familiarNecessidadeEspecial: boolean | null;
  tipoNecessidadeEspecialFamiliar: string;
  experienciaComAnimais: boolean | null;
  conhecimentoDespesasAnimais: boolean | null;
  tempoDisponivel: string;
}

export default function AdoptionModal({
  isOpen,
  onClose,
  animal,
}: AdoptionModalProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "auth" | "explanation" | "form" | "success"
  >("auth");
  const [formData, setFormData] = useState<FormData>({
    tipoResidencia: "",
    areaExterna: null,
    possuiAnimais: null,
    quantidadeAnimais: null,
    telaProtetora: null,
    quantidadeMoradores: null,
    idadeAnimais: "",
    sexoAnimais: "",
    comportamentoAnimais: "",
    possuiCriancas: null,
    quantidadeCriancas: null,
    criancaNecessidadeEspecial: null,
    faixaEtariaCriancas: "",
    tipoNecessidadeCriancas: "",
    composicaoFamiliar: "",
    familiarNecessidadeEspecial: null,
    tipoNecessidadeEspecialFamiliar: "",
    experienciaComAnimais: null,
    conhecimentoDespesasAnimais: null,
    tempoDisponivel: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);

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


  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
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

    try {
      const api = getApiInstance();
      await api.post("/adoptions", {
        animalId: animal.id,
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
      <div className={styles.successIcon}>
        <FaHeart />
      </div>
      <h2 className={styles.successTitle}>Solicitação Enviada!</h2>
      <div className={styles.successText}>
        <p>
          Sua solicitação de adoção para {animal.sexo === "M" ? "o" : "a"}{" "}
          <strong>{animal.nome}</strong> foi enviada com sucesso!
        </p>
        <p>
          A ONG responsável irá analisar sua solicitação e entrará em contato
          com você em breve através do email cadastrado.
        </p>
        <p>
          <strong>Próximos passos:</strong>
        </p>
        <ul className={styles.successList}>
          <li>Aguarde o contato da ONG</li>
          <li>Prepare a documentação solicitada</li>
          <li>Agende uma visita se aprovado</li>
        </ul>
      </div>
      <button
        type="button"
        className={styles.successButton}
        onClick={onClose}
      >
        Entendi
      </button>
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
            value={formData.tipoResidencia}
            onChange={(e) =>
              handleInputChange("tipoResidencia", e.target.value)
            }
            required
          >
            <option value="">Selecione...</option>
            <option value="casa">Casa</option>
            <option value="apartamento">Apartamento</option>
            <option value="chacara">Chácara</option>
            <option value="sitio">Sítio</option>
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Possui área externa?
            <Tooltip
              text="Quintal, varanda ou área descoberta onde o animal possa ficar"
              id="areaExterna"
            />
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="areaExterna"
                checked={formData.areaExterna === true}
                onChange={() => handleInputChange("areaExterna", true)}
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="areaExterna"
                checked={formData.areaExterna === false}
                onChange={() => handleInputChange("areaExterna", false)}
              />
              Não
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Possui tela protetora?
            <Tooltip
              text="Telas de proteção em janelas e varandas para evitar quedas"
              id="telaProtetora"
            />
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="telaProtetora"
                checked={formData.telaProtetora === true}
                onChange={() => handleInputChange("telaProtetora", true)}
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="telaProtetora"
                checked={formData.telaProtetora === false}
                onChange={() => handleInputChange("telaProtetora", false)}
              />
              Não
            </label>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Quantidade de moradores na casa
          </label>
          <input
            type="number"
            className={styles.input}
            value={formData.quantidadeMoradores || ""}
            onChange={(e) =>
              handleInputChange(
                "quantidadeMoradores",
                e.target.value
              )
            }
            min="1"
            required
          />
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
                name="possuiAnimais"
                checked={formData.possuiAnimais === true}
                onChange={() => handleInputChange("possuiAnimais", true)}
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="possuiAnimais"
                checked={formData.possuiAnimais === false}
                onChange={() => handleInputChange("possuiAnimais", false)}
              />
              Não
            </label>
          </div>
        </div>

        {formData.possuiAnimais === true && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Quantos animais?</label>
              <input
                type="number"
                className={styles.input}
                value={formData.quantidadeAnimais || ""}
                onChange={(e) =>
                  handleInputChange(
                    "quantidadeAnimais",
                    e.target.value
                  )
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
                value={formData.idadeAnimais}
                onChange={(e) =>
                  handleInputChange("idadeAnimais", e.target.value)
                }
                placeholder="Ex: 2 anos, 6 meses..."
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Sexo dos animais</label>
              <select
                className={styles.select}
                value={formData.sexoAnimais}
                onChange={(e) =>
                  handleInputChange("sexoAnimais", e.target.value)
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
                value={formData.comportamentoAnimais}
                onChange={(e) =>
                  handleInputChange("comportamentoAnimais", e.target.value)
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
                name="possuiCriancas"
                checked={formData.possuiCriancas === true}
                onChange={() => handleInputChange("possuiCriancas", true)}
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="possuiCriancas"
                checked={formData.possuiCriancas === false}
                onChange={() => handleInputChange("possuiCriancas", false)}
              />
              Não
            </label>
          </div>
        </div>

        {formData.possuiCriancas === true && (
          <>
            <div className={styles.field}>
              <label className={styles.label}>Quantidade de crianças</label>
              <input
                type="number"
                className={styles.input}
                value={formData.quantidadeCriancas || ""}
                onChange={(e) =>
                  handleInputChange(
                    "quantidadeCriancas",
                    e.target.value
                  )
                }
                min="1"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Faixa etária das crianças</label>
              <select
                className={styles.select}
                value={formData.faixaEtariaCriancas}
                onChange={(e) =>
                  handleInputChange("faixaEtariaCriancas", e.target.value)
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
                    name="criancaNecessidadeEspecial"
                    checked={formData.criancaNecessidadeEspecial === true}
                    onChange={() =>
                      handleInputChange("criancaNecessidadeEspecial", true)
                    }
                  />
                  Sim
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="criancaNecessidadeEspecial"
                    checked={formData.criancaNecessidadeEspecial === false}
                    onChange={() =>
                      handleInputChange("criancaNecessidadeEspecial", false)
                    }
                  />
                  Não
                </label>
              </div>
            </div>

            {formData.criancaNecessidadeEspecial === true && (
              <div className={styles.field}>
                <label className={styles.label}>
                  Tipo de necessidade especial
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.tipoNecessidadeCriancas}
                  onChange={(e) =>
                    handleInputChange("tipoNecessidadeCriancas", e.target.value)
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
            value={formData.composicaoFamiliar}
            onChange={(e) =>
              handleInputChange("composicaoFamiliar", e.target.value)
            }
            placeholder="Descreva quem mora na casa (idades, parentesco, etc.)"
            rows={3}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Algum familiar possui necessidade especial?
          </label>
          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="familiarNecessidadeEspecial"
                checked={formData.familiarNecessidadeEspecial === true}
                onChange={() =>
                  handleInputChange("familiarNecessidadeEspecial", true)
                }
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="familiarNecessidadeEspecial"
                checked={formData.familiarNecessidadeEspecial === false}
                onChange={() =>
                  handleInputChange("familiarNecessidadeEspecial", false)
                }
              />
              Não
            </label>
          </div>
        </div>

        {formData.familiarNecessidadeEspecial === true && (
          <div className={styles.field}>
            <label className={styles.label}>Tipo de necessidade especial</label>
            <input
              type="text"
              className={styles.input}
              value={formData.tipoNecessidadeEspecialFamiliar}
              onChange={(e) =>
                handleInputChange(
                  "tipoNecessidadeEspecialFamiliar",
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
                name="experienciaComAnimais"
                checked={formData.experienciaComAnimais === true}
                onChange={() =>
                  handleInputChange("experienciaComAnimais", true)
                }
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="experienciaComAnimais"
                checked={formData.experienciaComAnimais === false}
                onChange={() =>
                  handleInputChange("experienciaComAnimais", false)
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
                name="conhecimentoDespesasAnimais"
                checked={formData.conhecimentoDespesasAnimais === true}
                onChange={() =>
                  handleInputChange("conhecimentoDespesasAnimais", true)
                }
              />
              Sim
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="conhecimentoDespesasAnimais"
                checked={formData.conhecimentoDespesasAnimais === false}
                onChange={() =>
                  handleInputChange("conhecimentoDespesasAnimais", false)
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
            value={formData.tempoDisponivel}
            onChange={(e) =>
              handleInputChange("tempoDisponivel", e.target.value)
            }
            required
          >
            <option value="">Selecione...</option>
            <option value="poucas-horas">Poucas horas por dia</option>
            <option value="meio-periodo">Meio período</option>
            <option value="periodo-integral">Período integral</option>
            <option value="fins-de-semana">Apenas fins de semana</option>
          </select>
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
