import { useQuery } from "@tanstack/react-query";
import { getTranslationsApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface TranslationsData {
    lang_code: string;
    platform_type: string;
    translations: Record<string, string>;
}

export interface TranslationsFilters {
    lang_code?: string;
}

export interface TranslationsApiResponse extends Omit<ApiResponseType, 'data'> {
    data: TranslationsData;
}

export const useLangTranslations = (filters: TranslationsFilters) => {
    return useQuery<TranslationsApiResponse>({
        queryKey: ["translations", filters],
        enabled: !!filters.lang_code,
        queryFn: async () => {
            try {
                const response = await getTranslationsApi({ lang_code: filters.lang_code, platform_type: 'web' });
                if (!response) {
                    throw new Error("Failed to fetch translations");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch translations");
                }
                return response as TranslationsApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch translations";
                throw new Error(apiMessage);
            }
        },
    });
};
