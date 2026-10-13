import { useQuery } from "@tanstack/react-query";
import { getPropertyRulesApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface PropertyRulesFilters {
    country_id?: number | null;
    property_type_id?: string | null;
}

export interface PropertyRulePillOption {
    value: string;
    label: string;
}

export interface PropertyRule {
    question_id: number;
    type: 'yes_no' | 'multiple_select' | 'single_select';
    filter_label: string;
    pill_labels: string[] | PropertyRulePillOption[];
}

export interface PropertyRulesData {
    rules: PropertyRule[];
}

export interface PropertyRulesApiResponse extends Omit<ApiResponseType, 'data'> {
    data: PropertyRulesData;
}

export const useGetPropertyRules = (filters: PropertyRulesFilters = {}, enabled: boolean = true) => {
    return useQuery<PropertyRulesApiResponse>({
        queryKey: ["property-rules", filters],
        enabled,
        queryFn: async () => {
            try {
                const response = await getPropertyRulesApi({
                    country_id: filters?.country_id,
                    property_type_id: filters?.property_type_id,
                });
                if (response?.error) {
                    throw new Error(response?.message || "Failed to fetch property rules");
                }
                return response as PropertyRulesApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch property rules";
                throw new Error(apiMessage);
            }
        },
    });
};
