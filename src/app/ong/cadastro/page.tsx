"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/UI/Button/Button";
import Error from "@/components/UI/Error/Error";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
} from "react-icons/fa";
import { handleApiError, ErrorState } from "@/utils/ErrorHandler";
import { useAuth } from "@/contexts/AuthContext";
import {
  validateOngSignupStep,
  OngSignupFormData,
} from "@/validators/auth/ongSignup";
import { validateCnpj, fetchCepData } from "@/services/Helpers/Helpers";
import { formatPhone, formatCnpj, formatUrlParam } from "@/utils/formatters";
import styles from "./page.module.css";

const steps = [
  {
    id: 1,
    title: "Informações Básicas",
    description: "Dados principais da ONG",
  },
  { id: 2, title: "Endereço", description: "Localização da organização" },
  { id: 3, title: "Sobre a ONG", description: "Como a ONG é organizada" },
];

export default function OngSignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const { signupOng, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState<OngSignupFormData>({
    name: "",
    cnpj: "",
    email: "",
    telefone: "",
    descricao: "",
    bairro: "",
    rua: "",
    numero: "",
    cidade: "",
    estado: "",
    complemento: "",
    CEP: "",
    quantidadeAnimais: 0,
    responsavelTecnico: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<ErrorState | null>(null);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [isLoadingCnpj, setIsLoadingCnpj] = useState(false);
  const [isValidCnpj, setIsValidCnpj] = useState<boolean | null>(null);


  const fetchCnpjData = async (cnpj: string) => {
    const cleanCnpj = cnpj.replace(/\D/g, "");
    if (cleanCnpj.length !== 14) return;

    setIsLoadingCnpj(true);
    setIsValidCnpj(null);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await validateCnpj(cleanCnpj);

      clearTimeout(timeoutId);

      if (
        response &&
        response.status === "OK" &&
        response.result === true
      ) {
        setIsValidCnpj(true);
      } else {
        setIsValidCnpj(false);
      }
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        console.error("CNPJ request timeout");
        setIsValidCnpj(null);
      } else if ((error as { response?: { status: number } })?.response) {
        const axiosError = error as { response?: { status: number } };
        if (axiosError.response?.status === 400) {
          setIsValidCnpj(false);
        } else {
          console.error("Erro ao buscar CNPJ:", error);
          setIsValidCnpj(null);
        }
      } else {
        console.error("Erro ao buscar CNPJ:", error);
        setIsValidCnpj(null);
      }
    } finally {
      setIsLoadingCnpj(false);
    }
  };

  const handleFetchCepData = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetchCepData(cleanCep);

      clearTimeout(timeoutId);

      if (response.status === "OK" && response.result) {
        const { city, neighborhood, street, state } = response.result;
        setFormData((prev) => ({
          ...prev,
          cidade: city || "",
          bairro: neighborhood || "",
          rua: street || "",
          estado: state || "",
        }));
      }
    } catch (error) {
      if ((error as Error)?.name === "AbortError") {
        console.error("CEP request timeout");
      } else {
        console.error("Erro ao buscar CEP:", error);
      }
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    let processedValue: string | number | boolean = value;

    if (name === "telefone") {
      processedValue = formatPhone(value);
    } else if (name === "cnpj") {
      processedValue = formatCnpj(value);
      const cleanCnpj = value.replace(/\D/g, "");
      if (cleanCnpj.length < 14) {
        setIsValidCnpj(null);
      }
    } else if (name === "quantidadeAnimais") {
      processedValue = value === "" ? 0 : parseInt(value) || 0;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (apiError) {
      setApiError(null);
    }

    if (name === "CEP" && value.replace(/\D/g, "").length === 8) {
      handleFetchCepData(value);
    }

    if (name === "cnpj" && value.replace(/\D/g, "").length === 14) {
      fetchCnpjData(value);
    }
  };

  const validateStep = (step: number) => {
    const newErrors = validateOngSignupStep(formData, step);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setApiError(null);

    try {
      const submitData = {
        name: formData.name,
        cnpj: formData.cnpj.replace(/\D/g, ""),
        email: formData.email,
        telefone: formData.telefone,
        descricao: formData.descricao,
        bairro: formData.bairro || null,
        rua: formData.rua || null,
        numero: formData.numero || null,
        cidade: formData.cidade || null,
        estado: formData.estado || null,
        complemento: formData.complemento || null,
        cep: formData.CEP || null,
        quantidadeAnimais: formData.quantidadeAnimais || null,
        responsavelTecnico: formData.responsavelTecnico,
        password: formData.password,
      };

      await signupOng(submitData);
      router.push(
        `/cadastro-sucesso?nome=${formatUrlParam(formData.name)}`
      );
    } catch (error) {
      const errorState = handleApiError(error, {
        409: "Uma ONG com este CNPJ ou e-mail já está cadastrada.",
        422: "Dados inválidos. Verifique os campos e tente novamente.",
      });
      setApiError(errorState);
    }
  };

  const renderStep1 = () => (
    <div className={styles.stepContent}>
      <div className={styles.inputGroup}>
        <label htmlFor="name">Nome da ONG *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Nome da organização"
          required
        />
        {errors.name && <span className={styles.error}>{errors.name}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <label htmlFor="cnpj">CNPJ *</label>
            {!isLoadingCnpj && isValidCnpj === false && (
              <span
                style={{
                  color: "var(--orange-capiba)",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Inválido
              </span>
            )}
          </div>
          <input
            type="text"
            id="cnpj"
            name="cnpj"
            value={formData.cnpj}
            onChange={handleInputChange}
            placeholder="00.000.000/0000-00"
            required
            disabled={isLoadingCnpj}
            style={
              isValidCnpj === false
                ? { borderColor: "var(--orange-capiba)" }
                : {}
            }
          />
          {errors.cnpj && <span className={styles.error}>{errors.cnpj}</span>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="telefone">Celular *</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleInputChange}
            placeholder="(11) 99999-9999"
            required
          />
          {errors.telefone && (
            <span className={styles.error}>{errors.telefone}</span>
          )}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="email">E-mail *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="contato@ong.com"
          required
        />
        {errors.email && <span className={styles.error}>{errors.email}</span>}
      </div>

      <div className={styles.inputGroup}>
        <div className={styles.labelWithCounter}>
          <label htmlFor="descricao">Descrição da ONG *</label>
          <span className={styles.characterCounter}>
            {formData.descricao.length}/500
          </span>
        </div>
        <textarea
          id="descricao"
          name="descricao"
          value={formData.descricao}
          onChange={handleInputChange}
          placeholder="Conte um pouco sobre a missão e trabalho da sua ONG (máximo 500 caracteres)"
          rows={4}
          className={styles.textarea}
          required
          maxLength={500}
        />
        {errors.descricao && (
          <span className={styles.error}>{errors.descricao}</span>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.stepContent}>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="CEP">CEP</label>
          <input
            type="text"
            id="CEP"
            name="CEP"
            value={formData.CEP}
            onChange={handleInputChange}
            placeholder="00000-000"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="estado">Estado</label>
          <input
            type="text"
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            placeholder="SP"
            disabled={isLoadingCep}
          />
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="cidade">Cidade</label>
        <input
          type="text"
          id="cidade"
          name="cidade"
          value={formData.cidade}
          onChange={handleInputChange}
          placeholder="Nome da cidade"
          disabled={isLoadingCep}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="rua">Rua</label>
          <input
            type="text"
            id="rua"
            name="rua"
            value={formData.rua}
            onChange={handleInputChange}
            placeholder="Nome da rua"
            disabled={isLoadingCep}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="numero">Número</label>
          <input
            type="text"
            id="numero"
            name="numero"
            value={formData.numero}
            onChange={handleInputChange}
            placeholder="123"
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="bairro">Bairro</label>
          <input
            type="text"
            id="bairro"
            name="bairro"
            value={formData.bairro}
            onChange={handleInputChange}
            placeholder="Nome do bairro"
            disabled={isLoadingCep}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="complemento">Complemento (opcional)</label>
          <input
            type="text"
            id="complemento"
            name="complemento"
            value={formData.complemento}
            onChange={handleInputChange}
            placeholder="Apt, sala, etc."
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.stepContent}>
      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="quantidadeAnimais">Quantidade de Animais</label>
          <input
            type="number"
            id="quantidadeAnimais"
            name="quantidadeAnimais"
            value={formData.quantidadeAnimais}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="responsavelTecnico">Responsável Técnico *</label>
          <input
            type="text"
            id="responsavelTecnico"
            name="responsavelTecnico"
            value={formData.responsavelTecnico}
            onChange={handleInputChange}
            placeholder="Nome do responsável técnico"
            required
          />
          {errors.responsavelTecnico && (
            <span className={styles.error}>{errors.responsavelTecnico}</span>
          )}
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="password">Senha *</label>
        <div className={styles.passwordInput}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Mínimo 8 caracteres"
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.password && (
          <span className={styles.error}>{errors.password}</span>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="confirmPassword">Confirmar senha *</label>
        <div className={styles.passwordInput}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirme sua senha"
            required
          />
          <button
            type="button"
            className={styles.passwordToggle}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
        {errors.confirmPassword && (
          <span className={styles.error}>{errors.confirmPassword}</span>
        )}
      </div>

      <div className={styles.checkboxGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            name="agreeToTerms"
            checked={formData.agreeToTerms}
            onChange={handleInputChange}
            className={styles.checkbox}
          />
          <span className={styles.checkboxText}>
            Eu concordo com os{" "}
            <Link href="/termos" className={styles.link}>
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link href="/privacidade" className={styles.link}>
              Política de Privacidade
            </Link>
          </span>
        </label>
        {errors.agreeToTerms && (
          <span className={styles.error}>{errors.agreeToTerms}</span>
        )}
      </div>
    </div>
  );

  const getStepContent = () => {
    switch (currentStep) {
      case 1:
        return {
          src: "/images/1StepSignup.png",
          alt: "Informações básicas da ONG",
          title: "Conte sobre sua ONG",
          description:
            "Registre os dados principais da sua organização. Essas informações ajudarão famílias a conhecer melhor o trabalho que vocês fazem.",
        };
      case 2:
        return {
          src: "/images/2StepSignup.png",
          alt: "Endereço da organização",
          title: "Onde vocês estão?",
          description:
            "Informe a localização da sua ONG para que adotantes próximos possam encontrar vocês facilmente.",
        };
      case 3:
        return {
          src: "/images/3StepSignup.png",
          alt: "Dados operacionais e acesso",
          title: "Finalize seu cadastro",
          description:
            "Complete as informações operacionais e crie seu acesso para começar a conectar animais com famílias amorosas.",
        };
      default:
        return {
          src: "/images/1StepSignup.png",
          alt: "Informações básicas da ONG",
          title: "Conte sobre sua ONG",
          description:
            "Registre os dados principais da sua organização. Essas informações ajudarão famílias a conhecer melhor o trabalho que vocês fazem.",
        };
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.imageContainer}>
          <Image
            src={getStepContent().src}
            alt={getStepContent().alt}
            width={310}
            height={310}
            objectPosition="start"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.contextText}>
          <h2>{getStepContent().title}</h2>
          <p>{getStepContent().description}</p>
        </div>
      </div>

      <div className={styles.rightSection}>
        <div className={styles.signupCard}>
          <div className={styles.header}>
            <h1>Cadastrar ONG</h1>
            <p>
              Passo {currentStep} de {steps.length}
            </p>
          </div>

          <div className={styles.stepIndicator}>
            {steps.map((step, index) => (
              <div key={step.id} className={styles.stepWrapper}>
                <div
                  className={`${styles.stepDot} ${
                    currentStep === step.id ? styles.active : ""
                  } ${currentStep > step.id ? styles.completed : ""}`}
                >
                  {currentStep > step.id ? <FaCheck /> : step.id}
                </div>
                <div className={styles.stepLabel}>
                  <span className={styles.stepTitle}>{step.title}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`${styles.stepLine} ${
                      currentStep > step.id ? styles.completed : ""
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <Error error={apiError} />

          <form className={styles.form}>
            {renderStepContent()}

            <div className={styles.navigation}>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  color="green"
                  size="medium"
                  onClick={handlePrevious}
                  icon={<FaArrowLeft />}
                  iconPosition="left"
                >
                  Voltar
                </Button>
              )}

              <div className={styles.spacer} />

              {currentStep < steps.length ? (
                <Button
                  variant="primary"
                  color="green"
                  size="medium"
                  onClick={handleNext}
                  icon={<FaArrowRight />}
                  iconPosition="right"
                  disabled={currentStep === 1 && isValidCnpj === false}
                >
                  Próximo
                </Button>
              ) : (
                <Button
                  variant="primary"
                  color="green"
                  size="large"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  {isLoading ? "Cadastrando ONG..." : "Cadastrar ONG"}
                </Button>
              )}
            </div>
          </form>

          <div className={styles.footer}>
            <p>
              Já tem uma conta?{" "}
              <Link href="/entrar" className={styles.loginLink}>
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
