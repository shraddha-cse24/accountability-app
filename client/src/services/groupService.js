import axios from "axios";

const API_URL = "http://localhost:5000/api/groups";

export const getMyGroups = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/my-groups`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const createGroup = async (groupData) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}`,
    groupData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};