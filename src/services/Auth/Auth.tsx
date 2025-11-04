import { getApiInstance } from "@/hooks/Api";

export interface BaseUser {
  uuid: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface User extends BaseUser {
  fullName: string;
  dataNascimento?: string | null;
  endereco?: string | null;
  telefone?: string | null;
  superUser: boolean;
}

export interface Ong extends BaseUser {
  nome: string;
  cnpj: string;
  telefone: string;
  descricao: string;
  bairro: string;
  rua: string;
  numero: string;
  cidade: string;
  estado: string;
  complemento?: string;
  cep?: string;
  quantidadeAnimais: number;
  responsavelTecnico: string;
  latitude?: number | null;
  longitude?: number | null;
}

export type AuthUser = User | Ong;

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  fullName: string;
  email: string;
  password: string;
}

export interface OngSignupData {
  name: string;
  cnpj: string;
  email: string;
  telefone: string;
  descricao: string;
  bairro: string | null;
  rua: string | null;
  numero: string | null;
  cidade: string | null;
  estado: string | null;
  complemento: string | null;
  cep: string | null;
  quantidadeAnimais: number | null;
  responsavelTecnico: string;
  password: string;
}

export interface SignupResponse {
  user: AuthUser;
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

const api = getApiInstance();

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const me = async (): Promise<AuthUser> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const signup = async (data: SignupData): Promise<SignupResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const signupOng = async (
  data: OngSignupData
): Promise<SignupResponse> => {
  const response = await api.post("/ongs", data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
