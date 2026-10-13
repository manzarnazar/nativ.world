import { useQuery } from "@tanstack/react-query";
import { getPropertiesDropdownApi } from "@/api/client/apiRoutes";
import { ApiResponseType } from "@/types/GlobalTypes";

export interface PropertyDropdown {
  id: number;
  name: string;
  slug: string;
  city: string;
  country: string;
  country_id: number;
}

export interface PropertiesDropdownPagination {
  offset: number;
  has_more: boolean;
}

export interface PropertiesDropdownResponse {
  items: PropertyDropdown[];
  pagination: PropertiesDropdownPagination;
}

export const usePropertiesDropdown = (search?: string, limit = 15, offset = 0, country_id?: number, lat?: number, long?: number, enabled = true) => {
  return useQuery({
    queryKey: ["propertiesDropdown", search, limit, offset, country_id, lat, long],
    enabled,
    queryFn: async () => {
      try {
        const response = await getPropertiesDropdownApi({
          search: search ?? "",
          limit: String(limit),
          offset: String(offset),
          country_id: Number(country_id),
          lat: lat,
          long: long,
        });
        if (response?.error) {
          throw new Error(response?.message || "Failed to fetch properties dropdown");
        }
        return response;
      } catch (error: any) {
        const apiMessage = error?.response?.data?.message || error?.message || "Failed to fetch properties dropdown";
        throw new Error(apiMessage);
      }
    },
    select: (response: ApiResponseType): PropertiesDropdownResponse => ({
      items: (response?.data?.items as PropertyDropdown[]) ?? [],
      pagination: response?.data?.pagination as PropertiesDropdownPagination,
    }),
  });
};
