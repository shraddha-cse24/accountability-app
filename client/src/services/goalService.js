import axios from "axios";

const API_URL = "http://localhost:5000/api/goals";

export const createGoal = async (
  groupId,
  goalData
) => {
  const token = localStorage.getItem("token");

  const response = await axios.post(
    `${API_URL}/${groupId}`,
    goalData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateGoalStatus = async (
  goalId,
  status
) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${goalId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const verifyGoal = async (goalId) => {
  const token = localStorage.getItem("token");

  const response = await axios.put(
    `${API_URL}/${goalId}/verify`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteGoal = async (goalId) => {
  const token = localStorage.getItem("token");

  const response = await axios.delete(
    `${API_URL}/${goalId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};