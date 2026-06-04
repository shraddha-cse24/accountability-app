import axios from "axios";

const API_URL = "http://localhost:5000/api/goals";

export const getMyStats = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/stats/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};