import { useQuery } from "@tanstack/react-query";
import { getNearbyPlacesApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface NearbyPlaceCategory {
    id: number;
    name: string;
    icon: string;
}

export interface NearbyPlace {
    id: number;
    name: string;
    google_place_id: string;
    latitude: string;
    longitude: string;
    address: string;
    distance_km: string;
    rating: string;
}

export interface NearbyPlacesGroup {
    category: NearbyPlaceCategory;
    places: NearbyPlace[];
}

export interface NearbyPlacesApiResponse extends Omit<ApiResponseType, 'data'> {
    data: NearbyPlacesGroup[];
}

export const useNearbyPlaces = (slug: string, enabled: boolean = true) => {
    return useQuery<NearbyPlacesApiResponse>({
        queryKey: ["nearbyPlaces", slug],
        enabled: enabled && !!slug,
        queryFn: async () => {
            try {
                const response = await getNearbyPlacesApi({ slug });
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch nearby places");
                }
                return response as NearbyPlacesApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch nearby places";
                throw new Error(apiMessage);
            }
        },
    });
};
