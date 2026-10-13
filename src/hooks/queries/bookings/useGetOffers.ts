import { useQuery } from "@tanstack/react-query";
import { getOffersApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";
import { useSelector } from "react-redux";
import { userDataSelector } from "@/redux/reducers/userSlice";

export interface OfferItem {
    id: number;
    type: 'coupon' | 'referral' | string;
    code: string;
    title: string;
    description: string;
    discount_type: 'percentage' | 'fixed' | string;
    discount_value: number;
    discount_label: string;
    max_discount_cap: number;
    min_booking_amount: number;
    status: 'active' | 'inactive' | 'completed' | 'expired' | string;
    expires_at: string;
    is_auto_apply: boolean;
    referee?: string;
    received_at?: string;
    created_at?: string;
    booking_number?: string | null;
    booking_id?: number | null;
}

export interface OffersPagination {
    total: number;
    limit: number;
    offset: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
}

export interface OffersData {
    items: OfferItem[];
    pagination: OffersPagination;
}

export interface OffersApiResponse extends Omit<ApiResponseType, 'data'> {
    data: OffersData;
}

export interface OffersFilters {
    limit?: number;
    offset?: number;
    scope?: 'active' | 'inactive';
    type?: 'coupon' | 'referral' | string;
    property_slug?: string;
}

export const useGetOffers = (filters: OffersFilters = {}) => {
    const userData = useSelector(userDataSelector);
    const isLoggedIn = !!userData?.id;

    return useQuery<OffersApiResponse>({
        queryKey: ["offers", filters],
        enabled: isLoggedIn,
        queryFn: async () => {
            try {
                const response = await getOffersApi({
                    limit: filters.limit,
                    offset: filters.offset,
                    scope: filters.scope,
                    type: filters.type,
                    property_slug: filters.property_slug,
                });
                if (!response) {
                    throw new Error("Failed to fetch offers");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch offers");
                }
                return response as OffersApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch offers";
                throw new Error(apiMessage);
            }
        },
    });
};
