"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserProfile } from "@/services/User/User";
import { formatPhone } from "@/utils/formatters";
import {
  Save,
  Check,
  User,
  MapPin,
  Heart,
  RotateCcw,
  Home,
  PawPrint,
  Users,
} from "lucide-react";
import Error from "@/components/UI/Error/Error";
import styles from "./page.module.css";

type TabType = "personal" | "address" | "adoption";

export default function UserSettings() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<{
    fullName?: string | null;
    email?: string | null;
    telefone?: string | null;
    dataNascimento?: string | null;
    cpf?: string | null;
    rua?: string | null;
    numero?: string | null;
    complemento?: string | null;
    bairro?: string | null;
    cidade?: string | null;
    estado?: string | null;
    cep?: string | null;
    tipoResidencia?: string | null;
    quantidadeMoradores?: number | null;
    possuiAnimais?: number | null;
    quantidadeAnimais?: number | null;
    sexoAnimais?: string | null;
    idadeAnimais?: string | null;
    experienciaComAnimais?: number | null;
    conhecimentoDespesasAnimais?: number | null;
    comportamentoAnimais?: string | null;
    possuiCriancas?: number | null;
    quantidadeCriancas?: number | null;
    faixaEtariaCriancas?: string | null;
    criancaNecessidadeEspecial?: number | null;
    tipoNecessidadeCriancas?: string | null;
    familiarNecessidadeEspecial?: number | null;
    tipoNecessidadeEspecialFamiliar?: string | null;
    areaExterna?: number | null;
    telaProtetora?: number | null;
    tempoDisponivel?: string | null;
    composicaoFamiliar?: string | null;
  }>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [apiError, setApiError] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData(user);
      setApiError("");
    }
  }, [user]);

  useEffect(() => {
    if (apiError) {
      const timer = setTimeout(() => {
        setApiError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [apiError]);

  const handleInputChange = (
    field: string,
    value: string | number | boolean
  ) => {
    let processedValue = value;

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
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setApiError("");

      const updateData = {
        ...formData,
        dataNascimento: formData.dataNascimento || null,
      };

      await updateUserProfile(updateData);
      setHasChanges(false);
      setJustSaved(true);
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      if (err?.response?.status === 400) {
        setApiError("Dados inválidos. Verifique os campos e tente novamente.");
      } else if (err?.response?.status === 422) {
        setApiError("Verifique os campos obrigatórios.");
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
      setFormData(user);
      setHasChanges(false);
      setApiError("");
      setFieldErrors({});
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
          <h1 className={styles.title}>Configurações do Perfil</h1>
          <p className={styles.subtitle}>
            Mantenha suas informações sempre atualizadas
          </p>
        </div>

        <div className={styles.tabsContainer}>
          <button
            className={`${styles.tab} ${
              activeTab === "personal" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("personal")}
          >
            <User size={20} />
            Informações Pessoais
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "address" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("address")}
          >
            <MapPin size={20} />
            Endereço
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "adoption" ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab("adoption")}
          >
            <Heart size={20} />
            Informações Adoção
          </button>
        </div>

        <div className={styles.formContainer}>
          {activeTab === "personal" && (
            <div className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Dados Pessoais</h2>
                <div className={styles.card}>
                  <div className={styles.cardContent}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Nome Completo</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.fullName || ""}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="Seu nome completo"
                      />
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Email</label>
                      <input
                        type="email"
                        className={`${styles.input} ${styles.disabledInput}`}
                        value={formData.email || ""}
                        placeholder="seu@email.com"
                        disabled
                      />
                      <span className={styles.helperText}>
                        O email não pode ser alterado
                      </span>
                    </div>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Data de Nascimento
                        </label>
                        <input
                          type="date"
                          className={styles.input}
                          value={formData.dataNascimento?.split("T")[0] || ""}
                          onChange={(e) =>
                            handleInputChange("dataNascimento", e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>Celular</label>
                        <input
                          type="tel"
                          className={styles.input}
                          value={formData.telefone || ""}
                          onChange={(e) =>
                            handleInputChange("telefone", e.target.value)
                          }
                          placeholder="(11) 99999-9999"
                          maxLength={15}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "address" && (
            <div className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Endereço Residencial</h2>
                <div className={styles.card}>
                  <div className={styles.cardContent}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>CEP</label>
                      <input
                        type="text"
                        className={styles.input}
                        value={formData.cep || ""}
                        onChange={(e) =>
                          handleInputChange("cep", e.target.value)
                        }
                        placeholder="00000-000"
                        maxLength={9}
                      />
                    </div>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup} style={{ flex: 2 }}>
                        <label className={styles.label}>Rua</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={formData.rua || ""}
                          onChange={(e) =>
                            handleInputChange("rua", e.target.value)
                          }
                          placeholder="Nome da rua"
                        />
                      </div>
                      <div className={styles.inputGroup} style={{ flex: 1 }}>
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
                        placeholder="Apto, bloco, etc (opcional)"
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
                        placeholder="Bairro"
                      />
                    </div>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup} style={{ flex: 2 }}>
                        <label className={styles.label}>Cidade</label>
                        <input
                          type="text"
                          className={styles.input}
                          value={formData.cidade || ""}
                          onChange={(e) =>
                            handleInputChange("cidade", e.target.value)
                          }
                          placeholder="Cidade"
                        />
                      </div>
                      <div className={styles.inputGroup} style={{ flex: 1 }}>
                        <label className={styles.label}>Estado</label>
                        <select
                          className={styles.input}
                          value={formData.estado || ""}
                          onChange={(e) =>
                            handleInputChange("estado", e.target.value)
                          }
                        >
                          <option value="">Selecione</option>
                          <option value="AC">AC</option>
                          <option value="AL">AL</option>
                          <option value="AP">AP</option>
                          <option value="AM">AM</option>
                          <option value="BA">BA</option>
                          <option value="CE">CE</option>
                          <option value="DF">DF</option>
                          <option value="ES">ES</option>
                          <option value="GO">GO</option>
                          <option value="MA">MA</option>
                          <option value="MT">MT</option>
                          <option value="MS">MS</option>
                          <option value="MG">MG</option>
                          <option value="PA">PA</option>
                          <option value="PB">PB</option>
                          <option value="PR">PR</option>
                          <option value="PE">PE</option>
                          <option value="PI">PI</option>
                          <option value="RJ">RJ</option>
                          <option value="RN">RN</option>
                          <option value="RS">RS</option>
                          <option value="RO">RO</option>
                          <option value="RR">RR</option>
                          <option value="SC">SC</option>
                          <option value="SP">SP</option>
                          <option value="SE">SE</option>
                          <option value="TO">TO</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "adoption" && (
            <div className={styles.tabContent}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Perfil do Adotante</h2>

                <div className={styles.adoptionCard}>
                  <h3 className={styles.adoptionCardTitle}>
                    <Home size={20} />
                    Informações da Residência
                  </h3>
                  <div className={styles.cardContent}>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Tipo de Residência
                        </label>
                        <select
                          className={styles.input}
                          value={formData.tipoResidencia || ""}
                          onChange={(e) =>
                            handleInputChange("tipoResidencia", e.target.value)
                          }
                        >
                          <option value="">Selecione</option>
                          <option value="casa">Casa</option>
                          <option value="apartamento">Apartamento</option>
                          <option value="sitio">Sítio/Chácara</option>
                          <option value="outros">Outros</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Quantidade de Moradores
                        </label>
                        <input
                          type="number"
                          className={styles.input}
                          value={formData.quantidadeMoradores || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "quantidadeMoradores",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          min="1"
                        />
                      </div>
                    </div>
                    <div className={styles.inputRow}>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Possui Área Externa?
                        </label>
                        <select
                          className={styles.input}
                          value={
                            formData.areaExterna === null
                              ? ""
                              : formData.areaExterna === 1
                              ? "1"
                              : "0"
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "areaExterna",
                              parseInt(e.target.value)
                            )
                          }
                        >
                          <option value="">Selecione</option>
                          <option value="1">Sim</option>
                          <option value="0">Não</option>
                        </select>
                      </div>
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Possui Tela Protetora?
                        </label>
                        <select
                          className={styles.input}
                          value={
                            formData.telaProtetora === null
                              ? ""
                              : formData.telaProtetora === 1
                              ? "1"
                              : "0"
                          }
                          onChange={(e) =>
                            handleInputChange(
                              "telaProtetora",
                              parseInt(e.target.value)
                            )
                          }
                        >
                          <option value="">Selecione</option>
                          <option value="1">Sim</option>
                          <option value="0">Não</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.adoptionCard}>
                  <h3 className={styles.adoptionCardTitle}>
                    <PawPrint size={20} />
                    Experiência com Animais
                  </h3>
                  <div className={styles.cardContent}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Já possui animais?</label>
                      <select
                        className={styles.input}
                        value={
                          formData.possuiAnimais === null
                            ? ""
                            : formData.possuiAnimais === 1
                            ? "1"
                            : "0"
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "possuiAnimais",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="1">Sim</option>
                        <option value="0">Não</option>
                      </select>
                    </div>
                    {formData.possuiAnimais === 1 && (
                      <>
                        <div className={styles.inputRow}>
                          <div className={styles.inputGroup}>
                            <label className={styles.label}>Quantidade</label>
                            <input
                              type="number"
                              className={styles.input}
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
                          </div>
                          <div className={styles.inputGroup}>
                            <label className={styles.label}>
                              Sexo dos Animais
                            </label>
                            <select
                              className={styles.input}
                              value={formData.sexoAnimais || ""}
                              onChange={(e) =>
                                handleInputChange("sexoAnimais", e.target.value)
                              }
                            >
                              <option value="">Selecione</option>
                              <option value="machos">Apenas Machos</option>
                              <option value="femeas">Apenas Fêmeas</option>
                              <option value="ambos">Ambos</option>
                            </select>
                          </div>
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>
                            Idade dos Animais
                          </label>
                          <input
                            type="text"
                            className={styles.input}
                            value={formData.idadeAnimais || ""}
                            onChange={(e) =>
                              handleInputChange("idadeAnimais", e.target.value)
                            }
                            placeholder="Ex: 2 anos e 5 anos"
                          />
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>
                            Comportamento dos Animais
                          </label>
                          <input
                            type="text"
                            className={styles.input}
                            value={formData.comportamentoAnimais || ""}
                            onChange={(e) =>
                              handleInputChange(
                                "comportamentoAnimais",
                                e.target.value
                              )
                            }
                            placeholder="Ex: Dóceis, Sociáveis"
                          />
                        </div>
                      </>
                    )}
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Experiência com Animais
                      </label>
                      <select
                        className={styles.input}
                        value={
                          formData.experienciaComAnimais === null
                            ? ""
                            : formData.experienciaComAnimais
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "experienciaComAnimais",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="0">Nenhuma experiência</option>
                        <option value="1">Pouca experiência</option>
                        <option value="2">Experiência moderada</option>
                        <option value="3">Muita experiência</option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Conhecimento sobre Despesas com Animais
                      </label>
                      <select
                        className={styles.input}
                        value={
                          formData.conhecimentoDespesasAnimais === null
                            ? ""
                            : formData.conhecimentoDespesasAnimais
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "conhecimentoDespesasAnimais",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="0">Nenhum conhecimento</option>
                        <option value="1">Conhecimento básico</option>
                        <option value="2">Conhecimento moderado</option>
                        <option value="3">Conhecimento avançado</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className={styles.adoptionCard}>
                  <h3 className={styles.adoptionCardTitle}>
                    <Users size={20} />
                    Família e Disponibilidade
                  </h3>
                  <div className={styles.cardContent}>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>Possui Crianças?</label>
                      <select
                        className={styles.input}
                        value={
                          formData.possuiCriancas === null
                            ? ""
                            : formData.possuiCriancas === 1
                            ? "1"
                            : "0"
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "possuiCriancas",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="1">Sim</option>
                        <option value="0">Não</option>
                      </select>
                    </div>
                    {formData.possuiCriancas === 1 && (
                      <>
                        <div className={styles.inputRow}>
                          <div className={styles.inputGroup}>
                            <label className={styles.label}>
                              Quantidade de Crianças
                            </label>
                            <input
                              type="number"
                              className={styles.input}
                              value={formData.quantidadeCriancas || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "quantidadeCriancas",
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="0"
                              min="0"
                            />
                          </div>
                          <div className={styles.inputGroup}>
                            <label className={styles.label}>
                              Faixa Etária das Crianças
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              value={formData.faixaEtariaCriancas || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "faixaEtariaCriancas",
                                  e.target.value
                                )
                              }
                              placeholder="Ex: 0-5 anos, variadas"
                            />
                          </div>
                        </div>
                        <div className={styles.inputGroup}>
                          <label className={styles.label}>
                            Criança com Necessidade Especial?
                          </label>
                          <select
                            className={styles.input}
                            value={
                              formData.criancaNecessidadeEspecial === null
                                ? ""
                                : formData.criancaNecessidadeEspecial === 1
                                ? "1"
                                : "0"
                            }
                            onChange={(e) =>
                              handleInputChange(
                                "criancaNecessidadeEspecial",
                                parseInt(e.target.value)
                              )
                            }
                          >
                            <option value="">Selecione</option>
                            <option value="1">Sim</option>
                            <option value="0">Não</option>
                          </select>
                        </div>
                        {formData.criancaNecessidadeEspecial === 1 && (
                          <div className={styles.inputGroup}>
                            <label className={styles.label}>
                              Tipo de Necessidade Especial
                            </label>
                            <input
                              type="text"
                              className={styles.input}
                              value={formData.tipoNecessidadeCriancas || ""}
                              onChange={(e) =>
                                handleInputChange(
                                  "tipoNecessidadeCriancas",
                                  e.target.value
                                )
                              }
                              placeholder="Ex: Autismo, TDAH"
                            />
                          </div>
                        )}
                      </>
                    )}
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Familiar com Necessidade Especial?
                      </label>
                      <select
                        className={styles.input}
                        value={
                          formData.familiarNecessidadeEspecial === null
                            ? ""
                            : formData.familiarNecessidadeEspecial === 1
                            ? "1"
                            : "0"
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "familiarNecessidadeEspecial",
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="1">Sim</option>
                        <option value="0">Não</option>
                      </select>
                    </div>
                    {formData.familiarNecessidadeEspecial === 1 && (
                      <div className={styles.inputGroup}>
                        <label className={styles.label}>
                          Tipo de Necessidade Especial do Familiar
                        </label>
                        <input
                          type="text"
                          className={styles.input}
                          value={formData.tipoNecessidadeEspecialFamiliar || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "tipoNecessidadeEspecialFamiliar",
                              e.target.value
                            )
                          }
                          placeholder="Ex: Deficiência Visual, Mobilidade Reduzida"
                        />
                      </div>
                    )}
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Tempo Disponível para o Animal
                      </label>
                      <select
                        className={styles.input}
                        value={formData.tempoDisponivel || ""}
                        onChange={(e) =>
                          handleInputChange("tempoDisponivel", e.target.value)
                        }
                      >
                        <option value="">Selecione</option>
                        <option value="poucas-horas">
                          Poucas horas por dia
                        </option>
                        <option value="meio-periodo">Meio período</option>
                        <option value="periodo-integral">
                          Período integral
                        </option>
                        <option value="fins-de-semana">
                          Principalmente fins de semana
                        </option>
                      </select>
                    </div>
                    <div className={styles.inputGroup}>
                      <label className={styles.label}>
                        Composição Familiar
                      </label>
                      <textarea
                        className={styles.textarea}
                        value={formData.composicaoFamiliar || ""}
                        onChange={(e) =>
                          handleInputChange(
                            "composicaoFamiliar",
                            e.target.value
                          )
                        }
                        placeholder="Descreva a composição da sua família (Ex: Casal com 2 filhos, Mora sozinho, etc)"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerActions}>
            <button
              onClick={handleReset}
              disabled={isSaving || !hasChanges}
              className={styles.resetButton}
            >
              <RotateCcw size={16} />
              Desfazer Alterações
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
                  Salvo com sucesso!
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
