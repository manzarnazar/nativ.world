import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import { PROPERTIES_LIMIT, PropertiesApiResponse, PropertiesFilters } from "@/hooks/queries/useProperties";

export const getProperties = cache(async (filters: PropertiesFilters = {}, page: number = 1): Promise<PropertiesApiResponse | null> => {
  const offset = (page - 1) * PROPERTIES_LIMIT;

  try {
    const response = await api.get(apiEndPoints.properties, {
      params: {
        slug: filters.slug || undefined,
        adults: filters.adults || undefined,
        amenities: filters.amenities || undefined,
        check_in: filters.check_in || undefined,
        check_out: filters.check_out || undefined,
        children: filters.children || undefined,
        country_id: filters.country_id || undefined,
        lat: filters.lat || undefined,
        lng: filters.lng || undefined,
        radius_km: filters.radius_km || undefined,
        // Listing is only paginated when not looking up a single property by slug — mirrors useProperties.ts.
        ...(filters.slug ? {} : { limit: PROPERTIES_LIMIT, offset }),
        max_price: filters.max_price || undefined,
        min_price: filters.min_price || undefined,
        pay_at_property: filters.pay_at_property || undefined,
        property_type_id: filters.property_type_id?.join(',') || undefined,
        search: filters.search || undefined,
        sort_by: filters.sort_by || undefined,
        city_slug: filters.city_slug || undefined,
        pets: filters.pets ? true : undefined,
        rooms: filters.rooms || undefined,
        ratings: filters.ratings?.join(',') || undefined,
        rules: filters.rules || undefined,
      },
    });
    const data = response.data;

    if (!data || data.error) {
      console.log("Error fetching properties:", response.status, data);
      return data as PropertiesApiResponse;
    }
    return data as PropertiesApiResponse;
  } catch (error) {
    console.error("Error fetching properties:", error);
return null;
  }
})
