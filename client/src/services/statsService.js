import api from "./api";

export const getMyStats = async () => {

  const response = await api.get(
    `/goals/stats/me`,
  );

  return response.data;
};

export const getMyStreak =
  async () => {

    const response =
      await api.get(
        "/goals/streak/me",
        
      );

    return response.data;
  };

  
export const getTodayProgress =
  async () => {

    const response =
      await api.get(
        "/goals/today-progress",
      );

    return response.data;
  };