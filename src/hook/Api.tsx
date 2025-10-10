import axios from "axios";

const baseUrl = process.env.NEXT_API_URL || "http://localhost:3333";
const withCredentials = process.env.NEXT_PUBLIC_WITH_CREDENTIALS !== "false";

const createApiInstance = () => {
  const instance = axios.create({
    baseURL: `${baseUrl}/`,
    timeout: 30000,
    withCredentials,
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          await instance.post("/user/auth/logout");
        } catch (logoutError) {
          return Promise.reject(logoutError);
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

let apiInstance: ReturnType<typeof createApiInstance> | null = null;

export const useApi = () => {
  if (!apiInstance) {
    apiInstance = createApiInstance();
  }
  return apiInstance;
};
