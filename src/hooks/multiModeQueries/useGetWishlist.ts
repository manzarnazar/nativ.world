import { useQuery } from "@tanstack/react-query";
import { getFavoritesListApi } from "@/api/client/apiRoutes";
import { ApiResponseType, PaginationType } from "@/types/GlobalTypes";
import { useSelector } from "react-redux";
import { currentCurrencySelector } from "@/redux/reducers/currencySlice";
import { Property } from "../queries/useProperties";

export interface WishlistFilters {
    limit?: number | null;
    offset?: number | null;
}

export interface WishlistData {
    items: Property[];
    pagination: PaginationType;
}

export interface WishlistApiResponse extends Omit<ApiResponseType, 'data'> {
    data: WishlistData;
}

export const useGetWishlist = (filters: WishlistFilters = {}, enabled: boolean = true) => {
    const currentCurrency = useSelector(currentCurrencySelector);

    return useQuery<WishlistApiResponse>({
        queryKey: ["wishlist", filters, currentCurrency],
        enabled,
        queryFn: async () => {
            try {
                const response = await getFavoritesListApi({
                    limit: filters.limit ?? 10,
                    offset: filters.offset ?? 0,
                });
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch wishlist");
                }
                return response as WishlistApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch wishlist";
                throw new Error(apiMessage);
            }
        },
    });
};
