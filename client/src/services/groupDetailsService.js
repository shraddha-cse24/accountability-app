import api from "./api";

export const getGroupDetails = async (groupId) => {

  const response = await api.get(
    `/groups/${groupId}`,
    
  );

  return response.data;
};

export const addMember = async (
  groupId,
  email
) => {

  const response = await api.post(
    `/invitations/${groupId}`,
    { email },
  );

  return response.data;
};

export const removeMember = async (
  groupId,
  memberId
) => {


  const response =
    await api.delete(
      `/groups/${groupId}/member/${memberId}`,
    );

  return response.data;
};

export const getGroupHistory =
  async (
    groupId,
    days
  ) => {

    const response =
      await api.get(
        `/groups/${groupId}/history?days=${days}`,
      );

    return response.data;
};