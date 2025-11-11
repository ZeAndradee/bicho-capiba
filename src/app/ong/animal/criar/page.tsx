"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createAnimal } from "@/services/Ong/Ong";
import { fetchAnimalFilters } from "@/services/Animals/Animal";
import { validateAnimalForm } from "@/validators/animal";
import {
  handleImageSelection,
  revokeImagePreview,
  blobToFile,
} from "@/utils/imageUpload";
import { formatAge } from "@/utils/formatters";
import { sexoData, porteOptions } from "@/data/animalData";
import { FaDog, FaCat, FaHorse, FaFeather, FaCarrot } from "react-icons/fa6";
import { FaMars, FaVenus } from "react-icons/fa";
import { FaBirthdayCake } from "react-icons/fa";
import Filter from "@/components/UI/Filter/Filter";
import {
  Save,
  ArrowLeft,
  Camera,
  X,
  Plus,
  Shield,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Info,
  Palette,
  Eye,
  MapPin,
  Ruler,
  Syringe,
  Heart,
  FileText,
  ImageIcon,
  Dog,
  Cat,
  Bird,
  Rabbit,
  Calendar,
  Shapes,
} from "lucide-react";
import Error from "@/components/UI/Error/Error";
import AnimalCard from "@/components/UI/AnimalsCard/AnimalCard";
import ImageCrop from "@/components/UI/ImageCrop/ImageCrop";
import styles from "./page.module.css";

const STEPS = [
  {
    id: 1,
    title: "Informações Básicas",
    icon: Info,
    description: "Nome, espécie, raça e sexo",
  },
  {
    id: 2,
    title: "Características Físicas",
    icon: Palette,
    description: "Idade, porte, cor e nascimento",
  },
  {
    id: 3,
    title: "Saúde",
    icon: Shield,
    description: "Vacinas e castração",
  },
  {
    id: 4,
    title: "Comportamento",
    icon: Users,
    description: "Sociabilidade e história",
  },
  {
    id: 5,
    title: "Fotos",
    icon: Camera,
    description: "Imagens do animal",
  },
  {
    id: 6,
    title: "Revisão",
    icon: Eye,
    description: "Conferir dados e visualizar",
  },
];

interface ImagePreview {
  id: string;
  preview: string;
  file: File;
}

interface AnimalData {
  especies: Array<{
    nome: string;
    racas: Array<{ nome: string }>;
  }>;
  cores: Array<{
    nome: string;
    hexadecimal: string;
  }>;
  vacinas: Array<{ nome: string }>;
}

export default function CreateAnimal() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [animalData, setAnimalData] = useState<AnimalData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const getEspeciesOptions = () => {
    if (!animalData) return [];

    const speciesIcons: Record<string, React.ReactElement> = {
      Cachorro: <FaDog />,
      Gato: <FaCat />,
      Equino: <FaHorse />,
      Coelho: <FaCarrot />,
      Roedor: <FaCarrot />,
    };

    return animalData.especies.map((especie) => ({
      value: especie.nome,
      label: especie.nome,
      icon: speciesIcons[especie.nome] || <FaDog />,
    }));
  };

  const getSexoOptions = () => {
    return sexoData.map((sexo) => ({
      value: sexo.value,
      label: sexo.label,
      icon: sexo.iconType === "male" ? <FaMars /> : <FaVenus />,
    }));
  };

  const getCoresOptions = () => {
    if (!animalData) return [];

    return animalData.cores.map((cor) => ({
      value: cor.nome,
      label: cor.nome,
      icon: (
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: cor.hexadecimal,
            border: cor.nome === "Branco" ? "1px solid #e5e5e5" : "none",
          }}
        ></div>
      ),
    }));
  };

  const getRacasOptions = (especieNome: string) => {
    if (!animalData) return [];

    const especie = animalData.especies.find((e) => e.nome === especieNome);
    if (!especie) return [];

    return especie.racas.map((raca) => ({
      value: raca.nome,
      label: raca.nome,
    }));
  };

  const getVacinasOptions = () => {
    if (!animalData) return [];

    const uniqueVacinas = Array.from(
      new Set(animalData.vacinas.map((v) => v.nome))
    );
    return uniqueVacinas;
  };
  const [currentStep, setCurrentStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [selectedVacinas, setSelectedVacinas] = useState<string[]>([]);
  const [isVacinado, setIsVacinado] = useState<boolean | null>(null);
  const [customRaca, setCustomRaca] = useState("");
  const [customCor, setCustomCor] = useState("");
  const [showCustomRaca, setShowCustomRaca] = useState(false);
  const [showCustomCor, setShowCustomCor] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [currentCropIndex, setCurrentCropIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState<{
    nome: string;
    sexo: string;
    porte: string;
    cor: string;
    especie: string;
    raca: string;
    data_nascimento: string;
    vacinas: string;
    castrado: boolean;
    necessidades_especiais: string;
    historia: string;
    sociavel_animal: boolean;
    sociavel_pessoa: boolean;
    images: File[];
  }>({
    nome: "",
    sexo: "",
    porte: "",
    cor: "",
    especie: "",
    raca: "",
    data_nascimento: "",
    vacinas: "",
    castrado: false,
    necessidades_especiais: "",
    historia: "",
    sociavel_animal: false,
    sociavel_pessoa: false,
    images: [],
  });


  useEffect(() => {
    const loadFilters = async () => {
      try {
        setIsLoadingData(true);
        const filters = await fetchAnimalFilters();
        setAnimalData(filters);
      } catch (error) {
        console.error("Error loading filters:", error);
        setApiError("Erro ao carregar dados. Tente recarregar a página.");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadFilters();
  }, []);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((img) => {
        if (img.preview) {
          revokeImagePreview(img.preview);
        }
      });
    };
  }, [imagePreviews]);

  const handleInputChange = (field: string, value: string | boolean | File[]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === "especie") {
      setFormData((prev) => ({
        ...prev,
        raca: "",
        vacinas: "",
      }));
      setSelectedVacinas([]);
      setIsVacinado(null);
      setShowCustomRaca(false);
      setCustomRaca("");
    }

    if (field === "raca") {
      if (value === "Outra Raça") {
        setShowCustomRaca(true);
      } else {
        setShowCustomRaca(false);
        setCustomRaca("");
      }
    }

    if (field === "cor") {
      if (value === "Outros") {
        setShowCustomCor(true);
      } else {
        setShowCustomCor(false);
        setCustomCor("");
      }
    }

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
  };

  const handleVacinadoChange = (vacinado: boolean) => {
    setIsVacinado(vacinado);
    if (!vacinado) {
      setSelectedVacinas([]);
      setFormData((prev) => ({
        ...prev,
        vacinas: "Não vacinado",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        vacinas: "",
      }));
    }
  };

  const handleVacinaToggle = (vacina: string) => {
    setSelectedVacinas((prev) => {
      const newVacinas = prev.includes(vacina)
        ? prev.filter((v) => v !== vacina)
        : [...prev, vacina];

      setFormData((prevFormData) => ({
        ...prevFormData,
        vacinas: newVacinas.join(", "),
      }));

      return newVacinas;
    });
  };

  const handleImageAdd = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setApiError("");

    const maxImages = 5;
    const currentImageCount = imagePreviews.length;

    if (currentCropIndex === null && currentImageCount >= maxImages) {
      setApiError(`Você pode adicionar no máximo ${maxImages} imagens.`);
      return;
    }

    const remainingSlots = maxImages - currentImageCount;
    const filesToProcess =
      currentCropIndex !== null ? 1 : Math.min(files.length, remainingSlots);

    for (let i = 0; i < filesToProcess; i++) {
      const file = files[i];
      const result = await handleImageSelection(file);

      if (result.success) {
        setImageToCrop(result.data.preview);
        if (currentCropIndex === null) {
          setCurrentCropIndex(imagePreviews.length + i);
        }
        return;
      } else {
        setApiError(result.error.message);
        break;
      }
    }

    if (currentCropIndex === null && files.length > remainingSlots) {
      setApiError(
        `Você pode adicionar no máximo ${maxImages} imagens. ${
          files.length - remainingSlots
        } imagem(s) não foram adicionadas.`
      );
    }

    if (event.target) {
      event.target.value = "";
    }
  };

  const handleCropComplete = (croppedBlob: Blob, croppedUrl: string) => {
    if (currentCropIndex !== null) {
      const fileName = `animal-image-${Date.now()}.jpg`;
      const croppedFile = blobToFile(croppedBlob, fileName, "image/jpeg");

      const newImage = {
        id: Date.now().toString(),
        preview: croppedUrl,
        file: croppedFile,
      };

      setImagePreviews((prev) => {
        if (currentCropIndex < prev.length) {
          const oldImage = prev[currentCropIndex];
          revokeImagePreview(oldImage.preview);
          const newPreviews = [...prev];
          newPreviews[currentCropIndex] = newImage;
          return newPreviews;
        } else {
          return [...prev, newImage];
        }
      });

      setFormData((prev) => {
        const newImages = [...(prev.images || [])];
        if (currentCropIndex < newImages.length) {
          newImages[currentCropIndex] = croppedFile;
        } else {
          newImages.push(croppedFile);
        }
        return {
          ...prev,
          images: newImages,
        };
      });
    }

    setImageToCrop(null);
    setCurrentCropIndex(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCropCancel = () => {
    setImageToCrop(null);
    setCurrentCropIndex(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleImageRemove = (imageId: string) => {
    setImagePreviews((prev) => {
      const imageToRemove = prev.find((img) => img.id === imageId);
      if (imageToRemove) {
        revokeImagePreview(imageToRemove.preview);

        setFormData((prevFormData) => ({
          ...prevFormData,
          images:
            prevFormData.images?.filter((_, index) => {
              const imgIndex = prev.findIndex((img) => img.id === imageId);
              return index !== imgIndex;
            }) || [],
        }));
      }
      return prev.filter((img) => img.id !== imageId);
    });
  };

  const handleImageClick = (imageId: string) => {
    const imageIndex = imagePreviews.findIndex((img) => img.id === imageId);
    if (imageIndex !== -1) {
      setCurrentCropIndex(imageIndex);
      fileInputRef.current?.click();
    }
  };

  const validateForm = (): boolean => {
    const finalFormData = {
      ...formData,
      raca: showCustomRaca ? customRaca : formData.raca,
      cor: showCustomCor ? customCor : formData.cor,
    };

    const errors = validateAnimalForm(finalFormData);
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = (): boolean => {
    const finalFormData = {
      ...formData,
      raca: showCustomRaca ? customRaca : formData.raca,
      cor: showCustomCor ? customCor : formData.cor,
    };

    const errors = validateAnimalForm(finalFormData);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setApiError("Por favor, corrija os erros no formulário antes de salvar.");
      return;
    }

    try {
      setIsSaving(true);
      setApiError("");

      const multipartData = new FormData();

      if (formData.images && formData.images.length > 0) {
        formData.images.forEach((file) => {
          multipartData.append("images", file);
        });
      }

      const finalFormData = {
        ...formData,
        raca: showCustomRaca ? customRaca : formData.raca,
        cor: showCustomCor ? customCor : formData.cor,
      };

      Object.keys(finalFormData).forEach((key) => {
        if (
          key !== "images" &&
          (finalFormData as Record<string, unknown>)[key] !== undefined &&
          (finalFormData as Record<string, unknown>)[key] !== null
        ) {
          const value = (finalFormData as Record<string, unknown>)[key];
          if (typeof value === "boolean") {
            multipartData.append(key, value.toString());
          } else if (typeof value === "number") {
            multipartData.append(key, value.toString());
          } else if (typeof value === "string" && value.trim() !== "") {
            multipartData.append(key, value);
          }
        }
      });

      await createAnimal(multipartData);
      router.push("/ong/dashboard");
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 422) {
        setApiError("Verifique os campos obrigatórios.");
      } else if (status === 413) {
        setApiError(
          "Imagens muito grandes. O tamanho máximo é 5MB por imagem."
        );
      } else {
        setApiError(
          "Erro ao cadastrar animal. Verifique sua conexão e tente novamente."
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleGoBack = () => {
    router.push("/ong/dashboard");
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (step: number) => {
    if (canAccessStep(step)) {
      setCurrentStep(step);
    }
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.nome &&
          formData.especie &&
          formData.raca &&
          formData.sexo
        );
      case 2:
        return !!(formData.data_nascimento && formData.porte && formData.cor);
      case 3:
        return true;
      case 4:
        return true;
      case 5:
        return true;
      case 6:
        return true;
      default:
        return false;
    }
  };

  const canAccessStep = (targetStep: number): boolean => {
    if (targetStep === 1) return true;

    for (let i = 1; i < targetStep; i++) {
      if (!isStepValid(i)) {
        return false;
      }
    }
    return true;
  };

  const getCardPreviewData = () => {
    const firstImage =
      imagePreviews.length > 0
        ? imagePreviews[0].preview
        : "/images/placeholder-animal.jpg";


    return {
      id: "preview",
      nome: formData.nome || "Nome do animal",
      image: firstImage,
      sexo: (formData.sexo === "Macho"
        ? "M"
        : formData.sexo === "Fêmea"
        ? "F"
        : "M") as "M" | "F",
      idade: formData.data_nascimento ? formatAge(formData.data_nascimento) : "Idade não informada",
      raca: {
        id: 0,
        nome: (showCustomRaca ? customRaca : formData.raca) || "Raça",
        especieId: 0,
      },
      distancia: "0km",
      bairroOng: user?.bairro || "Seu bairro",
      cidadeOng: user?.cidade || "Sua cidade",
      isFavorite: false,
    };
  };

  const availableRacas = formData.especie
    ? getRacasOptions(formData.especie)
    : [];
  const availableVacinas = getVacinasOptions();

  if (isLoading || isLoadingData) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderStepIndicator = () => (
    <div className={styles.stepIndicator}>
      {STEPS.map((step, index) => {
        const isCompleted = currentStep > step.id;
        const isCurrent = currentStep === step.id;
        const isClickable = canAccessStep(step.id);

        return (
          <div key={step.id} className={styles.stepItem}>
            <button
              className={`${styles.stepButton} ${
                isCompleted ? styles.stepCompleted : ""
              } ${isCurrent ? styles.stepCurrent : ""} ${
                !isClickable ? styles.stepDisabled : ""
              }`}
              onClick={() => isClickable && goToStep(step.id)}
              disabled={!isClickable}
            >
              {isCompleted ? <Check size={16} /> : <step.icon size={16} />}
            </button>
            <div className={styles.stepInfo}>
              <span className={styles.stepTitle}>{step.title}</span>
              <span className={styles.stepDescription}>{step.description}</span>
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`${styles.stepConnector} ${
                  isCompleted ? styles.stepConnectorCompleted : ""
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className={styles.container}>
      {imageToCrop && (
        <ImageCrop
          src={imageToCrop}
          onCropComplete={handleCropComplete}
          onCancel={handleCropCancel}
          aspectRatio="animalProfile"
        />
      )}

      <main className={styles.main}>
        <div className={styles.header}>
          <button onClick={handleGoBack} className={styles.backButton}>
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>

        {renderStepIndicator()}

        <div className={styles.stepContainer}>
          <div className={styles.contentLayout}>
            <div className={styles.stepContent}>
              <form onSubmit={handleSubmit} className={styles.formContainer}>
                {currentStep === 1 && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <Info className={styles.cardIcon} />
                      <h3 className={styles.cardTitle}>Informações Básicas</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Nome *</label>
                        <input
                          type="text"
                          className={`${styles.input} ${
                            fieldErrors.nome ? styles.inputWithError : ""
                          }`}
                          value={formData.nome}
                          onChange={(e) =>
                            handleInputChange("nome", e.target.value)
                          }
                          placeholder="Nome do animal"
                          maxLength={25}
                        />
                        {fieldErrors.nome && (
                          <span className={styles.inputError}>
                            {fieldErrors.nome}
                          </span>
                        )}
                      </div>

                      <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Espécie *</label>
                          <Filter
                            value={formData.especie}
                            onChange={(value) =>
                              handleInputChange("especie", value)
                            }
                            options={getEspeciesOptions()}
                            placeholder="Selecione a espécie"
                            className={
                              fieldErrors.especie
                                ? styles.dropdownWithError
                                : ""
                            }
                          />
                          {fieldErrors.especie && (
                            <span className={styles.inputError}>
                              {fieldErrors.especie}
                            </span>
                          )}
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Sexo *</label>
                          <Filter
                            value={formData.sexo}
                            onChange={(value) =>
                              handleInputChange("sexo", value)
                            }
                            options={getSexoOptions()}
                            placeholder="Selecione o sexo"
                            className={
                              fieldErrors.sexo ? styles.dropdownWithError : ""
                            }
                          />
                          {fieldErrors.sexo && (
                            <span className={styles.inputError}>
                              {fieldErrors.sexo}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Raça *</label>
                        <Filter
                          value={formData.raca}
                          onChange={(value) => handleInputChange("raca", value)}
                          options={availableRacas}
                          placeholder={
                            formData.especie
                              ? "Selecione a raça"
                              : "Selecione primeiro a espécie"
                          }
                          className={
                            fieldErrors.raca ? styles.dropdownWithError : ""
                          }
                        />
                        {fieldErrors.raca && (
                          <span className={styles.inputError}>
                            {fieldErrors.raca}
                          </span>
                        )}
                      </div>

                      {showCustomRaca && (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>
                            Especifique a raça *
                          </label>
                          <input
                            type="text"
                            className={styles.input}
                            value={customRaca}
                            onChange={(e) => setCustomRaca(e.target.value)}
                            placeholder="Digite a raça do animal"
                            maxLength={50}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <Palette className={styles.cardIcon} />
                      <h3 className={styles.cardTitle}>
                        Características Físicas
                      </h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Data de Nascimento *
                        </label>
                        <input
                          type="date"
                          className={`${styles.input} ${
                            fieldErrors.data_nascimento
                              ? styles.inputWithError
                              : ""
                          }`}
                          value={formData.data_nascimento || ""}
                          onChange={(e) =>
                            handleInputChange("data_nascimento", e.target.value)
                          }
                          max={new Date().toISOString().split("T")[0]}
                        />
                        {formData.data_nascimento && (
                          <div className={styles.ageDisplay}>
                            <FaBirthdayCake />
                            Idade: {formatAge(formData.data_nascimento)}
                          </div>
                        )}
                        {fieldErrors.data_nascimento && (
                          <span className={styles.inputError}>
                            {fieldErrors.data_nascimento}
                          </span>
                        )}
                      </div>

                      <div className={styles.inputRow}>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Porte *</label>
                          <Filter
                            value={formData.porte || ""}
                            onChange={(value) =>
                              handleInputChange("porte", value)
                            }
                            options={porteOptions}
                            placeholder="Selecione o porte"
                            className={
                              fieldErrors.porte ? styles.dropdownWithError : ""
                            }
                          />
                        </div>

                        <div className={styles.inputGroup}>
                          <label className={styles.label}>Cor *</label>
                          <Filter
                            value={formData.cor}
                            onChange={(value) =>
                              handleInputChange("cor", value)
                            }
                            options={getCoresOptions()}
                            placeholder="Selecione a cor"
                            className={
                              fieldErrors.cor ? styles.dropdownWithError : ""
                            }
                          />
                        </div>
                      </div>

                      {showCustomCor && (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>
                            Especifique a cor *
                          </label>
                          <input
                            type="text"
                            className={styles.input}
                            value={customCor}
                            onChange={(e) => setCustomCor(e.target.value)}
                            placeholder="Digite a cor do animal"
                            maxLength={50}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <Shield className={styles.cardIcon} />
                      <h3 className={styles.cardTitle}>Saúde</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Status de Vacinação
                        </label>
                        <div className={styles.radioGroup}>
                          <label className={styles.radioOption}>
                            <input
                              type="radio"
                              name="vacinado"
                              checked={isVacinado === true}
                              onChange={() => handleVacinadoChange(true)}
                              className={styles.radio}
                            />
                            <span className={styles.radioText}>Vacinado</span>
                          </label>
                          <label className={styles.radioOption}>
                            <input
                              type="radio"
                              name="vacinado"
                              checked={isVacinado === false}
                              onChange={() => handleVacinadoChange(false)}
                              className={styles.radio}
                            />
                            <span className={styles.radioText}>
                              Não vacinado
                            </span>
                          </label>
                        </div>
                      </div>

                      {isVacinado === true && (
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>
                            Vacinas Aplicadas
                          </label>
                          <div className={styles.vacinasGrid}>
                            {availableVacinas.map((vacina) => (
                              <label
                                key={vacina}
                                className={styles.vacinaOption}
                              >
                                <input
                                  type="checkbox"
                                  checked={selectedVacinas.includes(vacina)}
                                  onChange={() => handleVacinaToggle(vacina)}
                                  className={styles.checkbox}
                                />
                                <span className={styles.vacinaText}>
                                  {vacina}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Status de Castração
                        </label>
                        <div className={styles.radioGroup}>
                          <label className={styles.radioOption}>
                            <input
                              type="radio"
                              name="castrado"
                              checked={formData.castrado === true}
                              onChange={() =>
                                handleInputChange("castrado", true)
                              }
                              className={styles.radio}
                            />
                            <span className={styles.radioText}>Castrado</span>
                          </label>
                          <label className={styles.radioOption}>
                            <input
                              type="radio"
                              name="castrado"
                              checked={formData.castrado === false}
                              onChange={() =>
                                handleInputChange("castrado", false)
                              }
                              className={styles.radio}
                            />
                            <span className={styles.radioText}>
                              Não castrado
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Necessidades Especiais
                        </label>
                        <textarea
                          className={styles.textarea}
                          value={formData.necessidades_especiais || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "necessidades_especiais",
                              e.target.value
                            )
                          }
                          placeholder="Descreva necessidades especiais, se houver..."
                          rows={3}
                          maxLength={200}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <Users className={styles.cardIcon} />
                      <h3 className={styles.cardTitle}>Comportamento</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Sociabilidade</label>
                        <div className={styles.sociabilityGrid}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={formData.sociavel_animal || false}
                              onChange={(e) =>
                                handleInputChange(
                                  "sociavel_animal",
                                  e.target.checked
                                )
                              }
                              className={styles.checkbox}
                            />
                            <span className={styles.checkboxText}>
                              Sociável com animais
                            </span>
                          </label>

                          <label className={styles.checkboxLabel}>
                            <input
                              type="checkbox"
                              checked={formData.sociavel_pessoa || false}
                              onChange={(e) =>
                                handleInputChange(
                                  "sociavel_pessoa",
                                  e.target.checked
                                )
                              }
                              className={styles.checkbox}
                            />
                            <span className={styles.checkboxText}>
                              Sociável com pessoas
                            </span>
                          </label>
                        </div>
                      </div>

                      <div className={styles.inputGroup}>
                        <label className={styles.label}>História</label>
                        <textarea
                          className={styles.textarea}
                          value={formData.historia || ""}
                          onChange={(e) =>
                            handleInputChange("historia", e.target.value)
                          }
                          placeholder="Conte a história do animal..."
                          rows={4}
                          maxLength={1000}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {currentStep === 5 && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <Camera className={styles.cardIcon} />
                      <h3 className={styles.cardTitle}>Fotos</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.imagesContainer}>
                        {imagePreviews.map((image) => (
                          <div key={image.id} className={styles.imagePreview}>
                            <img
                              src={image.preview}
                              alt="Preview"
                              className={styles.previewImage}
                              onClick={() => handleImageClick(image.id)}
                              style={{ cursor: "pointer" }}
                            />
                            <button
                              type="button"
                              onClick={() => handleImageRemove(image.id)}
                              className={styles.removeImageButton}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}

                        {imagePreviews.length < 5 && (
                          <button
                            type="button"
                            onClick={handleImageAdd}
                            className={styles.addImageButton}
                          >
                            <Plus size={24} />
                            <span>Adicionar foto</span>
                          </button>
                        )}
                      </div>

                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        multiple
                        className={styles.fileInput}
                        aria-label="Selecionar imagens do animal"
                      />

                      <p className={styles.imageHelp}>
                        Adicione até 5 fotos do animal. Formatos aceitos: JPG,
                        PNG, WebP (máx. 5MB cada)
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 6 && (
                  <div className={styles.card}>
                    <div className={styles.cardHeader}>
                      <Eye className={styles.cardIcon} />
                      <h3 className={styles.cardTitle}>Revisão Final</h3>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.reviewSection}>
                        <h4 className={styles.reviewTitle}>
                          <Info size={20} /> Informações Básicas
                        </h4>
                        <div className={styles.reviewSummary}>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Info size={18} /> Nome:
                            </strong>{" "}
                            {formData.nome || "Não informado"}
                          </div>
                          <div className={styles.summaryItem}>
                            <strong>
                              {formData.especie === "Cachorros" ? (
                                <Dog size={18} />
                              ) : formData.especie === "Gatos" ? (
                                <Cat size={18} />
                              ) : formData.especie === "Roedores" ? (
                                <Rabbit size={18} />
                              ) : formData.especie === "Cobras" ? (
                                <Bird size={18} />
                              ) : (
                                <Info size={18} />
                              )}{" "}
                              Espécie:
                            </strong>{" "}
                            {formData.especie || "Não informado"}
                          </div>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Shapes size={18} /> Raça:
                            </strong>{" "}
                            {(showCustomRaca ? customRaca : formData.raca) ||
                              "Não informado"}
                          </div>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Info size={18} /> Sexo:
                            </strong>{" "}
                            {formData.sexo || "Não informado"}
                          </div>
                        </div>
                      </div>

                      <div className={styles.reviewSection}>
                        <h4 className={styles.reviewTitle}>
                          <Palette size={20} /> Características Físicas
                        </h4>
                        <div className={styles.reviewSummary}>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Calendar size={18} /> Idade:
                            </strong>{" "}
                            {formData.data_nascimento
                              ? formatAge(formData.data_nascimento)
                              : "Não informado"}
                          </div>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Palette size={18} /> Cor:
                            </strong>{" "}
                            {(showCustomCor ? customCor : formData.cor) ||
                              "Não informado"}
                          </div>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Ruler size={18} /> Porte:
                            </strong>{" "}
                            {formData.porte || "Não informado"}
                          </div>
                        </div>
                      </div>

                      <div className={styles.reviewSection}>
                        <h4 className={styles.reviewTitle}>
                          <Shield size={20} /> Saúde
                        </h4>
                        <div className={styles.reviewSummary}>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Shield size={18} /> Castrado:
                            </strong>{" "}
                            {formData.castrado === true
                              ? "Sim"
                              : formData.castrado === false
                              ? "Não"
                              : "Não informado"}
                          </div>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Syringe size={18} /> Vacinas:
                            </strong>{" "}
                            {formData.vacinas || "Nenhuma selecionada"}
                          </div>
                          {formData.necessidades_especiais && (
                            <div className={styles.summaryItem}>
                              <strong>
                                <Heart size={18} /> Necessidades Especiais:
                              </strong>{" "}
                              {formData.necessidades_especiais}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.reviewSection}>
                        <h4 className={styles.reviewTitle}>
                          <Users size={20} /> Comportamento
                        </h4>
                        <div className={styles.reviewSummary}>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Heart size={18} /> Sociável com animais:
                            </strong>{" "}
                            {formData.sociavel_animal ? "Sim" : "Não"}
                          </div>
                          <div className={styles.summaryItem}>
                            <strong>
                              <Users size={18} /> Sociável com pessoas:
                            </strong>{" "}
                            {formData.sociavel_pessoa ? "Sim" : "Não"}
                          </div>
                          {formData.historia && (
                            <div className={styles.summaryItem}>
                              <strong>
                                <FileText size={18} /> História:
                              </strong>{" "}
                              {formData.historia}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className={styles.reviewSection}>
                        <h4 className={styles.reviewTitle}>
                          <Camera size={20} /> Fotos e Localização
                        </h4>
                        <div className={styles.reviewSummary}>
                          <div className={styles.summaryItem}>
                            <strong>
                              <ImageIcon size={18} /> Fotos:
                            </strong>{" "}
                            {imagePreviews.length}{" "}
                            {imagePreviews.length === 1 ? "imagem" : "imagens"}
                          </div>
                          <div className={styles.summaryItem}>
                            <strong>
                              <MapPin size={18} /> Localização:
                            </strong>{" "}
                            {user && user.bairro && user.cidade
                              ? `${user.bairro}, ${user.cidade}`
                              : "Não informado"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {apiError && (
                  <Error
                    error={{ message: apiError }}
                    className={styles.errorBanner}
                  />
                )}

                <div className={styles.footer}>
                  <div className={styles.footerActions}>
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={prevStep}
                        className={styles.prevButton}
                      >
                        <ChevronLeft size={16} />
                        Anterior
                      </button>
                    )}

                    {currentStep < STEPS.length && (
                      <button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                        className={styles.nextButton}
                      >
                        Próximo
                        <ChevronRight size={16} />
                      </button>
                    )}

                    {currentStep === STEPS.length && (
                      <button
                        type="submit"
                        disabled={isSaving || !isFormValid()}
                        className={styles.saveButton}
                      >
                        {isSaving
                          ? "Salvando..."
                          : formData.nome
                          ? `Cadastrar ${formData.sexo === "F" ? "a" : "o"} ${
                              formData.nome.split(" ")[0]
                            }`
                          : "Cadastrar Animal"}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className={styles.previewSidebar}>
              <div className={styles.previewContainer}>
                <div className={styles.previewHeader}>
                  <Eye className={styles.previewIcon} />
                  <h3 className={styles.previewTitle}>Preview</h3>
                </div>
                <div className={styles.previewContent}>
                  <p className={styles.previewDescription}>
                    Como ficará no painel de adoção
                  </p>
                  <div className={styles.cardPreview}>
                    <AnimalCard {...getCardPreviewData()} isPreview />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
