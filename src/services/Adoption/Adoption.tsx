import { getApiInstance } from "@/hooks/Api";

const api = getApiInstance();

export type AdoptionStatus = "pendente" | "aprovado" | "rejeitado";

export interface AdoptionFormPayload {
  animal_id: string;
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

export interface Adopter {
  uuid: string;
  fullName: string;
  email: string;
  telefone: string | null;
  dataNascimento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  tipoResidencia: string | null;
  areaExterna: boolean | number | null;
  telaProtetora: boolean | number | null;
  composicaoFamiliar: string | null;
  quantidadeMoradores: number | null;
  possuiCriancas: boolean | number | null;
  quantidadeCriancas: number | null;
  faixaEtariaCriancas: string | null;
  criancaNecessidadeEspecial: boolean | number | null;
  tipoNecessidadeCriancas: string | null;
  familiarNecessidadeEspecial: boolean | number | null;
  tipoNecessidadeEspecialFamiliar: string | null;
  possuiAnimais: boolean | number | null;
  quantidadeAnimais: number | null;
  idadeAnimais: string | null;
  sexoAnimais: string | null;
  experienciaComAnimais: boolean | number | null;
  comportamentoAnimais: string | null;
  conhecimentoDespesasAnimais: boolean | number | null;
  tempoDisponivel: string | null;
}

export interface OngAdoptionRequest {
  uuid: string;
  status: AdoptionStatus;
  motivo: string | null;
  createdAt: string;
  updatedAt: string;
  animal: {
    uuid: string;
    nome: string;
    sexo: "M" | "F";
    porte: string;
    dataNascimento: string | null;
    statusAnimal: "Disponivel" | "Pendente" | "Adotado";
    fotos: Array<{ url: string }>;
    raca?: { nome: string } | null;
    especie?: { nome: string } | null;
  };
  usuario: Adopter;
}

export interface AdoptionCounts {
  pendente: number;
  aprovado: number;
  rejeitado: number;
}

export interface OngAdoptionsResponse {
  requests: OngAdoptionRequest[];
  counts: AdoptionCounts;
  pagination: {
    page: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
}

export interface UpdateAdoptionPayload {
  status: "aprovado" | "rejeitado";
  motivo?: string;
}

export const fetchAdopterProfile = async (): Promise<Partial<Adopter>> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const createAdoption = async (payload: AdoptionFormPayload) => {
  const response = await api.post("/adoptions", payload);
  return response.data.result;
};

export const fetchOngAdoptions = async (
  status: AdoptionStatus,
  page: number = 1,
  limit: number = 10
): Promise<OngAdoptionsResponse> => {
  const response = await api.get("/adoptions", {
    params: { status, page, limit },
  });

  return {
    requests: response.data.result || [],
    counts: response.data.counts || { pendente: 0, aprovado: 0, rejeitado: 0 },
    pagination: response.data.pagination,
  };
};

export const updateAdoptionStatus = async (
  adoptionId: string,
  payload: UpdateAdoptionPayload
): Promise<OngAdoptionRequest> => {
  const response = await api.put(`/adoptions/${adoptionId}`, payload);
  return response.data.result;
};
