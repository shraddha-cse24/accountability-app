import api from "./api";

export const createCheckin = async (
  goalId,
  checkinData
) => {

  const response = await api.post(
    `/checkins/${goalId}`,
    checkinData
  );

  return response.data;
};