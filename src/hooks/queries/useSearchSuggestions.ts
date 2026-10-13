import { useQuery } from "@tanstack/react-query";
import { getSearchSuggestionsApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface LocationSuggestion {
    source: "local" | "osm" | string;
    ref_city_id?: number;
    place_id?: string;
    name: string;
    state: string;
    country: string;
    property_count: number | null;
    latitude: number;
    longitude: number;
}

export interface PropertySuggestion {
    id: number;
    name: string;
    slug: string;
    city: string;
    rating: number | null;
    review_count: number;
    image: string;
}

export interface SearchSuggestionsData {
    locations: LocationSuggestion[];
    properties: PropertySuggestion[];
}

export interface SearchSuggestionsApiResponse extends Omit<ApiResponseType, 'data'> {
    data: SearchSuggestionsData;
}

export const useSearchSuggestions = (query: string, countryId?: number | null) => {
    return useQuery<SearchSuggestionsApiResponse>({
        queryKey: ["searchSuggestions", query, countryId],
        enabled: !!query.trim(),
        queryFn: async () => {
            try {
                const response = await getSearchSuggestionsApi({
                    q: query,
                    country_id: countryId ?? null,
                });
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch search suggestions");
                }
                return response as SearchSuggestionsApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch search suggestions";
                throw new Error(apiMessage);
            }
        },
    });
};
