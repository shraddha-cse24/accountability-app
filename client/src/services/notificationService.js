import api from "./api";

export const getNotifications =
    async () => {

        const response =
            await api.get(
                "/notifications"
            )

        return response.data;
    };

export const markNotificationsRead =
    async () => {

        await api.put(
            "/notifications/read"
        )
    };