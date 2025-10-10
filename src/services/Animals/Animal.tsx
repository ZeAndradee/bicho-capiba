import { getApiInstance } from "@/hook/Api";

export const fetchAnimals = async () => {
  try {
    const api = getApiInstance();
    const response = await api.get("/animal");
    return response.data;
  } catch (error) {
    console.error("Error fetching animals:", error);
    throw error;
  }
};
