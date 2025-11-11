"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AuthUser } from "@/services/Auth/Auth";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateOngProfile } from "@/services/Ong/Ong";
import { fetchCepData } from "@/services/Helpers/Helpers";
import { formatCep } from "@/utils/formatters";
import { handleImageSelection, revokeImagePreview } from "@/utils/imageUpload";
import { formatPhone } from "@/utils/formatters";
import { validateOngSignupStep } from "@/validators/auth/ongSignup";
import {
  Save,
  Check,
  Building,
  Heart,
  Phone,
  MapPin,
  RotateCcw,
} from "lucide-react";
import UserImage from "@/components/UI/UserImage/UserImage";
import Error from "@/components/UI/Error/Error";
import styles from "./page.module.css";

interface OngFormData extends Partial<AuthUser> {
  images?: Array<{ url: string }>;
  [key: string]:
    | string
    | number
    | boolean
    | null
    | undefined
    | Array<{ url: string }>;
}

export default function DashboardSettings() {
  const { user, isLoading, setUser } = useAuth();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<OngFormData>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/entrar");
      return;
    }

    if (user) {
      setFormData(user as OngFormData);
      setApiError("");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    return () => {
      if (imagePreview) {
        revokeImagePreview(imagePreview);
      }
    };
  }, [imagePreview]);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setApiError("");
    const result = await handleImageSelection(file);

    if (result.success) {
      if (imagePreview) {
        revokeImagePreview(imagePreview);
      }
      setImagePreview(result.data.preview);
      setSelectedFile(result.data.file);
      setHasChanges(true);
      setJustSaved(false);
    } else {
      setApiError(result.error.message);
    }
  };

  const handleFetchCepData = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    if (cleanCep.length !== 8) return;

    setIsLoadingCep(true);
    setApiError("");
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
        setHasChanges(true);
      }
    } catch (error: unknown) {
      const err = error as { name?: string; response?: { status?: number } };
      if (err?.name === "AbortError") {
        setApiError("Tempo limite excedido ao buscar CEP. Tente novamente.");
      } else if (err?.response?.status === 404) {
        setApiError("CEP não encontrado. Verifique o código postal informado.");
      } else {
        setApiError(
          "Erro ao buscar informações do CEP. Verifique sua conexão e tente novamente."
        );
      }
    } finally {
      setIsLoadingCep(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    let processedValue = value;

    if (field === "cep" && typeof value === "string") {
      processedValue = formatCep(value);
    }

    if (field === "telefone" && typeof value === "string") {
      processedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [field]: processedValue,
    }));
    setHasChanges(true);
    setJustSaved(false);

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    if (apiError) {
      setApiError("");
    }

    if (
      field === "cep" &&
      typeof value === "string" &&
      value.replace(/\D/g, "").length === 8
    ) {
      handleFetchCepData(value);
    }
  };

  const validateForm = (): boolean => {
    const validationData = {
      name: formData.nome || "",
      cnpj: formData.cnpj || "",
      email: formData.email || "",
      telefone: formData.telefone || "",
      descricao: formData.descricao || "",
      bairro: formData.bairro || "",
      rua: formData.rua || "",
      numero: formData.numero || "",
      cidade: formData.cidade || "",
      estado: formData.estado || "",
      complemento: formData.complemento || "",
      CEP: formData.cep || "",
      quantidadeAnimais: formData.quantidadeAnimais || 0,
      responsavelTecnico: formData.responsavelTecnico || "",
      password: "",
      confirmPassword: "",
      agreeToTerms: true,
    };

    const step1Errors = validateOngSignupStep(validationData, 1);
    const step2Errors = validateOngSignupStep(validationData, 2);
    const step3Errors = validateOngSignupStep(validationData, 3);

    const allErrors = { ...step1Errors, ...step2Errors, ...step3Errors };
    const mappedErrors: Record<string, string> = {};

    if (allErrors.name) mappedErrors.nome = allErrors.name;
    if (allErrors.telefone) mappedErrors.telefone = allErrors.telefone;
    if (allErrors.descricao) mappedErrors.descricao = allErrors.descricao;
    if (allErrors.CEP) mappedErrors.cep = allErrors.CEP;
    if (allErrors.bairro) mappedErrors.bairro = allErrors.bairro;
    if (allErrors.rua) mappedErrors.rua = allErrors.rua;
    if (allErrors.numero) mappedErrors.numero = allErrors.numero;
    if (allErrors.cidade) mappedErrors.cidade = allErrors.cidade;
    if (allErrors.estado) mappedErrors.estado = allErrors.estado;
    if (allErrors.complemento) mappedErrors.complemento = allErrors.complemento;
    if (allErrors.responsavelTecnico)
      mappedErrors.responsavelTecnico = allErrors.responsavelTecnico;
    if (allErrors.quantidadeAnimais)
      mappedErrors.quantidadeAnimais = allErrors.quantidadeAnimais;

    setFieldErrors(mappedErrors);
    return Object.keys(mappedErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      setApiError("Por favor, corrija os erros no formulário antes de salvar.");
      return;
    }

    try {
      setIsSaving(true);
      setApiError("");

      const multipartData = new FormData();

      if (selectedFile) {
        multipartData.append("images", selectedFile);
      }

      const excludeFields = [
        "uuid",
        "createdAt",
        "updatedAt",
        "avatar",
        "images",
      ];

      Object.keys(formData).forEach((key) => {
        if (
          formData[key] !== undefined &&
          formData[key] !== null &&
          !excludeFields.includes(key)
        ) {
          const value = formData[key];
          if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
          ) {
            multipartData.append(key, String(value));
          }
        }
      });

      await updateOngProfile(multipartData);
      setHasChanges(false);
      setSelectedFile(null);
      setImagePreview(null);
      setJustSaved(true);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 400) {
        setApiError("Dados inválidos. Verifique os campos e tente novamente.");
      } else if (err?.response?.status === 422) {
        setApiError("Verifique os campos obrigatórios.");
      } else if (err?.response?.status === 413) {
        setApiError("Imagem muito grande. O tamanho máximo é 5MB.");
      } else {
        setApiError(
          "Erro ao salvar configurações. Verifique sua conexão e tente novamente."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (user) {
      setFormData(user as OngFormData);
      setHasChanges(false);
      setApiError("");
      setFieldErrors({});
      if (imagePreview) {
        revokeImagePreview(imagePreview);
        setImagePreview(null);
      }
      setSelectedFile(null);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      {apiError && (
        <Error error={{ message: apiError }} className={styles.errorBanner} />
      )}
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Configurações</h1>
          <p className={styles.subtitle}>
            Mantenha as informações da sua ONG sempre atualizadas
          </p>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileCard}>
            <div className={styles.profileImageSection}>
              <div className={styles.profileImageContainer}>
                <UserImage
                  src={imagePreview || formData.images?.[0]?.url}
                  alt={formData.nome}
                  size="xl"
                  fallbackText={formData.nome}
                  className={styles.profileImage}
                  editable={true}
                  disabled={isSaving}
                  onClick={handleImageClick}
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageChange}
                  className={styles.fileInput}
                  aria-label="Selecionar imagem de perfil"
                />
              </div>
              <div className={styles.profileInfo}>
                <h2 className={styles.profileName}>
                  {formData.nome || "Sua ONG"}
                </h2>
                <p className={styles.profileType}>Organização</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.formContainer}>
          <div className={styles.formGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Building className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Informações da Organização</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Nome da ONG</label>
                  <input
                    type="text"
                    className={`${styles.input} ${
                      fieldErrors.nome ? styles.inputWithError : ""
                    }`}
                    value={formData.nome || ""}
                    onChange={(e) => handleInputChange("nome", e.target.value)}
                    placeholder="Nome da sua organização"
                  />
                  {fieldErrors.nome && (
                    <span className={styles.inputError}>
                      {fieldErrors.nome}
                    </span>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>CNPJ</label>
                  <input
                    type="text"
                    className={`${styles.input} ${styles.disabledInput}`}
                    value={formData.cnpj || ""}
                    placeholder="00.000.000/0000-00"
                    disabled
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Responsável Técnico</label>
                  <input
                    type="text"
                    className={`${styles.input} ${
                      fieldErrors.responsavelTecnico
                        ? styles.inputWithError
                        : ""
                    }`}
                    value={formData.responsavelTecnico || ""}
                    onChange={(e) =>
                      handleInputChange("responsavelTecnico", e.target.value)
                    }
                    placeholder="Nome do responsável"
                  />
                  {fieldErrors.responsavelTecnico && (
                    <span className={styles.inputError}>
                      {fieldErrors.responsavelTecnico}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Heart className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Animais</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Quantidade Atual</label>
                  <input
                    type="number"
                    className={`${styles.input} ${
                      fieldErrors.quantidadeAnimais ? styles.inputWithError : ""
                    }`}
                    value={formData.quantidadeAnimais || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "quantidadeAnimais",
                        parseInt(e.target.value) || 0
                      )
                    }
                    placeholder="0"
                    min="0"
                  />
                  {fieldErrors.quantidadeAnimais && (
                    <span className={styles.inputError}>
                      {fieldErrors.quantidadeAnimais}
                    </span>
                  )}
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Sobre a ONG</label>
                  <textarea
                    className={`${styles.textarea} ${
                      fieldErrors.descricao ? styles.inputWithError : ""
                    }`}
                    value={formData.descricao || ""}
                    onChange={(e) =>
                      handleInputChange("descricao", e.target.value)
                    }
                    placeholder="Conte sobre a missão, visão e trabalho da sua ONG..."
                    rows={4}
                  />
                  {fieldErrors.descricao && (
                    <span className={styles.inputError}>
                      {fieldErrors.descricao}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <Phone className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Contato</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Email</label>
                  <input
                    type="email"
                    className={`${styles.input} ${styles.disabledInput}`}
                    value={formData.email || ""}
                    placeholder="contato@suaong.org"
                    disabled
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Telefone</label>
                  <input
                    type="tel"
                    className={`${styles.input} ${
                      fieldErrors.telefone ? styles.inputWithError : ""
                    }`}
                    value={formData.telefone || ""}
                    onChange={(e) =>
                      handleInputChange("telefone", e.target.value)
                    }
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {fieldErrors.telefone && (
                    <span className={styles.inputError}>
                      {fieldErrors.telefone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <MapPin className={styles.cardIcon} />
                <h3 className={styles.cardTitle}>Localização</h3>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>CEP</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.cep || ""}
                      onChange={(e) => handleInputChange("cep", e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Estado</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.estado || ""}
                      onChange={(e) =>
                        handleInputChange("estado", e.target.value)
                      }
                      placeholder="SP"
                      disabled={isLoadingCep}
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Cidade</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.cidade || ""}
                    onChange={(e) =>
                      handleInputChange("cidade", e.target.value)
                    }
                    placeholder="Sua cidade"
                    disabled={isLoadingCep}
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Bairro</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.bairro || ""}
                    onChange={(e) =>
                      handleInputChange("bairro", e.target.value)
                    }
                    placeholder="Seu bairro"
                    disabled={isLoadingCep}
                  />
                </div>
                <div className={styles.inputRow}>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Rua</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.rua || ""}
                      onChange={(e) => handleInputChange("rua", e.target.value)}
                      placeholder="Nome da rua"
                      disabled={isLoadingCep}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label className={styles.label}>Número</label>
                    <input
                      type="text"
                      className={styles.input}
                      value={formData.numero || ""}
                      onChange={(e) =>
                        handleInputChange("numero", e.target.value)
                      }
                      placeholder="123"
                    />
                  </div>
                </div>
                <div className={styles.inputGroup}>
                  <label className={styles.label}>Complemento</label>
                  <input
                    type="text"
                    className={styles.input}
                    value={formData.complemento || ""}
                    onChange={(e) =>
                      handleInputChange("complemento", e.target.value)
                    }
                    placeholder="Apartamento, sala, etc. (opcional)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <div className={styles.footerActions}>
            <button
              onClick={handleReset}
              disabled={isSaving || !hasChanges}
              className={styles.resetButton}
            >
              <RotateCcw size={16} />
              Redefinir
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || (!hasChanges && !justSaved)}
              className={`${styles.saveButton} ${
                hasChanges ? styles.hasChanges : ""
              } ${justSaved ? styles.saved : ""}`}
            >
              {justSaved ? (
                <>
                  <Check size={16} />
                  Salvo!
                </>
              ) : (
                <>
                  <Save size={16} />
                  {isSaving ? "Salvando..." : "Salvar Alterações"}
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
