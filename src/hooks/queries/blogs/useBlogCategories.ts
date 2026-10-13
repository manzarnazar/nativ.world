import { useQuery } from "@tanstack/react-query";
import { getBlogCategoriesApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";
import { Category } from "./useBlogs";



export interface BlogCategoriesApiResponse extends Omit<ApiResponseType, 'data'> {
    data: Category[];
}

export const useBlogCategories = () => {

    return useQuery<BlogCategoriesApiResponse>({
        queryKey: ["blogCategories",],
        queryFn: async () => {
            try {
                const response = await getBlogCategoriesApi();
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch blog categories");
                }
                return response as BlogCategoriesApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch blog categories";
                throw new Error(apiMessage);
            }
        },
    });
};