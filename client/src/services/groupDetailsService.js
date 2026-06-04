import axios from "axios";

const API_URL = "http://localhost:5000/api/groups";

export const getGroupDetails = async (groupId) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/${groupId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const addMember = async (
  groupId,
  email
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/${groupId}/add-member`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};