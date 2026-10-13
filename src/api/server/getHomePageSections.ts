import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import { ApiResponseType } from "@/types";
import { Property } from "@/hooks/queries/useProperties";

export interface HomePageSectionCity {
  id: number;
  name: string;
  slug: string;
}

export interface HomePageSectionPropertyType {
  id: number;
  name: string;
}

export type HomePageSectionType = "city_based" | "type_based" | "nearby" | "featured" | string;
export type HomePageSectionDisplayPlatform = "web" | "app" | "both" | string;
export type HomePageSectionSortByRule = "newest" | "price_low_to_high" | "price_high_to_low" | "rating" | string;

export interface HomePageSection {
  id: number;
  section_title: string;
  section_type: HomePageSectionType;
  display_platform: HomePageSectionDisplayPlatform;
  web_display_order: number;
  app_display_order: number;
  sort_by_rule: HomePageSectionSortByRule;
  target_country_id: number
  target_city: HomePageSectionCity | null;
  property_types: HomePageSectionPropertyType[];
  properties_count: number;
  properties: Property[];
}

export interface HomePageSectionsFilters {
  country_id?: number | null;
  limit?: number | null;
  platform?: string
}

export interface HomePageSectionsApiResponse extends Omit<ApiResponseType, 'data'> {
  data: HomePageSection[];
}

export const getHomePageSections = cache(async (filters: HomePageSectionsFilters = {}): Promise<HomePageSectionsApiResponse | null> => {
  const params: Record<string, string> = {};
  if (filters.country_id) params.country_id = String(filters.country_id);
  if (filters.limit) params.limit = String(filters.limit);
  params.platform = filters.platform || "web";

  try {
    const response = await api.get(apiEndPoints.homePageSections, { params });
    const data = response.data;
    if (!data || data.error) {
      console.log("Error fetching home page sections:", response.status, data);
      return data as HomePageSectionsApiResponse
    }
    return data as HomePageSectionsApiResponse;
  } catch (error) {
    console.error("Error fetching home page sections:", error);
    return null;
  }
});
