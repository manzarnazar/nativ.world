import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getBlogsApi } from "@/api/client/apiRoutes";
import { ApiResponseType, PaginationType } from "@/types/GlobalTypes";


export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface BlogsDataType {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    featured_image: string;
    category: Category;
    published_at: string;
    read_time_minutes: null;
}

export interface BlogsFilter {
    category_id?: number;
    limit?: number;
    offset?: number;
    search?: string;
}

export interface BlogsResponseData {
    items: BlogsDataType[];
    pagination: PaginationType;
}

export interface BlogsApiResponse extends Omit<ApiResponseType, 'data'> {
    data: BlogsResponseData;
}

export const BLOGS_LIMIT = 6;

export const getBlogsQueryKey = (filters: BlogsFilter = {}, page: number = 1) =>
    ["blogs", filters, page] as const;

export const useBlogs = (
    filters: BlogsFilter = {},
    page: number = 1,
    options?: Omit<UseQueryOptions<BlogsApiResponse>, "queryKey" | "queryFn">
) => {
    const offset = (page - 1) * BLOGS_LIMIT;

    return useQuery<BlogsApiResponse>({
        queryKey: getBlogsQueryKey(filters, page),
        ...options,
        queryFn: async () => {
            try {
                const response = await getBlogsApi({
                    category_id: filters.category_id,
                    limit: BLOGS_LIMIT,
                    offset: offset,
                    search: filters.search,
                });
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch blogs");
                }
                return response as BlogsApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch blogs";
                throw new Error(apiMessage);
            }
        },
    });
};