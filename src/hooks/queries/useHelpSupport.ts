import { useQuery } from "@tanstack/react-query";
import { getHelpSupportApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface HowItWork {
    id: number;
    title: string;
    description: string;
    sort_order: number;
}

export interface TopicsAndFAQ {
    id: number;
    title: string;
    slug: string;
    description: string;
    sort_order: number;
    faqs: FAQ[];
}

export interface FAQ {
    id: number;
    question: string;
    answer: string;
    sort_order: number;
}

export interface Pagination {
    total: number;
    limit: number;
    offset: number;
    current_page: number;
    last_page: number;
    has_more: boolean;
}

export interface HelpSupportData {
    topics_and_faqs?: TopicsAndFAQ[];
    items?: TopicsAndFAQ[];
    pagination?: Pagination;
    how_it_works: HowItWork[];
}

export interface HelpSupportApiResponse extends Omit<ApiResponseType, 'data'> {
    data: HelpSupportData;
}

export interface HelpSupportFilters {
    search?: string;
    limit?: number;
    offset?: number;
    type?: string; 
}

export const getHelpSupportQueryKey = (filters: HelpSupportFilters = {}) => ["helpSupport", filters] as const;

export const useHelpSupport = (filters: HelpSupportFilters = {}) => {
    return useQuery<HelpSupportApiResponse>({
        queryKey: getHelpSupportQueryKey(filters),
        queryFn: async () => {
            try {
                const response = await getHelpSupportApi({
                    search: filters.search,
                    limit: filters.limit,
                    offset: filters.offset,
                    type: filters.type,
                });
                if (!response) {
                    throw new Error("Failed to fetch help-support data");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to help-support data");
                }
                return response as HelpSupportApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to help-support data";
                throw new Error(apiMessage);
            }
        },
    });
};
