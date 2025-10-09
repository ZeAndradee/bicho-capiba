export const useApi = () => {
  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL || "https://d3f80429b0a0.ngrok-free.app/";

  return { apiUrl };
};
