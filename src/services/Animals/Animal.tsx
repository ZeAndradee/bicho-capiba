import { getApiInstance } from "@/hooks/Api";

export const fetchAnimals = async (page: number = 1, limit: number = 10) => {
  try {
    const api = getApiInstance();
    const response = await api.get(`/animals?page=${page}&limit=${limit}`);
    return {
      animals: response.data.result,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error("Error fetching animals:", error);
    throw error;
  }
};

export const likeAnimal = async (animalId: string): Promise<void> => {
  try {
    const api = getApiInstance();
    await api.post(`/animals/${animalId}/like`);
  } catch (error) {
    console.error("Error liking animal:", error);
    throw error;
  }
};

export const unlikeAnimal = async (animalId: string): Promise<void> => {
  try {
    const api = getApiInstance();
    await api.delete(`/animals/${animalId}/like`);
  } catch (error) {
    console.error("Error unliking animal:", error);
    throw error;
  }
};

export const fetchAnimalById = async (animalId: string) => {
  try {
    const api = getApiInstance();
    const response = await api.get(`/animals/${animalId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching animal:", error);
    throw error;
  }
};
