import { cache } from "react";
import api from "@/api/server/apiMiddleware";
import * as apiEndPoints from "@/api/apiEndPoints";
import {
    ROOMS_LIMIT,
  RoomsApiResponse,
  RoomsFilters,
} from "@/hooks/queries/useRooms";

export const getRooms = cache(
  async (
    filters: RoomsFilters = {},
    page: number = 1
  ): Promise<RoomsApiResponse | null> => {
    const offset = (page - 1) * ROOMS_LIMIT;

    try {
      const response = await api.get(apiEndPoints.rooms, {
        params: {
          room_slug: filters.room_slug || undefined,
          adults: filters.adults || undefined,
          amenities: filters.amenities || undefined,
          check_in: filters.check_in || undefined,
          check_out: filters.check_out || undefined,
          children: filters.children || undefined,
          limit: ROOMS_LIMIT,
          max_price: filters.max_price || undefined,
          min_price: filters.min_price || undefined,
          offset,
          property_slug: filters.property_slug || undefined,
          rooms: filters.rooms || undefined,
          sort_by: filters.sort_by || undefined,
        },
      });

      const data = response.data;

      if (!data || data.error) {
        console.error(
          "Error fetching rooms:",
          response.status,
          data
        );

        return data as RoomsApiResponse;
      }

      return data as RoomsApiResponse;
    } catch (error) {
      console.error("Error fetching rooms:", error);
      return null;
    }
  }
);