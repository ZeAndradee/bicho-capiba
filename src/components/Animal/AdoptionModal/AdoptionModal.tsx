"use client";

import { useState, useEffect, useRef, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { FaArrowRight, FaClock, FaCheck } from "react-icons/fa";
import {
  House,
  Building2,
  Trees,
  Tractor,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { formatUrlParam } from "@/utils/formatters";
import {
  Adopter,
  createAdoption,
  fetchAdopterProfile,
} from "@/services/Adoption/Adoption";
import { handleApiError, ErrorState } from "@/utils/ErrorHandler";
import Error from "@/components/UI/Error/Error";
import Counter from "@/components/UI/Counter/Counter";
import ChoiceGroup, {
  ChoiceOption,
} from "@/components/UI/ChoiceGroup/ChoiceGroup";
import StepSlider from "@/components/UI/StepSlider/StepSlider";
import { validateAdoptionForm } from "@/validators/adoption";
import {
  LIVES_ALONE,
  residenceOptions,
  householdOptions,
  childrenAgeOptions,
  petSexOptions,
  petAgeOptions,
  petBehaviorOptions,
  availableTimeOptions,
} from "@/data/adoptionOptions";
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

const initialFormData: FormData = {
  tipo_residencia: "",
  area_externa: null,
  possui_animais: null,
  quantidade_animais: "",
  tela_protetora: null,
  quantidade_moradores: "1",
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
};

const STEPS: Array<{ title: string; fields: Array<keyof FormData> }> = [
  {
    title: "Moradia",
    fields: ["tipo_residencia", "area_externa", "tela_protetora"],
  },
  {
    title: "Família",
    fields: [
      "composicao_familiar",
      "quantidade_moradores",
      "possui_criancas",
      "quantidade_criancas",
      "faixa_etaria_criancas",
      "crianca_necessidade_especial",
      "tipo_necessidade_criancas",
      "familiar_necessidade_especial",
      "tipo_necessidade_especial_familiar",
    ],
  },
  {
    title: "Animais",
    fields: [
      "possui_animais",
      "quantidade_animais",
      "idade_animais",
      "sexo_animais",
      "comportamento_animais",
      "experiencia_com_animais",
    ],
  },
  {
    title: "Rotina",
    fields: ["conhecimento_despesas_animais", "tempo_disponivel"],
  },
];

const yesNoOptions: ChoiceOption<boolean>[] = [
  { value: true, label: "Sim" },
  { value: false, label: "Não" },
];

const residenceIcons: Record<string, ReactNode> = {
  casa: <House size={26} />,
  apartamento: <Building2 size={26} />,
  chacara: <Trees size={26} />,
  sitio: <Tractor size={26} />,
};

const LIST_SEPARATOR = ", ";

const toBoolean = (value: boolean | number | null | undefined) =>
  value === null || value === undefined ? null : Boolean(value);

const toText = (value: string | number | null | undefined) =>
  value === null || value === undefined ? "" : String(value);

const parseList = (value: string, known: string[]) => {
  if (!value.trim()) return [];
  const parts = value.split(LIST_SEPARATOR).map((part) => part.trim());
  return parts.every((part) => known.includes(part)) ? parts : [value.trim()];
};

const toChoiceOptions = (known: string[], selected: string[]) =>
  [...known, ...selected.filter((item) => !known.includes(item))].map(
    (item) => ({ value: item, label: item })
  );

const profileToFormData = (profile: Partial<Adopter>): Partial<FormData> => {
  const entries: Partial<FormData> = {
    tipo_residencia: toText(profile.tipoResidencia),
    area_externa: toBoolean(profile.areaExterna),
    tela_protetora: toBoolean(profile.telaProtetora),
    composicao_familiar: toText(profile.composicaoFamiliar),
    quantidade_moradores: toText(profile.quantidadeMoradores),
    possui_criancas: toBoolean(profile.possuiCriancas),
    quantidade_criancas: toText(profile.quantidadeCriancas),
    faixa_etaria_criancas: toText(profile.faixaEtariaCriancas),
    crianca_necessidade_especial: toBoolean(profile.criancaNecessidadeEspecial),
    tipo_necessidade_criancas: toText(profile.tipoNecessidadeCriancas),
    familiar_necessidade_especial: toBoolean(
      profile.familiarNecessidadeEspecial
    ),
    tipo_necessidade_especial_familiar: toText(
      profile.tipoNecessidadeEspecialFamiliar
    ),
    possui_animais: toBoolean(profile.possuiAnimais),
    quantidade_animais: toText(profile.quantidadeAnimais),
    idade_animais: toText(profile.idadeAnimais),
    sexo_animais: toText(profile.sexoAnimais),
    experiencia_com_animais: toBoolean(profile.experienciaComAnimais),
    comportamento_animais: toText(profile.comportamentoAnimais),
    conhecimento_despesas_animais: toBoolean(
      profile.conhecimentoDespesasAnimais
    ),
    tempo_disponivel: toText(profile.tempoDisponivel),
  };

  return Object.fromEntries(
    Object.entries(entries).filter(
      ([, value]) => value !== null && value !== ""
    )
  ) as Partial<FormData>;
};

const sanitizeFormData = (data: FormData): FormData => ({
  ...data,
  quantidade_criancas: data.possui_criancas ? data.quantidade_criancas : "",
  faixa_etaria_criancas: data.possui_criancas ? data.faixa_etaria_criancas : "",
  crianca_necessidade_especial: data.possui_criancas
    ? data.crianca_necessidade_especial
    : null,
  tipo_necessidade_criancas:
    data.possui_criancas && data.crianca_necessidade_especial
      ? data.tipo_necessidade_criancas
      : "",
  tipo_necessidade_especial_familiar: data.familiar_necessidade_especial
    ? data.tipo_necessidade_especial_familiar
    : "",
  quantidade_animais: data.possui_animais ? data.quantidade_animais : "",
  idade_animais: data.possui_animais ? data.idade_animais : "",
  sexo_animais: data.possui_animais ? data.sexo_animais : "",
  comportamento_animais: data.possui_animais ? data.comportamento_animais : "",
});

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className={`${styles.field} ${error ? styles.fieldInvalid : ""}`}>
      <span className={styles.label}>{label}</span>
      {hint && <span className={styles.hint}>{hint}</span>}
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default function AdoptionModal({
  isOpen,
  onClose,
  animal,
}: AdoptionModalProps) {
  const { isAuthenticated, isOng } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<
    "auth" | "explanation" | "form" | "success"
  >("auth");
  const [formStep, setFormStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isPrefilled, setIsPrefilled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<ErrorState | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const bodyRef = useRef<HTMLDivElement>(null);
  const hasEdited = useRef(false);

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
    if (!isOpen || !isAuthenticated || isOng) return;

    let cancelled = false;

    fetchAdopterProfile()
      .then((profile) => {
        if (cancelled || hasEdited.current) return;
        const saved = profileToFormData(profile);
        if (Object.keys(saved).length === 0) return;
        setFormData({ ...initialFormData, ...saved });
        setIsPrefilled(true);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isOpen, isAuthenticated, isOng]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 });
  }, [formStep]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const updateForm = (changes: Partial<FormData>) => {
    hasEdited.current = true;
    setFormData((prev) => ({ ...prev, ...changes }));
    setValidationErrors((prev) => {
      const next = { ...prev };
      Object.keys(changes).forEach((key) => delete next[key]);
      return next;
    });
  };

  const handleLoginRedirect = () => {
    router.push(`/entrar?redirect=${formatUrlParam(`/adote/${animal.id}`)}`);
  };

  const handleSignupRedirect = () => {
    router.push(`/cadastro?redirect=${formatUrlParam(`/adote/${animal.id}`)}`);
  };

  const getStepErrors = (stepIndex: number) => {
    const errors = validateAdoptionForm(formData);
    return Object.fromEntries(
      Object.entries(errors).filter(([field]) =>
        STEPS[stepIndex].fields.includes(field as keyof FormData)
      )
    );
  };

  const focusFirstError = () => {
    requestAnimationFrame(() => {
      bodyRef.current
        ?.querySelector(`.${styles.fieldInvalid}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const handleNext = () => {
    const errors = getStepErrors(formStep);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      focusFirstError();
      return;
    }

    setValidationErrors({});
    setFormStep((step) => step + 1);
  };

  const handleBack = () => {
    setValidationErrors({});
    if (formStep === 0) {
      setCurrentStep("explanation");
      return;
    }
    setFormStep((step) => step - 1);
  };

  const handleSubmit = async () => {
    setError(null);

    const errors = validateAdoptionForm(formData);
    if (Object.keys(errors).length > 0) {
      const stepWithError = STEPS.findIndex((step) =>
        step.fields.some((field) => errors[field])
      );
      setFormStep(stepWithError === -1 ? formStep : stepWithError);
      setValidationErrors(errors);
      focusFirstError();
      return;
    }

    setIsSubmitting(true);

    try {
      await createAdoption({
        animal_id: animal.id,
        ...sanitizeFormData(formData),
      });

      setCurrentStep("success");
    } catch (error) {
      const errorState = handleApiError(error, {
        400: "Verifique os campos preenchidos e tente novamente.",
        403: "Contas de ONG não podem solicitar adoções.",
        409: "Você já enviou uma solicitação para este animal ou ele já foi adotado.",
        422: "Alguns campos são obrigatórios. Verifique e tente novamente.",
      });
      setError(errorState);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderYesNo = (name: keyof FormData, label: string) => (
    <ChoiceGroup<boolean>
      label={label}
      variant="toggle"
      options={yesNoOptions}
      value={formData[name] as boolean | null}
      invalid={Boolean(validationErrors[name])}
      onChange={(value) => updateForm({ [name]: value })}
    />
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
          O próximo passo é responder algumas perguntas rápidas sobre sua
          família, residência e experiência com animais. São só 4 etapas, quase
          tudo com um toque. <br /> <br /> Essas informações ajudam a ONG
          responsável a:
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
          onClick={() => {
            setFormStep(0);
            setCurrentStep("form");
          }}
        >
          Continuar para o Formulário
          <FaArrowRight />
        </button>
      </div>
    </div>
  );

  const renderHomeStep = () => (
    <>
      <Field error={validationErrors.tipo_residencia} label="Onde você mora?">
        <ChoiceGroup<string>
          label="Tipo de residência"
          variant="cards"
          value={formData.tipo_residencia || null}
          invalid={Boolean(validationErrors.tipo_residencia)}
          options={residenceOptions.map((option) => ({
            ...option,
            icon: residenceIcons[option.value],
          }))}
          onChange={(value) => updateForm({ tipo_residencia: value })}
        />
      </Field>

      <Field
        error={validationErrors.area_externa}
        label="Tem área externa?"
        hint="Quintal, varanda ou área descoberta onde o animal possa ficar"
      >
        {renderYesNo("area_externa", "Possui área externa")}
      </Field>

      <Field
        error={validationErrors.tela_protetora}
        label="Janelas e varandas têm tela de proteção?"
        hint="Telas evitam quedas e fugas, principalmente de gatos"
      >
        {renderYesNo("tela_protetora", "Possui tela protetora")}
      </Field>
    </>
  );

  const renderFamilyStep = () => {
    const household = parseList(formData.composicao_familiar, householdOptions);
    const childrenCount = Number(formData.quantidade_criancas) || 1;

    return (
      <>
        <Field
          error={validationErrors.composicao_familiar}
          label="Quem mora com você?"
          hint="Marque todas as opções que se aplicam"
        >
          <ChoiceGroup<string>
            multiple
            label="Composição familiar"
            value={household}
            invalid={Boolean(validationErrors.composicao_familiar)}
            options={toChoiceOptions(householdOptions, household)}
            onChange={(values) => {
              const justSelectedAlone =
                values.includes(LIVES_ALONE) &&
                !household.includes(LIVES_ALONE);
              const next = justSelectedAlone
                ? [LIVES_ALONE]
                : values.filter(
                    (item) => item !== LIVES_ALONE || values.length === 1
                  );
              updateForm({
                composicao_familiar: next.join(LIST_SEPARATOR),
                ...(justSelectedAlone ? { quantidade_moradores: "1" } : {}),
              });
            }}
          />
        </Field>

        <Field
          error={validationErrors.quantidade_moradores}
          label="Quantas pessoas moram na casa?"
          hint="Contando com você"
        >
          <Counter
            label="moradores"
            min={1}
            max={20}
            unit={["pessoa", "pessoas"]}
            value={Number(formData.quantidade_moradores) || 1}
            onChange={(value) =>
              updateForm({ quantidade_moradores: String(value) })
            }
          />
        </Field>

        <Field
          error={validationErrors.possui_criancas}
          label="Tem crianças em casa?"
        >
          <ChoiceGroup<boolean>
            label="Possui crianças"
            variant="toggle"
            options={yesNoOptions}
            value={formData.possui_criancas}
            invalid={Boolean(validationErrors.possui_criancas)}
            onChange={(value) =>
              updateForm({
                possui_criancas: value,
                ...(value && !formData.quantidade_criancas
                  ? { quantidade_criancas: "1" }
                  : {}),
              })
            }
          />
        </Field>

        {formData.possui_criancas === true && (
          <div className={styles.nested}>
            <Field
              error={validationErrors.quantidade_criancas}
              label="Quantas crianças?"
            >
              <Counter
                label="crianças"
                min={1}
                max={15}
                unit={["criança", "crianças"]}
                value={childrenCount}
                onChange={(value) =>
                  updateForm({ quantidade_criancas: String(value) })
                }
              />
            </Field>

            <Field
              error={validationErrors.faixa_etaria_criancas}
              label="Qual a idade delas?"
            >
              <ChoiceGroup<string>
                label="Faixa etária das crianças"
                value={formData.faixa_etaria_criancas || null}
                invalid={Boolean(validationErrors.faixa_etaria_criancas)}
                options={childrenAgeOptions}
                onChange={(value) =>
                  updateForm({ faixa_etaria_criancas: value })
                }
              />
            </Field>

            <Field
              error={validationErrors.crianca_necessidade_especial}
              label="Alguma criança tem necessidade especial?"
            >
              {renderYesNo(
                "crianca_necessidade_especial",
                "Criança com necessidade especial"
              )}
            </Field>

            {formData.crianca_necessidade_especial === true && (
              <Field
                error={validationErrors.tipo_necessidade_criancas}
                label="Conte um pouco sobre a necessidade"
              >
                <input
                  type="text"
                  className={styles.input}
                  value={formData.tipo_necessidade_criancas}
                  onChange={(e) =>
                    updateForm({ tipo_necessidade_criancas: e.target.value })
                  }
                  placeholder="Ex: autismo, mobilidade reduzida..."
                />
              </Field>
            )}
          </div>
        )}

        <Field
          error={validationErrors.familiar_necessidade_especial}
          label="Algum adulto da casa tem necessidade especial?"
        >
          {renderYesNo(
            "familiar_necessidade_especial",
            "Familiar com necessidade especial"
          )}
        </Field>

        {formData.familiar_necessidade_especial === true && (
          <div className={styles.nested}>
            <Field
              error={validationErrors.tipo_necessidade_especial_familiar}
              label="Conte um pouco sobre a necessidade"
            >
              <input
                type="text"
                className={styles.input}
                value={formData.tipo_necessidade_especial_familiar}
                onChange={(e) =>
                  updateForm({
                    tipo_necessidade_especial_familiar: e.target.value,
                  })
                }
                placeholder="Ex: deficiência visual, alergia..."
              />
            </Field>
          </div>
        )}
      </>
    );
  };

  const renderPetsStep = () => {
    const behaviors = parseList(
      formData.comportamento_animais,
      petBehaviorOptions
    );
    const petAge = formData.idade_animais ? [formData.idade_animais] : [];

    return (
      <>
        <Field
          error={validationErrors.possui_animais}
          label="Já tem outros animais?"
        >
          <ChoiceGroup<boolean>
            label="Possui outros animais"
            variant="toggle"
            options={yesNoOptions}
            value={formData.possui_animais}
            invalid={Boolean(validationErrors.possui_animais)}
            onChange={(value) =>
              updateForm({
                possui_animais: value,
                ...(value && !formData.quantidade_animais
                  ? { quantidade_animais: "1" }
                  : {}),
              })
            }
          />
        </Field>

        {formData.possui_animais === true && (
          <div className={styles.nested}>
            <Field error={validationErrors.quantidade_animais} label="Quantos?">
              <Counter
                label="animais"
                min={1}
                max={20}
                unit={["animal", "animais"]}
                value={Number(formData.quantidade_animais) || 1}
                onChange={(value) =>
                  updateForm({ quantidade_animais: String(value) })
                }
              />
            </Field>

            <Field
              error={validationErrors.idade_animais}
              label="Qual a idade deles?"
            >
              <ChoiceGroup<string>
                label="Idade dos animais"
                value={formData.idade_animais || null}
                invalid={Boolean(validationErrors.idade_animais)}
                options={toChoiceOptions(petAgeOptions, petAge)}
                onChange={(value) => updateForm({ idade_animais: value })}
              />
            </Field>

            <Field
              error={validationErrors.sexo_animais}
              label="São machos ou fêmeas?"
            >
              <ChoiceGroup<string>
                label="Sexo dos animais"
                value={formData.sexo_animais || null}
                invalid={Boolean(validationErrors.sexo_animais)}
                options={petSexOptions}
                onChange={(value) => updateForm({ sexo_animais: value })}
              />
            </Field>

            <Field
              error={validationErrors.comportamento_animais}
              label="Como eles se comportam?"
              hint="Marque todas as opções que se aplicam"
            >
              <ChoiceGroup<string>
                multiple
                label="Comportamento dos animais"
                value={behaviors}
                invalid={Boolean(validationErrors.comportamento_animais)}
                options={toChoiceOptions(petBehaviorOptions, behaviors)}
                onChange={(values) =>
                  updateForm({
                    comportamento_animais: values.join(LIST_SEPARATOR),
                  })
                }
              />
            </Field>
          </div>
        )}

        <Field
          error={validationErrors.experiencia_com_animais}
          label="Já cuidou de animais antes?"
        >
          {renderYesNo(
            "experiencia_com_animais",
            "Possui experiência com animais"
          )}
        </Field>
      </>
    );
  };

  const renderRoutineStep = () => (
    <>
      <Field
        error={validationErrors.conhecimento_despesas_animais}
        label="Você conhece os custos de ter um pet?"
        hint="Ração, veterinário, vacinas, medicamentos, etc."
      >
        {renderYesNo(
          "conhecimento_despesas_animais",
          "Conhece as despesas com animais"
        )}
      </Field>

      <Field
        error={validationErrors.tempo_disponivel}
        label={`Quanto tempo você terá para ${
          animal.sexo === "M" ? "o" : "a"
        } ${animal.nome}?`}
      >
        <StepSlider
          label="Tempo disponível"
          options={availableTimeOptions}
          value={formData.tempo_disponivel}
          invalid={Boolean(validationErrors.tempo_disponivel)}
          onChange={(value) => updateForm({ tempo_disponivel: value })}
        />
      </Field>
    </>
  );

  const stepRenderers = [
    renderHomeStep,
    renderFamilyStep,
    renderPetsStep,
    renderRoutineStep,
  ];
  const isLastStep = formStep === STEPS.length - 1;

  const renderFormStep = () => (
    <>
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <span className={styles.stepCounter}>
            Etapa {formStep + 1} de {STEPS.length}
          </span>
          <h2 className={styles.title}>
            Adotar {animal.sexo === "M" ? "o" : "a"} {animal.nome}
          </h2>
        </div>
        <button
          className={styles.closeButton}
          onClick={onClose}
          type="button"
          aria-label="Fechar"
        >
          <IoClose />
        </button>
      </div>

      <ol className={styles.progress}>
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className={`${styles.progressItem} ${
              index <= formStep ? styles.progressDone : ""
            } ${index === formStep ? styles.progressCurrent : ""}`}
          >
            <span className={styles.progressBar} />
            <span className={styles.progressLabel}>{step.title}</span>
          </li>
        ))}
      </ol>

      <div className={styles.form} ref={bodyRef}>
        {isPrefilled && formStep === 0 && (
          <div className={styles.prefillBanner}>
            <Sparkles size={18} />
            <span>
              Preenchemos com suas respostas anteriores. Confira e ajuste se
              algo mudou.
            </span>
          </div>
        )}
        {stepRenderers[formStep]()}
        {isLastStep && error && <Error error={error} />}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.backButton}
          onClick={handleBack}
          disabled={isSubmitting}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>
        {isLastStep ? (
          <button
            type="button"
            className={styles.submitButton}
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
          </button>
        ) : (
          <button
            type="button"
            className={styles.submitButton}
            onClick={handleNext}
          >
            Próximo
            <FaArrowRight />
          </button>
        )}
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={`${styles.modal} ${
          currentStep === "auth" ? styles.modalAuth : ""
        } ${currentStep === "form" ? styles.modalForm : ""}`}
        role="dialog"
        aria-modal="true"
      >
        {currentStep === "auth"
          ? renderAuthStep()
          : currentStep === "explanation"
            ? renderExplanationStep()
            : currentStep === "success"
              ? renderSuccessStep()
              : renderFormStep()}
      </div>
    </div>
  );
}
