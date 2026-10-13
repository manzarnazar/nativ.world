import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import { NearbyPlacesApiResponse } from "@/hooks/queries/useNearbyPlaces";

export const getNearbyPlaces = cache(async ({ slug }: { slug: string }): Promise<NearbyPlacesApiResponse | null> => {
    try {
        const response = await api.get(`properties/${slug}/nearby-places`);
        const data = response.data;
        if (!data || data.error) {
            console.log("Error fetching nearby places:", response.status, data);
            return data as NearbyPlacesApiResponse;
        }
        return data as NearbyPlacesApiResponse;
    } catch (error) {
        console.error("Error fetching nearby places:", error);
        return null;
    }
})
