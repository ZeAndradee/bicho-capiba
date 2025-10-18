import { getApiInstance } from "@/hooks/Api";

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatar?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

const api = getApiInstance();

export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const me = async (): Promise<User> => {
  const response = await api.get("/auth/me");
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post("/auth/logout");
};
