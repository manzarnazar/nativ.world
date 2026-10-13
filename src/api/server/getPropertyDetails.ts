import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import { PropertiesApiResponse } from "@/hooks/queries/usePropertyDetails";

export const getPropertyDetails = cache(async ({ slug }: { slug: string }): Promise<PropertiesApiResponse | null> => {
  try {
    const response = await api.get("property-details", { params: { slug } });
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching property details:", response.status, data);
      return data as PropertiesApiResponse;
    }
    return data as PropertiesApiResponse;
  } catch (error) {
    console.error("Error fetching property details:", error);
    return null;
  }
})
