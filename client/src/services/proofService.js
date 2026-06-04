import axios from "axios";

const API_URL = "http://localhost:5000/api/goals";

export const uploadProof = async (
  goalId,
  file
) => {
  const token = localStorage.getItem("token");

  const formData = new FormData();

  formData.append("proof", file);

  const response = await axios.post(
    `${API_URL}/${goalId}/proof`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};