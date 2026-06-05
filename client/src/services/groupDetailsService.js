import axios from "axios";

const API_URL = "http://localhost:5000/api/groups";
const INVITATION_URL =
  "http://localhost:5000/api/invitations";

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
    `${INVITATION_URL}/${groupId}`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const removeMember = async (
  groupId,
  memberId
) => {

  const token =
    localStorage.getItem("token");

  const response =
    await axios.delete(
      `${API_URL}/${groupId}/member/${memberId}`,
      {
        headers: {
          Authorization:
            `Bearer ${token}`,
        },
      }
    );

  return response.data;
};