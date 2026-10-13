import { useMutation } from "@tanstack/react-query";
import { eventInquiriesApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface EventInquiryData {
    inquiry_number: string;
    status: string;
}

export interface EventInquiryFilters {
    event_id?: string | number;
    name?: string;
    email?: string;
    dial_code?: string;
    phone?: string;
    message?: string;
    property_slug?: string;
}

export interface EventInquiryApiResponse extends Omit<ApiResponseType, 'data'> {
    data: EventInquiryData;
}

export const useEventInquiry = () => {
    return useMutation<EventInquiryApiResponse, Error, EventInquiryFilters>({
        mutationFn: async (filters: EventInquiryFilters) => {
            try {
                if (!filters.event_id) {
                    throw new Error("Event id is required");
                }
                const response = await eventInquiriesApi({
                    event_id: filters.event_id,
                    name: filters.name,
                    email: filters.email,
                    dial_code: filters.dial_code,
                    phone: filters.phone,
                    message: filters.message,
                    property_slug: filters.property_slug,
                });
                if (response?.error) {
                    throw new Error(response?.message || "Failed to submit inquiry");
                }
                return response as EventInquiryApiResponse;
            } catch (error: any) {
                const apiMessage =
                    error?.response?.data?.message ||
                    error?.message ||
                    "Failed to submit inquiry";
                throw new Error(apiMessage);
            }
        },
    });
};