import api from "./api";

export const getMyGroups = async () => {

  const response = await api.get(
    `/groups/my-groups`,
  );

  return response.data;
};

export const createGroup = async (groupData) => {

  const response = await api.post(
    `/groups`,
    groupData,
  );

  return response.data;
};

export const deleteGroup = async (
  groupId
) => {

  const response =
    await api.delete(
      `/groups/${groupId}`,
    );

  return response.data;
};

export const leaveGroup = async (
  groupId
) => {

  const response =
    await api.delete(
      `/groups/${groupId}/leave`,
    );

  return response.data;
};