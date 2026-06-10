import api from "./api";

export const createGoal = async (
  groupId,
  goalData
) => {

  const response = await api.post(
    `/goals/${groupId}`,
    goalData,
  );

  return response.data;
};

export const updateGoalStatus = async (
  goalId,
  status
) => {

  const response = await api.put(
    `/goals/${goalId}/status`,
    { status },
  );

  return response.data;
};

export const verifyGoal = async (goalId) => {

  const response = await api.put(
    `/goals/${goalId}/verify`,
    {},
  );

  return response.data;
};

export const deleteGoal = async (goalId) => {

  const response = await api.delete(
    `/goals/${goalId}`,
  );

  return response.data;
};
