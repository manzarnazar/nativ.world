import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import { ApiResponseType } from "@/types";

export interface EventsItem {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    features: string[];
}

export interface EventsData {
    items: EventsItem[];
}

export interface EventsFilters {
    country_id?: number;
}

export interface EventsApiResponse extends Omit<ApiResponseType, 'data'> {
    data: EventsData;
}
export const getEvents = cache(async (): Promise<EventsApiResponse | null> => {
    try {
        const response = await api.get(apiEndPoints.events, {});
        const data = response.data;
        if (!data || data.error) {
            console.log("Error fetching events:", response.status, data);
            return data as EventsApiResponse;
        }
        return data as EventsApiResponse;
    } catch (error) {
        console.error("Error fetching home page sections:", error);
        return null;
    }
});
