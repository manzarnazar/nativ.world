import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import { RoomsApiResponse } from "@/hooks/queries/useRooms";

export const getRoomDetails = cache(async ({ slug }: { slug: string }): Promise<RoomsApiResponse | null> => {
    try {
        const response = await api.get("properties/rooms", { params: { room_slug: slug } });
        const data = response.data;
        if (!data || data.error) {
            console.log("Error fetching room details:", response.status, data);
            return data as RoomsApiResponse;
        }
        return data as RoomsApiResponse;
    } catch (error) {
        console.error("Error fetching property details:", error);
        return null;
    }
})
