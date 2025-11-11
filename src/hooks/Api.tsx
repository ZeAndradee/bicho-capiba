import axios from "axios";

const baseUrl =
  process.env.NEXT_PUBLIC_API_URL || "https://bicho-capiba-back.onrender.com/";
const withCredentials = true;

const createApiInstance = () => {
  const instance = axios.create({
    baseURL: `${baseUrl}api`,
    timeout: 40000,
    withCredentials,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath !== '/entrar' && currentPath !== '/cadastrar' && currentPath !== '/') {
            window.location.href = '/entrar';
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

let apiInstance: ReturnType<typeof createApiInstance> | null = null;

export const getApiInstance = () => {
  if (!apiInstance) {
    apiInstance = createApiInstance();
  }
  return apiInstance;
};
