import { getApiInstance } from "@/hooks/Api";

export interface CepData {
  city: string;
  neighborhood: string;
  street: string;
  state: string;
}

export interface CepResponse {
  status: string;
  result: CepData;
}

export interface CnpjResponse {
  status: string;
  result: boolean;
}

const api = getApiInstance();

export const validateCnpj = async (cnpj: string): Promise<CnpjResponse> => {
  const response = await api.get(`/helpers/cnpj/${cnpj}`);
  return response.data;
};

export const fetchCepData = async (cep: string): Promise<CepResponse> => {
  const response = await api.get(`/helpers/cep/${cep}`);
  return response.data;
};