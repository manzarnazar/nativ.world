import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import { HelpSupportApiResponse, HelpSupportFilters } from "@/hooks/queries/useHelpSupport";

export const getHelpSupport = cache(async (filters: HelpSupportFilters = {}): Promise<HelpSupportApiResponse | null> => {
  try {
    const response = await api.get(apiEndPoints.helpSupport, {
      params: {
        limit: filters.limit,
        offset: filters.offset,
        search: filters.search,
        type: filters.type,
      },
    });
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching help support:", response.status, data);
      return data as HelpSupportApiResponse;
    }
    return data as HelpSupportApiResponse;
  } catch (error) {
    console.error("Error fetching help support:", error);
    return null;
  }
});
