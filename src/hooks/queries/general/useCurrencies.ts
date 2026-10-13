import { useQuery } from "@tanstack/react-query";
import { getCurrenciesApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface CurrencyDataType {
    currency_name: string;
    currency_code: string;
    currency_symbol: string;
    country_name: string;
    country_iso2: string;
}

export interface CurrenciesData {
    items: CurrencyDataType[];
}

export interface CurrencirsApiResponse extends Omit<ApiResponseType, 'data'> {
    data: CurrenciesData;
}

export const useCurrencies = () => {
    return useQuery<CurrencirsApiResponse>({
        queryKey: ["currencies"],
        queryFn: async () => {
            try {
                const response = await getCurrenciesApi();
                if (!response) {
                    throw new Error("Failed to fetch currencies data");
                }
                if (response?.error) {
                    throw new Error(response?.message || "Failed to currencies data");
                }
                return response as CurrencirsApiResponse;
            } catch (error: any) {
                const apiMessage = error?.response?.data?.message || error?.message || "Failed to currencies data";
                throw new Error(apiMessage);
            }
        },
    });
};