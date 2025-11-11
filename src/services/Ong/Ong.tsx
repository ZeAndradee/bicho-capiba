import { getApiInstance } from "@/hooks/Api";

const api = getApiInstance();

export interface OngAnimal {
  uuid: string;
  nome: string;
  sexo: "M" | "F";
  porte: "Pequeno" | "Medio" | "Grande";
  dataNascimento: string;
  castrado: number | null;
  necessidadesEspeciais: string | null;
  historia: string;
  statusAnimal: "Disponivel" | "Pendente" | "Adotado";
  sociavelAnimal: number;
  sociavelPessoa: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  fotos: Array<{ url: string }>;
  isLiked: boolean;
}

export interface OngStats {
  totalAnimals: number;
  adoptedThisMonth: number;
  totalDonations: number;
  activeAdoptions: number;
}

export interface OngAnimalsResponse {
  status: string;
  result: OngAnimal[];
  error: string | null;
}

export interface OngProfile {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  telefone: string;
  descricao: string;
  bairro: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  complemento?: string;
  cep: string;
  quantidadeAnimais: number;
  responsavelTecnico: string;
  avatar?: string;
}

export const fetchOngAnimals = async (): Promise<OngAnimalsResponse> => {
  try {
    const response = await api.get("/ongs/animals");
    return response.data;
  } catch (error) {
    console.error("Error fetching ONG animals:", error);
    throw error;
  }
};

export const fetchOngStats = async (): Promise<OngStats> => {
  try {
    const response = await api.get("/stats");
    return response.data;
  } catch (error) {
    console.error("Error fetching ONG stats:", error);
    throw error;
  }
};

export const fetchOngProfile = async (): Promise<OngProfile> => {
  try {
    const response = await api.get("/profile");
    return response.data;
  } catch (error) {
    console.error("Error fetching ONG profile:", error);
    throw error;
  }
};

export const updateOngProfile = async (data: object) => {
  try {
    const response = await api.put("/ongs", data);
    return response.data;
  } catch (error) {
    console.error("Error updating ONG profile:", error);
    throw error;
  }
};

export const createAnimal = async (
  animalData: FormData
): Promise<OngAnimal> => {
  try {
    const response = await api.post("/animals", animalData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating animal:", error);
    throw error;
  }
};

export const updateAnimal = async (
  id: string,
  animalData: Partial<OngAnimal>
): Promise<OngAnimal> => {
  try {
    const response = await api.put(`/ongs/animals/${id}`, animalData);
    return response.data;
  } catch (error) {
    console.error("Error updating animal:", error);
    throw error;
  }
};

export const deleteAnimal = async (id: string): Promise<void> => {
  try {
    await api.delete(`/ongs/animals/${id}`);
  } catch (error) {
    console.error("Error deleting animal:", error);
    throw error;
  }
};
