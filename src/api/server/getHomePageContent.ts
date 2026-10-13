import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import { ApiResponseType } from "@/types";
import { ReviewItem } from "@/hooks/queries/useReviews";

export interface AboutUsContent {
    title: string;
    description: string;
    button_text: string;
    contact_no: string;
    image: string;
}

export interface Facility {
    id: number;
    name: string;
    icon: string | null;
    category: string | null;
}

export interface Amenity {
    id: number;
    sort_order: number;
    description: string;
    facility: Facility;
}

export interface HomepageContentData {
    about_us: AboutUsContent;
    amenities: Amenity[];
    featured_reviews: ReviewItem[];
}

export interface HomepageContentApiResponse extends Omit<ApiResponseType, 'data'> {
    data: HomepageContentData;
}

export const getHomePageContent = cache(async (): Promise<HomepageContentApiResponse | null> => {
    try {
        const response = await api.get(apiEndPoints.homepage, {
            next: { revalidate: 1800 },
        });
        const data = response.data;
        if (!data || data.error) {
            console.log("Error fetching home page content:", response.status, data);
            return data as HomepageContentApiResponse;
        }
        return data as HomepageContentApiResponse;
    } catch (error) {
        console.error("Error fetching home page sections:", error);
        return null;
    }
});
