import axios from "axios";

const API_URL =
  "http://localhost:5000/api/invitations";

export const getMyInvitations =
  async () => {
    const token =
      localStorage.getItem("token");

    const response = await axios.get(
      `${API_URL}/my`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

export const acceptInvitation =
  async (invitationId) => {
    const token =
      localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/${invitationId}/accept`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };

export const rejectInvitation =
  async (invitationId) => {
    const token =
      localStorage.getItem("token");

    const response = await axios.put(
      `${API_URL}/${invitationId}/reject`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  };