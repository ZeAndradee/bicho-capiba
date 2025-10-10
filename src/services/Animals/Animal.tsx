import { useApi } from "@/hook/Api";

const api = useApi();

export const fetchAnimals = async () => {
  try {
    const response = await api.get("/animal");
    return response.data;
  } catch (error) {
    console.error("Error fetching animals:", error);
    throw error;
  }
};
