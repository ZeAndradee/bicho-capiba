import { getApiInstance } from "@/hooks/Api";

const api = getApiInstance();

export interface FavoriteAnimal {
  uuid: string;
  nome: string;
  sexo: "M" | "F";
  porte: string;
  dataNascimento: string;
  castrado: number | null;
  necessidadesEspeciais: string | null;
  historia: string;
  statusAnimal: string;
  sociavelAnimal: number;
  sociavelPessoa: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  ong: {
    nome: string;
    email: string;
    telefone: string;
    bairro: string;
  };
  fotos: Array<{ url: string }>;
  raca: {
    uuid: string;
    nome: string;
  };
  especie: {
    uuid: string;
    nome: string;
  };
  cor: {
    uuid: string;
    nome: string;
    hexadecimal: string;
  };
  isLiked: boolean;
}

export interface AdoptionProcess {
  uuid: string;
  status: string;
  motivo?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  animal: {
    nome: string;
    uuid: string;
    dataNascimento: string;
    sexo: "M" | "F";
    porte: string;
    statusAnimal: string;
    fotos: Array<{ url: string }>;
    raca: {
      uuid: string;
      nome: string;
    };
    especie: {
      uuid: string;
      nome: string;
    };
    cor: {
      uuid: string;
      nome: string;
      hexadecimal: string;
    };
    ong: {
      nome: string;
      email: string;
      telefone: string;
    };
    isLiked: boolean;
  };
}

export interface UserDonation {
  id: string;
  ongNome: string;
  valor: number;
  data: string;
  status: "pending" | "completed" | "failed";
  mensagem?: string;
}

export const fetchUserFavorites = async (): Promise<FavoriteAnimal[]> => {
  try {
    const response = await api.get("/me/favorites");
    return response.data.result || response.data;
  } catch (error) {
    console.error("Error fetching user favorites:", error);
    throw error;
  }
};

export const fetchUserAdoptions = async (): Promise<AdoptionProcess[]> => {
  try {
    const response = await api.get("/adoptions");
    return response.data.result || [];
  } catch (error) {
    console.error("Error fetching user adoptions:", error);
    throw error;
  }
};

const mockDonations: UserDonation[] = [
  {
    id: "1",
    ongNome: "ONG Amor Animal",
    valor: 50.0,
    data: "2024-11-05T10:30:00Z",
    status: "completed",
    mensagem:
      "Que esse valor possa trazer um pouco mais de conforto e carinho para os peludinhos!",
  },
  {
    id: "2",
    ongNome: "Lar dos Bichos",
    valor: 100.0,
    data: "2024-10-20T15:45:00Z",
    status: "completed",
    mensagem:
      "Com muito amor para ajudar na alimentação e cuidados dos gatinhos!",
  },
  {
    id: "3",
    ongNome: "Cão Vida",
    valor: 25.0,
    data: "2024-11-08T09:20:00Z",
    status: "pending",
    mensagem:
      "Uma pequena ajuda para fazer a diferença na vida dos cãezinhos resgatados.",
  },
  {
    id: "4",
    ongNome: "Amigos dos Animais",
    valor: 75.0,
    data: "2024-09-15T12:00:00Z",
    status: "failed",
    mensagem:
      "Tentando contribuir para o trabalho incrível que vocês fazem. Espero poder ajudar em breve!",
  },
];

export const fetchUserDonations = async (): Promise<UserDonation[]> => {
  try {
    return mockDonations;
  } catch (error) {
    console.error("Error fetching user donations:", error);
    throw error;
  }
};

export const updateUserProfile = async (
  userData: Record<string, string | number | boolean | null | undefined>
) => {
  try {
    const response = await api.put("/users", userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
