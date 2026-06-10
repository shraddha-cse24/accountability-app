import api from "./api";

export const getMyInvitations =
  async () => {

    const response = await api.get(
      `/invitations/my`,
    );

    return response.data;
  };

export const acceptInvitation =
  async (invitationId) => {

    const response = await api.put(
      `/invitations/${invitationId}/accept`,
      {},
    );

    return response.data;
  };

export const rejectInvitation =
  async (invitationId) => {

    const response = await api.put(
      `/invitations/${invitationId}/reject`,
      {},
    );

    return response.data;
  };