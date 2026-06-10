import api from "./api";

export const uploadProof = async (
  goalId,
  file
) => {

  const formData = new FormData();

  formData.append("proof", file);

  const response = await api.post(
    `/goals/${goalId}/proof`,
    formData,
  );

  return response.data;
};