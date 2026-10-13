import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import { ReviewsApiResponse, ReviewsFilters } from "@/hooks/queries/useReviews";

const REVIEWS_LIMIT = 4;

export const getReviews = cache(async (filters: ReviewsFilters = {}): Promise<ReviewsApiResponse | null> => {
    try {
        const response = await api.get("reviews", {
            params: {
                limit: REVIEWS_LIMIT,
                offset: 0,
                ...(filters.property_slug && { property_slug: filters.property_slug }),
                ...(filters.room_type_slug && { room_type_slug: filters.room_type_slug }),
                ...(filters.sort && { sort: filters.sort }),
            },
        });
        const data = response.data;
        if (!data || data.error) {
            console.log("Error fetching reviews:", response.status, data);
            return data as ReviewsApiResponse;
        }
        return data as ReviewsApiResponse;
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return null;
    }
})
